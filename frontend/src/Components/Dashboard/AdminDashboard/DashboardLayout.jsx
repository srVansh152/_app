import React, { useEffect, useState } from 'react';
import { Trash, Activity, DollarSign, Package, Users, Bell, Settings, LogOut, Edit, Eye, Trash2, Check, X, CheckCircle, ChevronDown, PencilIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Aside from '../../Common/SideBar/AdminSideBar/Aside';
import { createImportantNumber, deleteImportantNumber, fetchImportantNumbers, updateImportantNumber, listComplaints, deleteComplaint, updateComplaint, viewComplaint, getFinancialIncomes, getAnnouncements, getResidents, listExpenses } from '../../../utils/api';
import Navbar from '../../Common/Navbar/Navbar';
import { IoMdAddCircle } from "react-icons/io";



const DashboardLayout = () => {

    const [openModel, setOpenModel] = useState(false);
    const [openEditImpModel, setOpenEditImpModal] = useState(false);
    const [openImpDeleteModel, setOpenImpDeleteModel] = useState(false);
    const [openEditModel, setOpenEditModal] = useState(false);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [openViewModel, setOpenViewModel] = useState(false);
    const [name, setname] = useState(''); // State for full name
    const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number
    const [work, setWork] = useState(''); // State for work
    const [importantNumbers, setImportantNumbers] = useState([]); // State for important numbers
    const [deleteId, setDeleteId] = useState(null);
    const [editId, seteditId] = useState(null);
    const [Announcements, setAnnouncements] = useState([])
    const [fetchedComplaints, setFetchedComplaints] = useState([]);
    const [complaintIdToDelete, setComplaintIdToDelete] = useState(null);
    const [complaintIdToEdit, setcomplaintIdToEdit] = useState(null);
    const [viewComplaintDetails, setViewComplaintDetails] = useState(null);
    const [reporterName, setReporterName] = useState("Evelyn Harper")
    const [reportTitle, setReportTitle] = useState("Unethical Behavior");
    const [details, setDetails] = useState("The celebration of Ganesh Chaturthi involves the installation of clay idols in Resident.");
    const [section, setSection] = useState("A");
    const [unitNumber, setUnitNumber] = useState("1001");
    const [urgency, setUrgency] = useState("medium");
    const [currentStatus, setCurrentStatus] = useState("open");
    const [timeframe, setTimeframe] = useState('Month');
    const [pendingMaintenances, setPendingMaintenances] = useState([]); // State for pending maintenances
    const [isLoading, setIsLoading] = useState(true); // New loading state
    const [totalUnits, setTotalUnits] = useState(0); // State for total units
    const [totalExpense, setTotalExpense] = useState(0); // State for total expense
    const [totalIncome, setTotalIncome] = useState("150000"); // State for total expense



    const fetchComplaints = async () => {
        setIsLoading(true); // Set loading to true
        try {
            const response = await listComplaints(); // Replace with your API endpoint

            console.log(response.data.complaints);

            setFetchedComplaints(response.data.complaints); // Assuming the API returns an array of complaints
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            setIsLoading(false); // Set loading to false after fetching
        }
    };

    // New function to fetch total units
    const fetchTotalUnits = async () => {
        try {
            const response = await getResidents(); // Replace with your API endpoint to get residence data
            if (response.success) {
                setTotalUnits(response.data.length); // Assuming the response data is an array of residences
            } else {
                throw new Error('Failed to fetch total units');
            }
        } catch (error) {
            console.error('Error fetching total units:', error);
        }
    };

    // New function to fetch total expense
    const fetchTotalExpense = async () => {
        try {
            const response = await listExpenses(); // Call the API to get expense data
            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                // Assuming response.data is an array of expense objects
                const totalAmount = response.data.reduce((acc, expense) => acc + expense.amount, 0);
                setTotalExpense(totalAmount);
                console.log('Total Amount:', totalAmount); // Log the total amount
            } else {
                console.warn('No expenses found or invalid response structure:', response);
                setTotalExpense(0); // Set to 0 if no expenses are found
            }
        } catch (error) {
            console.error('Error fetching total expense:', error);
        }
    };

    useEffect(() => {
        fetchComplaints();
        fetchAnnouncements();
        loadImportantNumbers();
        fetchPendingMaintenancesData(); // Call the new function
        fetchTotalUnits(); // Call the new function to fetch total units
        fetchTotalExpense(); // Call the new function to fetch total expense
    }, []);

    // New function to fetch pending maintenance data
    const fetchPendingMaintenancesData = async () => {
        try {
            const response = await getFinancialIncomes(); // Fetch financial incomes

            if (response.success) {
                // Filter the data to get only those with hasPaid set to false
                const pendingData = response.data[0].residentStatuses.filter(income => !income.hasPaid);
                console.log(pendingData);
                setPendingMaintenances(pendingData); // Update state with filtered data
                // setPendingMaintenances(response.data[0].residentStatuses);
            } else {
                throw new Error("Failed to fetch pending maintenances");
            }
        } catch (error) {
            console.error("Error fetching pending maintenances:", error);
        }
    };

    const fetchAnnouncements = async () => {

        try {
            const response = await getAnnouncements()
            console.log(response.data);

            if (response.success) {
                setAnnouncements(response.data);
            } else {
                throw new Error('Failed to fetch announcements');
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };




    const handleViewComplaint = async (complaintId) => {
        try {
            const response = await viewComplaint(complaintId); // Call the view API
            console.log('Complaint details fetched successfully:', response);
            setViewComplaintDetails(response.data.complaint); // Store the fetched details in state
            setOpenViewModel(true); // Open the view modal
        } catch (error) {
            console.error('Error fetching complaint details:', error);
        }
    };

    const handleViewModel = (complaint) => {
        handleViewComplaint(complaint); // Call the view function with the complaint ID
    }



    const handleAddDetails = () => {
        setOpenModel(true);
    };



    const handleEditImpmodel = (importantNumber) => {
        setname(importantNumber.name); // Populate name field
        setPhoneNumber(importantNumber.phoneNumber); // Populate phone number field
        setWork(importantNumber.work); // Populate work field
        seteditId(importantNumber._id); // Store the ID of the important number being edited
        setOpenEditImpModal(true); // Open the edit modal
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedComplaint = {
                complainer: reporterName,
                complaintName: reportTitle,
                description: details,
                wing: section,
                unitNumber: unitNumber,
                urgency: urgency,
                status: currentStatus,
            };
            const response = await updateComplaint(complaintIdToEdit, updatedComplaint); // Call the update API
            console.log('Complaint updated successfully:', response);
            setOpenEditModal(false);
            fetchComplaints(); // Refresh the complaints list
        } catch (error) {
            console.error('Error updating complaint:', error);
        }
    };

    const handleDeleteModel = (complaintId) => {
        setOpenDeleteModel(true);
        setComplaintIdToDelete(complaintId);
    };

    const handleDeleteComplaint = async (complaintId) => {
        try {
            console.log(complaintId);

            await deleteComplaint(complaintId); // Call the delete API
            console.log('Complaint deleted successfully');
            fetchComplaints(); // Refresh the complaints list
        } catch (error) {
            console.error('Error deleting complaint:', error);
        }
    };

    const handleEditModel = (complaint) => {
        setcomplaintIdToEdit(complaint._id)
        setReporterName(complaint.complainer);
        setReportTitle(complaint.complaintName);
        setDetails(complaint.description);
        setSection(complaint.wing);
        setUnitNumber(complaint.unitNumber);
        setUrgency(complaint.urgency);
        setCurrentStatus(complaint.status);
        setOpenEditModal(true);
    }


    const chartData = [
        { month: 'Jan', value: 400, type: 'month' },
        { month: 'Feb', value: 300, type: 'month' },
        { month: 'Mar', value: 500, type: 'month' },
        { month: 'Apr', value: 450, type: 'month' },
        { month: 'May', value: 30000, type: 'month' },
        { month: 'Jun', value: 22000, type: 'month' },
        { month: 'Jul', value: 28000, type: 'month' },
        { month: 'Aug', value: 25000, type: 'month' },
        { month: 'Sep', value: 35000, type: 'month' },
        { month: 'Oct', value: 30000, type: 'month' },
        { month: 'Nov', value: 40000, type: 'month' },
        { month: 'Dec', value: 55000, type: 'month' },
        { year: '2022', value: 1600, type: 'year' },
        { year: '2023', value: 1900, type: 'year' },
    ];




    const getPriorityStyles = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-[#E74C3C] text-white'
            case 'medium':
                return 'bg-[#5678E9] text-white'
            case 'low':
                return 'bg-[#39973D] text-white'
            default:
                return 'bg-gray-500 text-white'
        }
    }

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-[#FFC3131A] text-[#FFC313]'
            case 'open':
                return 'bg-[#5678E91A] text-[#5678E9]'
            case 'solve':
                return 'bg-[#39973D1A] text-[#39973D]'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    // Filter the chart data based on the selected timeframe
    const filteredChartData =
        timeframe === 'Month'
            ? chartData.filter((data) => data.type === 'month')
            : chartData.filter((data) => data.type === 'year');

    // Handle dropdown change
    const handleChange = (event) => {
        setTimeframe(event.target.value);
    };



    // Fetch important numbers from the API
    const loadImportantNumbers = async () => {
        const result = await fetchImportantNumbers();
        if (result.success) {
            setImportantNumbers(result.data); // Update the state with fetched data
        } else {
            console.error("Failed to load important numbers:", result.message);
            setImportantNumbers([]); // Reset state on failure
        }
    };


    // Function to handle adding important number
    const handleAddImportantNumber = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            // Prepare the important number data
            const numberData = { name, phoneNumber, work };

            // Call the API
            const response = await createImportantNumber(numberData);

            if (response.success) {
                console.log("New important number:", response.data);

                // Reload the important numbers list
                await loadImportantNumbers();

                // Close the modal
                setOpenModel(false);
            } else {
                console.error("Error:", response.message); // Log the error message
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    // Function to handle deleting important number
    const handleDeleteImportantNumber = async () => {
        if (deleteId) {
            try {
                console.log("Attempting to delete important number with ID:", deleteId);

                // Call the API to delete the number
                const response = await deleteImportantNumber(deleteId);

                if (response.success) {
                    // Update the state to remove the deleted number
                    loadImportantNumbers((prevNumbers) =>
                        prevNumbers.filter((number) => number.id !== deleteId)
                    );
                    setDeleteId(null)
                    // Close the delete modal
                    setOpenImpDeleteModel(false);
                } else {
                    console.error("Error:", response.message); // Log error message
                }
            } catch (error) {
                console.error("Unexpected error while deleting important number:", error);
            }
        } else {
            console.error("Delete ID is missing.");
        }
    };

    const handleEditImportantNumber = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const updatedData = { name, phoneNumber, work }; // Prepare the updated data
            // console.log(id);

            // Call the API to update the important number
            const response = await updateImportantNumber(editId, updatedData);
            // Pass the edit ID and the updated data

            if (response.success) {
                // Log the updated important number
                console.log("Updated important number:", response.data);

                // Reload the important numbers list or update the local state
                await loadImportantNumbers(); // Assuming this function reloads the important numbers list

                seteditId(null)
                // Close the modal
                setOpenEditImpModal(false);
            } else {
                console.error("Error:", response.message); // Log the error message
            }
        } catch (error) {
            console.error("Unexpected error while updating important number:", error);
        }
    };



    // Function to handle opening the delete modal
    const openImpDeleteModal = (id) => {
        setDeleteId(id); // Set the ID of the number to be deleted
        setOpenImpDeleteModel(true); // Open the delete modal
    };

    const getRandomColor = () => {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const totalBalance = totalIncome - totalExpense; // Calculate total balance

    return (<>
        {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 flex items-center justify-center z-50">
                <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>

                    </div>
                </div>
            </div>
        )}
        <Aside />
        <div className="main bg-[#F0F5FB]">
            <div className="flex h-screen bg-gray-50">

                <div className="flex-1 overflow-auto">
                    <Navbar />
                    <main className="p-4 sm:p-4">
                        {/* Stats Cards Section */}
                        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Card 1 */}
                            <div className="box relative flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
                                <div
                                    className="absolute top-5 left-0 h-[52px] w-2 bg-[#FFB480] rounded-r-md"
                                />
                                <div className="ms-3">
                                    <p className="text-[16px] font-medium text-[#202224]">Total Balance</p>
                                    <h2 className="mt-1 text-2xl font-bold text-gray-800">₹ {totalBalance}</h2>
                                </div>

                                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                                    <img
                                        src="/public/image/Dashborad/balance.png"
                                        alt="Balance Icon"
                                        className="text-orange-500 text-2xl"
                                    />
                                </div>
                            </div>


                            {/* Card 2 */}
                            <div className="relative flex items-center justify-between p-4 bg-white rounded-lg shadow-md ">
                                <div
                                    className="absolute top-5 left-0 h-[52px] w-2 bg-[#9CCB9E] rounded-r-md"
                                />

                                <div className="ms-3">
                                    <p className="text-[16px] font-medium text-[#202224]">Total Income</p>
                                    <h2 className="mt-1 text-2xl font-bold text-gray-800">₹ {totalIncome}</h2>
                                </div>
                                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                                    <span className="text-green-500 text-2xl">
                                        <img src="/public/image/Dashborad/money.png" alt="" srcset="" />

                                    </span>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="relative flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

                                <div
                                    className="absolute top-5 left-0 h-[52px] w-2 bg-[#C3CFF9] rounded-r-md"
                                />
                                <div className="ms-3">
                                    <p className="text-[16px] font-medium text-[#202224]">Total Expense</p>
                                    <h2 className="mt-1 text-2xl font-bold text-gray-800">₹ {totalExpense}</h2>
                                </div>
                                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                                    <span className="text-blue-500 text-2xl">
                                        <img src="/public/image/Dashborad/money-send.png" alt="" srcset="" />

                                    </span>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="relative flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

                                <div
                                    className="absolute top-5 left-0 h-[52px] w-2 bg-[#F59BE1] rounded-r-md"
                                />

                                <div className="ms-3">
                                    <p className="text-[16px] font-medium text-[#202224]">Total Unit</p>
                                    <h2 className="mt-1 text-2xl font-bold text-gray-800"> {totalUnits}</h2>
                                </div>
                                <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg">
                                    <span className="text-pink-500 text-2xl">
                                        <img src="/public/image/Dashborad/building-4.png" alt="" srcset="" />

                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* Main Content Section */}
                        <div className="bg-gray-50">
                            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 p-4 sm:p-6 bg-gray-50">
                                {/* Chart Section */}
                                <div className="lg:col-span-4 bg-white rounded-lg shadow-sm p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                                        <h2 className="text-lg sm:text-xl font-semibold">Total Balance</h2>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <select
                                                className="px-4 py-2 border rounded-md bg-white"
                                                onChange={handleChange}
                                                value={timeframe}
                                            >
                                                <option value="Month">Month</option>
                                                <option value="Year">Year</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="h-48 sm:h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={filteredChartData}
                                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                            >
                                                <XAxis dataKey={timeframe === 'Month' ? 'month' : 'year'} />
                                                <YAxis />
                                                <Tooltip />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#4F46E5"
                                                    strokeWidth={2}
                                                    dot={{ fill: '#4F46E5', r: 4 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Important Numbers Section */}
                                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-4 sm:p-6">
                                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                                        <h2 className="text-lg sm:text-xl font-semibold">Important Numbers</h2>

                                        <button onClick={() => {
                                            handleAddDetails();
                                        }} className="px-4 flex  py-2 bg-gradient-to-r from-[#FE512E] to-[#F09619] text-white rounded-md hover:bg-orange-600">
                                            <IoMdAddCircle className='mt-[2px]  me-2 text-[20px]  rounded' />
                                            Add
                                        </button>
                                    </div>
                                    <div className="space-y-4 overflow-y-auto h-48 sm:h-72">
                                        {importantNumbers.length === 0 ? (
                                            <div className="flex items-center justify-center p-8">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>

                                                </div>
                                            </div>
                                        ) : (
                                            importantNumbers.map((number, i) => (
                                                <div key={i} className="p-4 bg-white rounded-lg border">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-2">
                                                            <p className="text-md text-black">Name : <span className="text-[#A7A7A7] text-md">{number.name}</span></p>
                                                            <p className="text-md text-black">Number : <span className="text-[#A7A7A7] text-md">{number.phoneNumber}</span></p>
                                                            <p className="text-md text-black">Work : <span className="text-[#A7A7A7] text-md">{number.work}</span></p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => {
                                                                openImpDeleteModal(number._id)
                                                            }} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                                                <img src="/public/image/Dashborad/delete.png" alt="" srcset="" />
                                                            </button>
                                                            <button onClick={() => handleEditImpmodel(number)} className="p-1 text-green-500 hover:bg-green-50 rounded">
                                                                <img src="/public/image/Dashborad/edit.png" alt="" srcset="" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Pending Maintenances Section */}
                                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-4 sm:p-6">
                                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                                        <h2 className="text-lg sm:text-xl font-semibold">Pending Maintenances</h2>
                                        <a href="#" className="text-blue-500 hover:underline">View all</a>
                                    </div>
                                    <div className="grid gap-4 overflow-y-auto ">
                                        {pendingMaintenances.map((item, index) => (
                                            <div key={index} className="flex border-b border-gray-200 justify-between items-center p-4 bg-white rounded-lg border">
                                                <div className="flex gap-4">
                                                    {item.resident.profilePhoto ? (
                                                        <img src={item.resident.profilePhoto} className="h-10 w-10 rounded-full object-cover border" />
                                                    ) : (
                                                        <img src="/path/to/default-logo.png" alt="Not Found" className="h-10 w-10 rounded-full border" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{item.resident.fullName}</p>
                                                        <p className="text-sm text-gray-500">{"Pending"}</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium text-red-500">{item.totalAmount}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Sections */}
                        <div className="pt-4 sm:p-6 bg-gray-50">
                            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                                {/* Complaint List Section */}
                                <div className="lg:col-span-7 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                                        <h2 className="text-lg sm:text-xl font-semibold">Complaint List</h2>
                                        <select className="p-2 border rounded-lg cursor-pointer">
                                            <option>Month</option>
                                            <option>Quarter</option>
                                            <option>Year</option>
                                        </select>
                                    </div>
                                    <div className="overflow-y-auto h-48 sm:h-60">
                                        <div className="overflow-x-auto rounded-lg border bg-white">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-[#EEF1FD]">
                                                    <tr className='text-center'>
                                                        <th className="px-4 py-3 text-left text-sm font-medium uppercase text-[#202224] font-bold">
                                                            Complainer Name
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-sm font-medium uppercase text-[#202224] font-bold">
                                                            Complaint Name
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-sm font-medium uppercase text-[#202224] font-bold">
                                                            Description
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-sm font-medium uppercase text-[#202224] font-bold">
                                                            Unit Number
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-sm font-medium uppercase text-[#202224] font-bold">
                                                            Priority
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-sm font-medium uppercase text-[#202224] font-bold">
                                                            Status
                                                        </th>
                                                        <th className="px-4 py-3 items-center text-right text-xs font-medium uppercase tracking-wider text-black">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {isLoading ? ( // Check if loading
                                                        <tr>
                                                            <td colSpan="7" className="text-center py-4">
                                                                <div className="flex items-center justify-center p-8">
                                                                    <div className="text-center">
                                                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>

                                                                    </div>
                                                                </div>{/* Loading text */}
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        fetchedComplaints.map((complaint) => (
                                                            <tr key={complaint._id} className="">
                                                                <td className="whitespace-nowrap px-6 py-4">
                                                                    <div className="flex items-center">
                                                                        <img
                                                                            className="h-8 w-8 rounded-full object-cover"
                                                                            src={complaint.complainer.avatar}
                                                                            alt={complaint.complaintName}
                                                                        />
                                                                        <span className="ml-2 text-[16px] font-medium text-[#4F4F4F]">{complaint.complaintName}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="whitespace-nowrap px-6 py-4 text-[16px] text-[#4F4F4F]">{complaint.complaintName}</td>
                                                                <td className="max-w-xs truncate px-6 py-4 text-[16px] text-[#4F4F4F]">{complaint.description}</td>
                                                                <td className="whitespace-nowrap px-6 py-4">
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-[16px] font-medium text-[#4F4F4F]">{complaint.unitNumber}</span>
                                                                        <span className="text-[16px] text-[#4F4F4F]">{complaint.unitId}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="whitespace-nowrap px-6 py-4">
                                                                    <span
                                                                        className={`inline-flex rounded-full px-4 py-2  text-sm font-medium ${getPriorityStyles(
                                                                            complaint.priority
                                                                        )}`}
                                                                    >
                                                                        {complaint.priority}
                                                                    </span>
                                                                </td>
                                                                <td className="whitespace-nowrap px-6 py-4">
                                                                    <span
                                                                        className={`inline-flex rounded-full  px-4 py-2  text-sm font-medium ${getStatusStyles(
                                                                            complaint.status
                                                                        )}`}
                                                                    >
                                                                        {complaint.status}
                                                                    </span>
                                                                </td>
                                                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                                                    <div className="flex justify-end space-x-2">
                                                                        <button onClick={() => handleEditModel(complaint)} className="rounded  text-green-600 hover:bg-green-50">
                                                                            <img src="/public/image/Dashborad/edit.png" alt="" srcset="" />
                                                                        </button>
                                                                        <button onClick={() => handleViewModel(complaint._id)} className="rounded  text-blue-600 hover:bg-blue-50">
                                                                            <img src="/public/image/Dashborad/view.png" alt="" srcset="" />
                                                                        </button>
                                                                        <button onClick={() => handleDeleteModel(complaint._id)} className="rounded  text-red-600 hover:bg-red-50">
                                                                            <img src="/public/image/Dashborad/delete.png" alt="" srcset="" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Upcoming Activities Section */}
                                <div className="lg:col-span-3 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                                        <h2 className="text-lg sm:text-xl font-semibold">Upcoming Activity</h2>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border">
                                            Month
                                            <ChevronDown size={16} />
                                        </button>
                                    </div>
                                    <div className="grid gap-4 overflow-y-auto h-48">
                                        {Announcements.map((item, index) => (
                                            <div key={index} className=" border-b mx-3 border-gray-200 justify-between items-center p-4 bg-white rounded-lg border">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex gap-4">

                                                        <div className={`h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100`}>
                                                            <span className="text-gray-700 font-bold text-sm">
                                                                {item.title ? item.title.charAt(0) : "?"}
                                                            </span>
                                                        </div>
                                                        <div >
                                                            <p className="font-medium">{item.title || "Unnamed Facility"}</p>
                                                            <p className="font-medium text-[#A7A7A7] text-right">{new Date(item.createdAt).toLocaleTimeString() || "No Time Available"}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-[#A7A7A7]">
                                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "No Date Available"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>



                </div>
                {openModel && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="w-[400px] bg-white rounded-lg shadow-lg p-6">
                                <h1 className="font-title text-lg font-semibold text-neutral-900 mb-4">Add Important Number</h1>
                                <form className="space-y-4" onSubmit={handleAddImportantNumber}>
                                    <div>
                                        <label className="block text-neutral-700 text-sm font-medium">
                                            Full Name<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Full Name"
                                            className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            value={name}
                                            onChange={(e) => setname(e.target.value)} // Update state on change
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-neutral-700 text-sm font-medium">
                                            Phone Number<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="+91"
                                            className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)} // Update state on change
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-neutral-700 text-sm font-medium">
                                            Work<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Work"
                                            className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            value={work}
                                            onChange={(e) => setWork(e.target.value)} // Update state on change
                                        />
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        <button
                                            type="button"
                                            className="px-6 py-2 border border-neutral-300 rounded-md text-neutral-500 hover:bg-neutral-100 w-[47%]" onClick={() => setOpenModel(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-gradient-to-r from-[#FE512E] to-[#F09619] text-white rounded-md  w-[47%] hover:bg-gradient-to-r hover:from-[#FE512E] hover:to-[#F09619] transition-all duration-300 hover:text-white"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="onsite-modal-overlay"></div>

                        </div>
                    </div>
                )}
                {openEditImpModel && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="w-[400px] bg-white rounded-lg shadow-lg p-6">
                                <h1 className="font-title text-lg font-semibold text-neutral-900 mb-4">Edit Important Number</h1>
                                <form className="space-y-4" onSubmit={handleEditImportantNumber}>
                                    <div>
                                        <label className="block text-neutral-700 text-sm font-medium">
                                            Full Name<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setname(e.target.value)} // Update the name state
                                            placeholder="Enter Full Name"
                                            className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-neutral-700 text-sm font-medium">
                                            Phone Number<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)} // Update the phone number state
                                            placeholder="+91"
                                            className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-neutral-700 text-sm font-medium">
                                            Work<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={work}
                                            onChange={(e) => setWork(e.target.value)} // Update the work state
                                            placeholder="Enter Work"
                                            className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        <button
                                            type="button"
                                            className="px-6 py-2 border border-neutral-300 rounded-md text-neutral-500 hover:bg-neutral-100 w-[47%]"
                                            onClick={() => setOpenEditImpModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-[#F6F8FB] text-black rounded-md w-[47%] hover:bg-gradient-to-r hover:from-[#FE512E] hover:to-[#F09619] transition-all duration-300 hover:text-white"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="onsite-modal-overlay"></div>
                        </div>
                    </div>
                )}

                {openEditModel && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                            <div className="p-6 space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">Edit Complaint</h2>
                                <form className="space-y-4" onSubmit={handleEditSubmit}>
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium">
                                            Complainer Name<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={reporterName}
                                            onChange={(e) => {
                                                setReporterName(e.target.value);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium">
                                            Complaint Name<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={reportTitle}
                                            onChange={(e) => {
                                                setReportTitle(e.target.value);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium">
                                            Description*<span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={details}
                                            onChange={(e) => {
                                                setDetails(e.target.value);
                                            }}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium">
                                                Wing<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={section}
                                                onChange={(e) => {
                                                    setSection(e.target.value);

                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium">
                                                Unit<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={unitNumber}
                                                onChange={(e) => {
                                                    setUnitNumber(e.target.value);

                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium">
                                            Urgency<span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-4">
                                            {["high", "medium", "low"].map((level) => (
                                                <label key={level} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="urgency"
                                                        value={level}
                                                        checked={urgency === level}
                                                        onChange={(e) => {
                                                            setUrgency(e.target.value);

                                                        }}
                                                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                                    />
                                                    <span className="ml-2 text-sm">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium">
                                            Status<span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-4">
                                            {["open", "pending", "resolved"].map((status) => (
                                                <label key={status} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value={status}
                                                        checked={currentStatus === status}
                                                        onChange={(e) => {
                                                            setCurrentStatus(e.target.value);

                                                        }}
                                                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                                    />
                                                    <span className="ml-2 text-sm">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={() => setOpenEditModal(false)}
                                            type="button"
                                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                {openDeleteModel && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                            <div className="p-6 space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">Delete Complaint?</h2>
                                <p className="text-gray-500">Are you sure you want to delete this Complaint?</p>
                                <div className="flex gap-4 pt-2">
                                    <button onClick={() => setOpenDeleteModel(false)} type="button" className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDeleteComplaint(complaintIdToDelete); // Call delete function with the stored ID
                                            setOpenDeleteModel(false); // Close the modal
                                        }}
                                        type="button"
                                        className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            {openViewModel && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                        <div className="relative p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">View Complaint</h2>
                                <button onClick={() => setOpenViewModel(false)} className="text-gray-400 hover:text-gray-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>

                            {viewComplaintDetails && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-500">Request Name</label>
                                        <p className="text-gray-900">{viewComplaintDetails.complaintName}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-500">Description</label>
                                        <p className="text-gray-900">{viewComplaintDetails.description}</p>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-500">Wing</label>
                                            <p className="text-gray-900">{viewComplaintDetails.wing}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-500">Unit</label>
                                            <p className="text-gray-900">{viewComplaintDetails.unitNumber}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-500">Priority</label>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {viewComplaintDetails.priority}
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-500">Status</label>
                                            <span className="text-blue-600">{viewComplaintDetails.status}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {openImpDeleteModel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Delete Number?</h2>
                                <p className="text-gray-600 mb-6">Are you sure you want to delete this number?</p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => setOpenImpDeleteModel(false)}
                                        className="px-4 py-2 rounded-md text-gray-600 border rounded-md hover:bg-gray-100 w-[47%]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteImportantNumber}
                                        className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 w-[47%]"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
    );
};



const StatsCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg p-6 flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
        <div>
            <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{label}</p>
            <p className="text-2xl font-semibold mt-1 group-hover:scale-105 transition-transform">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${color}`}>
            <Icon className="w-5 h-5 text-white" />
        </div>
    </div>
);









const statsCards = [
    { label: 'Total Balance', value: '₹ 2,22,520', icon: DollarSign, color: 'bg-orange-500' },
    { label: 'Total Income', value: '₹ 55,000', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Total Expense', value: '₹ 20,550', icon: DollarSign, color: 'bg-blue-500' },
    { label: 'Total Unit', value: '20', icon: Users, color: 'bg-purple-500' }
];



export default DashboardLayout;
