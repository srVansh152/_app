const FinancialIncome = require('../models/Financial');
const Payment = require('../models/Payment');
const Society = require('../models/Society');

// Create a new Financial Income record
exports.createFinancialIncome = async (req, res) => {
  const { title, dueDate, description, amount, penaltyAmount, penaltyAfterDays } = req.body;

  try {
    const society = await Society.findById(req.user.society._id).populate('residents');

    const residentStatus = society.residents.map(resident => ({
      residentId: resident._id,
      hasPaid: false,
      penaltyAmount: 0
    }));

    const financialIncome = new FinancialIncome({
      title,
      amount,
      dueDate,
      description,
      adminId: req.user._id,
      societyId: req.user.society._id,
      residentStatus,
      penaltyRules: {
        penaltyAmount,
        penaltyAfterDays
      }
    });

    await financialIncome.save();
    res.status(201).json(financialIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getFinancialIncomes = async (req, res) => {
  try {
    // Fetch financial incomes for the society
    const financialIncomes = await FinancialIncome.find({ societyId: req.user.society._id })
      .populate({
        path: 'residentStatus.residentId',
        select: 'profilePhoto fullName wing unitNumber owner phoneNumber createdAt'
      });

    // Fetch all payments with payment method
    const paymentData = await Payment.find({
      incomeId: { $in: financialIncomes.map(f => f._id) }
    }).select('incomeId residentId hasPaid amount paymentMethod paymentDate');

    // Format the data to include payment status and penalties
    const financialData = financialIncomes.map(financialIncome => {
      const payments = paymentData.filter(payment =>
        payment.incomeId.toString() === financialIncome._id.toString()
      );

      const residentStatuses = financialIncome.residentStatus.map(status => {
        const payment = payments.find(p => 
          p.residentId && p.residentId.toString() === status.residentId?._id.toString()
        );

        // Ensure residentId is not null before accessing its properties
        if (!status.residentId) {
          console.warn('Warning: Resident ID is null for status:', status);
          return null; // or handle the case as needed
        }

        // Get resident details from populated data
        const residentDetails = status.residentId;
        
        // Calculate the penalty if the resident hasn't paid
        const currentDate = new Date();
        const dueDate = new Date(financialIncome.dueDate);
        const daysOverdue = Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24));

        let penaltyAmount = 0;
        if (!status.hasPaid && daysOverdue > 0) {
          const overduePenalty = Math.floor(daysOverdue / financialIncome.penaltyRules.penaltyAfterDays) * financialIncome.penaltyRules.penaltyAmount;
          penaltyAmount = overduePenalty;
        }

        let totalAmount = financialIncome.amount + penaltyAmount;

        if (payment && payment.hasPaid) {
          totalAmount = payment.amount;
          penaltyAmount = 0;
        }

        return {
          resident: {
            _id: residentDetails._id,
            profilePhoto: residentDetails?.profilePhoto || null,
            fullName: residentDetails?.fullName || null,
            wing: residentDetails?.wing || null,
            unitNumber: residentDetails?.unitNumber || null,
            owner: residentDetails?.owner || null,
            phoneNumber: residentDetails?.phoneNumber || null,
            createdAt: residentDetails?.createdAt || null
          },
          hasPaid: payment ? payment.hasPaid : status.hasPaid,
          paymentMethod: payment ? payment.paymentMethod : null,
          paymentDate: payment ? payment.paymentDate : null,
          penaltyAmount: payment && payment.hasPaid ? 0 : penaltyAmount,
          totalAmount: totalAmount
        };
      }).filter(status => status !== null); // Filter out any null statuses

      return {
        financialIncome,
        residentStatuses // Include the resident status with updated payment and penalty info
      };
    });

    res.json(financialData);
  } catch (error) {
    console.error('Error fetching financial incomes:', error);
    res.status(400).json({ message: error.message });
  }
};




// View payment status for each resident in a specific Financial Income record
exports.getFinancialIncomeById = async (req, res) => {
  try {
    const financialIncome = await FinancialIncome.findById(req.params.id)
      .populate('residentStatus.residentId');

    if (!financialIncome) {
      return res.status(404).json({ message: 'Financial Income record not found' });
    }

    res.json(financialIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark a resident as paid for a specific Financial Income

exports.markResidentPaid = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const financialIncome = await FinancialIncome.findById(req.params.id);

    if (!financialIncome) {
      return res.status(404).json({ message: 'Financial Income record not found' });
    }

    console.log(financialIncome);

    // Find the resident's status in the Financial Income record
    const residentStatusIndex = financialIncome.residentStatus.findIndex(
      (status) => status.residentId.toString() === req.user._id.toString()
    );

    if (residentStatusIndex === -1) {
      return res.status(404).json({ message: 'Resident not found in financial income record.' });
    }

    const residentStatus = financialIncome.residentStatus[residentStatusIndex];

    // Calculate the amount including penalties if applicable
    const currentDate = new Date();
    const dueDate = new Date(financialIncome.dueDate);
    const daysOverdue = Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24)); // Calculate overdue days

    // If overdue, apply the penalty
    if (daysOverdue > 0 && !residentStatus.hasPaid) {
      // Assuming penalty is calculated based on the days overdue
      const penalty = Math.floor(daysOverdue / financialIncome.penaltyRules.penaltyAfterDays) * financialIncome.penaltyRules.penaltyAmount;
      residentStatus.penaltyAmount = penalty;
    }

    // Total amount due is the original amount + the penalty (if any)
    const totalAmountDue = financialIncome.amount + residentStatus.penaltyAmount;

    // Now, validate the payment amount, which should be the total amount due (including penalty)
    if (req.body.amount !== totalAmountDue) {
      return res.status(400).send({ message: `Required amount is ₹${totalAmountDue}.` });
    }

    // Check if the resident has already paid for this Financial Income record
    const existingPayment = await Payment.findOne({
      residentId: req.user._id,
      incomeId: financialIncome._id,
      paymentType: 'FinancialIncome'
    });

    if (existingPayment) {
      return res.status(400).json({ message: 'Resident has already paid for this income record.' });
    }

    // Validate payment method
    if (!['cash', 'online'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method. Must be "cash" or "online".' });
    }

    // Create a new payment record
    const payment = new Payment({
      residentId: req.user._id,
      amount: totalAmountDue, // Payment amount is now the total amount due, including penalty
      paymentType: 'FinancialIncome',
      incomeId: financialIncome._id,
      societyId: financialIncome.societyId,
      adminId: req.user._id,
      hasPaid: true,
      paymentDate: new Date(),
      paymentMethod
    });

    await payment.save();

    // Update the hasPaid field in the FinancialIncome record for the resident
    financialIncome.residentStatus[residentStatusIndex].hasPaid = true;
    await financialIncome.save();

    res.json({ message: 'Payment recorded successfully', payment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// exports.updatePenalties = async () => {
//   const financialRecords = await FinancialIncome.find({
//     'residentStatus.hasPaid': false,
//     dueDate: { $lt: new Date() } // Only fetch overdue records
//   });

//   const currentDate = new Date();

//   for (const record of financialRecords) {
//     const daysOverdue = Math.floor((currentDate - new Date(record.dueDate)) / (1000 * 60 * 60 * 24));

//     if (daysOverdue > record.penaltyRules.penaltyAfterDays) {
//       let updated = false; // To track if any penalties were updated

//       record.residentStatus.forEach(resident => {
//         if (!resident.hasPaid) {
//           const extraPenalty = Math.floor((daysOverdue - record.penaltyRules.penaltyAfterDays) / record.penaltyRules.penaltyAfterDays) * record.penaltyRules.penaltyAmount;
//           if (extraPenalty > 0) {
//             resident.penaltyAmount += extraPenalty;
//             updated = true; // Mark as updated if penalty was added
//           }
//         }
//       });

//       // Only save if there was an actual update
//       if (updated) {
//         await record.save(); // Save the updated penalties
//         console.log(`Penalties updated for financial record ${record._id}`);
//       }
//     }
//   }
// };

