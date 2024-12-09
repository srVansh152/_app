const nodemailer = require('nodemailer');
const Resident = require('../models/Resident');
const Society = require('../models/Society');
const Payment = require('../models/Payment'); // Assuming you have a Payment model
const cloudinary = require('cloudinary');
const FinancialIncome = require('../models/Financial');
const OtherIncome = require('../models/OtherIncome');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to generate a random 6-digit password
const generateRandomPassword = () => Math.floor(100000 + Math.random() * 900000).toString();

// Controller to create a new resident
exports.createResident = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.files);

        const files = req.files || {};

        const societyId = req.user.society._id;
        if (!societyId) {
            return res.status(400).json({ message: "Society ID not found in admin's data." });
        }

        // Check if a resident with the same email, phone number, or full name already exists
        const existingResident = await Resident.findOne({
            $or: [
                { email: req.body.email },
                { phoneNumber: req.body.phoneNumber },
                { fullName: req.body.fullName }
            ]
        });

        if (existingResident) {
            return res.status(400).json({ message: "A resident with the same email, phone number, or name already exists." });
        }

        // Check for required files
        const photo = files.photo?.[0]?.path || req.body.photo;
        const aadhaarFront = files.aadhaarFront?.[0]?.path || req.body.aadhaarFront;
        const aadhaarBack = files.aadhaarBack?.[0]?.path || req.body.aadhaarBack;
        const addressProof = files.addressProof?.[0]?.path || req.body.addressProof;
        const rentAgreement = files.rentAgreement?.[0]?.path || req.body.rentAgreement;

        if (!photo || !aadhaarFront || !aadhaarBack || !addressProof || !rentAgreement) {
            return res.status(400).json({ message: "Required document uploads are missing." });
        }

        // Parse JSON strings for nested fields if provided
        const members = typeof req.body.members === 'string' ? JSON.parse(req.body.members) : req.body.members || [];
        const vehicles = typeof req.body.vehicles === 'string' ? JSON.parse(req.body.vehicles) : req.body.vehicles || [];
        const ownerDetails = typeof req.body.ownerDetails === 'string' ? JSON.parse(req.body.ownerDetails) : req.body.ownerDetails;

        // Ensure required fields in `ownerDetails` are present for non-owners
        if (!req.body.owner && (!ownerDetails || !ownerDetails.address || !ownerDetails.phoneNumber || !ownerDetails.fullName)) {
            return res.status(400).json({ message: "Owner details are incomplete or missing for non-owner residents." });
        }

        const randomPassword = generateRandomPassword();

        // Prepare resident data
        const residentData = {
            ...req.body,
            photo,
            aadhaarFront,
            aadhaarBack,
            addressProof,
            rentAgreement,
            members,
            vehicles,
            ownerDetails,
            society: societyId,
            createdBy: req.user._id,
            password: randomPassword,
        };

        const resident = new Resident(residentData);
        await resident.save();

        // Update society's resident list and unit count
        await Society.findByIdAndUpdate(
            societyId,
            {
                $inc: { units: 1 },
                $push: { residents: resident._id }
            },
            { new: true }
        );

        // Send email to resident
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: resident.email,
            subject: 'Welcome to Our Society',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #4CAF50;">User Login Details</h2>
                    <p>Welcome, ${resident.fullName}!</p>
                    <p>Your login credentials are:</p>
                    <table>
                        <tr><td>Email:</td><td>${resident.email}</td></tr>
                        <tr><td>Password:</td><td>${randomPassword}</td></tr>
                    </table>
                    <p>Regards,<br>Society Management Team</p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "Resident created successfully", resident });
    } catch (error) {
        console.error('Error creating resident:', error);
        res.status(500).json({ message: "Failed to create resident", error: error.message });
    }
};
// Controller to update resident details
exports.updateResident = async (req, res) => {
    try {
        const residentId = req.params.id;
        const resident = await Resident.findById(residentId);
        const files = req.files || {};

        if (!resident) return res.status(404).json({ message: "Resident not found" });

        // Initialize updates object with basic fields
        const updates = { ...req.body };

        // Handle file uploads to Cloudinary
        const fileFields = ['photo', 'aadhaarFront', 'aadhaarBack', 'addressProof', 'rentAgreement'];

        for (const field of fileFields) {
            if (files[field]?.[0]) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(files[field][0].path);
                    updates[field] = uploadResponse.secure_url;
                } catch (uploadError) {
                    return res.status(500).json({
                        message: `Failed to upload ${field} to Cloudinary`,
                        error: uploadError.message
                    });
                }
            } else if (req.body[field]) {
                // Keep existing file URL if no new file uploaded
                updates[field] = req.body[field];
            }
        }

        // Parse JSON strings for nested fields if provided
        if (req.body.members) {
            updates.members = typeof req.body.members === 'string' ?
                JSON.parse(req.body.members) : req.body.members;
        }

        if (req.body.vehicles) {
            updates.vehicles = typeof req.body.vehicles === 'string' ?
                JSON.parse(req.body.vehicles) : req.body.vehicles;
        }

        if (req.body.ownerDetails) {
            updates.ownerDetails = typeof req.body.ownerDetails === 'string' ?
                JSON.parse(req.body.ownerDetails) : req.body.ownerDetails;
        }

        // Update resident with new values
        const updatedResident = await Resident.findByIdAndUpdate(
            residentId,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Resident updated successfully',
            resident: updatedResident
        });
    } catch (error) {
        console.error('Error updating resident:', error);
        res.status(500).json({ message: 'Failed to update resident', error: error.message });
    }
};

// Controller to delete a resident
exports.deleteResident = async (req, res) => {
    try {
        const residentId = req.params.id;
        const resident = await Resident.findById(residentId);

        if (!resident) return res.status(404).json({ message: "Resident not found" });

        // Delete the resident directly using deleteOne() instead of remove()
        await Resident.deleteOne({ _id: residentId });

        // Adjust society unit count and remove resident ID from society record
        await Society.findByIdAndUpdate(
            resident.society,
            {
                $inc: { units: -1 },
                $pull: { residents: resident._id }
            },
            { new: true }
        );

        return res.status(200).json({ message: "Resident deleted successfully" });
    } catch (error) {
        console.error('Error deleting resident:', error);
        res.status(500).json({ message: error.message });
    }
};

// Controller to fetch all residents in a society
exports.getResidents = async (req, res) => {
    try {
        const societyId = req.user.society;

        if (!societyId) {
            return res.status(400).json({ message: "Society ID not found." });
        }

        const residents = await Resident.find({ society: societyId });
        res.status(200).json(residents);
    } catch (error) {
        console.error('Error fetching residents:', error);
        res.status(400).json({ message: error.message });
    }
};

// Controller to fetch details of a specific resident
exports.getResidentDetails = async (req, res) => {
    try {
        const residentId = req.params.id;
        
        // Get resident details
        const resident = await Resident.findById(residentId);
        if (!resident) return res.status(404).json({ message: "Resident not found" });

        // Get all payments for this resident
        const payments = await Payment.find({ residentId })
            .populate('incomeId')
            .sort({ paymentDate: -1 });

        // Get all financial incomes for the society
        const financialIncomes = await FinancialIncome.find({ 
            societyId: resident.society,
            'residentStatus.residentId': residentId 
        });

        // Get all other incomes for the society
        const otherIncomes = await OtherIncome.find({ 
            societyId: resident.society 
        });

        // Initialize payment statistics
        const paymentStats = {
            totalDue: 0,
            totalPaid: 0,
            totalPending: 0,
            pendingPayments: [],
            completedPayments: []
        };

        // Create a map of payments by incomeId
        const paymentsByIncomeId = new Map();
        payments.forEach(payment => {
            if (!paymentsByIncomeId.has(payment.incomeId._id.toString())) {
                paymentsByIncomeId.set(payment.incomeId._id.toString(), []);
            }
            paymentsByIncomeId.get(payment.incomeId._id.toString()).push(payment);
        });

        // Process Financial Incomes
        for (const income of financialIncomes) {
            const incomePayments = paymentsByIncomeId.get(income._id.toString()) || [];
            const totalPaidForIncome = incomePayments.reduce((sum, payment) => sum + payment.amount, 0);
            const isPaidFully = totalPaidForIncome >= income.amount;

            // Calculate penalty if not fully paid
            let penaltyAmount = 0;
            if (!isPaidFully) {
                const currentDate = new Date();
                const dueDate = new Date(income.dueDate);
                const daysOverdue = Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24));
                
                if (daysOverdue > 0) {
                    penaltyAmount = Math.floor(daysOverdue / income.penaltyRules.penaltyAfterDays) 
                        * income.penaltyRules.penaltyAmount;
                }
            }

            const remainingAmount = Math.max(0, income.amount - totalPaidForIncome);
            const totalAmount = remainingAmount + penaltyAmount;

            if (incomePayments.length > 0) {
                // Add to completed payments
                incomePayments.forEach(payment => {
                    paymentStats.completedPayments.push({
                        type: 'FinancialIncome',
                        incomeId: income._id,
                        title: income.title,
                        amount: payment.amount,
                        penaltyAmount: payment.penaltyAmount || 0,
                        totalAmount: payment.amount + (payment.penaltyAmount || 0),
                        dueDate: income.dueDate,
                        hasPaid: true,
                        paymentDate: payment.paymentDate,
                        paymentMethod: payment.paymentMethod
                    });
                    paymentStats.totalPaid += payment.amount + (payment.penaltyAmount || 0);
                });
            }

            if (remainingAmount > 0) {
                // Add to pending payments
                paymentStats.pendingPayments.push({
                    type: 'FinancialIncome',
                    incomeId: income._id,
                    title: income.title,
                    amount: remainingAmount,
                    penaltyAmount,
                    totalAmount,
                    dueDate: income.dueDate,
                    hasPaid: false
                });
                paymentStats.totalPending += totalAmount;
            }
        }

        // Process Other Incomes
        for (const income of otherIncomes) {
            const incomePayments = paymentsByIncomeId.get(income._id.toString()) || [];
            const totalPaidForIncome = incomePayments.reduce((sum, payment) => sum + payment.amount, 0);
            const remainingAmount = Math.max(0, income.amount - totalPaidForIncome);

            if (incomePayments.length > 0) {
                // Add to completed payments
                incomePayments.forEach(payment => {
                    paymentStats.completedPayments.push({
                        type: 'OtherIncome',
                        incomeId: income._id,
                        title: income.title,
                        amount: payment.amount,
                        penaltyAmount: 0,
                        totalAmount: payment.amount,
                        dueDate: income.dueDate,
                        hasPaid: true,
                        paymentDate: payment.paymentDate,
                        paymentMethod: payment.paymentMethod
                    });
                    paymentStats.totalPaid += payment.amount;
                });
            }

            if (remainingAmount > 0) {
                // Add to pending payments
                paymentStats.pendingPayments.push({
                    type: 'OtherIncome',
                    incomeId: income._id,
                    title: income.title,
                    amount: remainingAmount,
                    penaltyAmount: 0,
                    totalAmount: remainingAmount,
                    dueDate: income.dueDate,
                    hasPaid: false
                });
                paymentStats.totalPending += remainingAmount;
            }
        }

        paymentStats.totalDue = paymentStats.totalPaid + paymentStats.totalPending;

        // Sort payments by date
        paymentStats.completedPayments.sort((a, b) => 
            new Date(b.paymentDate) - new Date(a.paymentDate)
        );
        paymentStats.pendingPayments.sort((a, b) => 
            new Date(b.dueDate) - new Date(a.dueDate)
        );

        res.status(200).json({
            resident,
            paymentStats,
            payments: {
                pending: paymentStats.pendingPayments,
                completed: paymentStats.completedPayments
            }
        });
    } catch (error) {
        console.error('Error fetching resident details:', error);
        res.status(400).json({ message: error.message });
    }
};