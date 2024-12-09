import React, { useState, useEffect } from 'react'
import { Bell, Eye, FileText, Plus, Pencil, Trash2, Calendar, X } from 'lucide-react'
import Aside from '../../../Common/SideBar/AdminSideBar/Aside';
import Navbar from '../../../Common/Navbar/Navbar';
import { addExpense, listExpenses, deleteExpense, viewExpense, updateExpense } from '../../../../utils/api';

export default function ExpenseTracker() {
    
    const [openModel, setOpenModel] = useState(false);
    const [openEditModel, setOpenEditModel] = useState(false);
    const [openViewModel, setOpenViewModel] = useState(false);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [amount, setAmount] = useState('')
    const [expenses, setExpenses] = useState([]);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [existingFile, setExistingFile] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        date: '',
        amount: '',
        file: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const expenseData = {
        title: 'Rent Or Mortgage',
        description: 'A visual representation of your spending categories visual representation.',
        date: '01/02/2024',
        amount: '1,500',
        bill: {
            name: 'Adharcard Front Side.JPG',
            size: '3.5 MB'
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const editFormData = new FormData(); // Create a new FormData object for editing

        // Set all form data in a single step
        Object.entries({
            id: formData.id,
            title: formData.title,
            description: formData.description,
            date: formData.date,
            amount: formData.amount,
            billImage: formData.file || existingFile // Use new file or existing file
        }).forEach(([key, value]) => {
            if (value) editFormData.set(key, value); // Only set if value exists
        });

        // Log the form data for debugging
        const formDataObject = {};
        editFormData.forEach((value, key) => {
            formDataObject[key] = value; // Convert FormData to a regular object for logging
        });
        console.log('Form Data to be submitted:', formDataObject);

        try {
            const token = localStorage.getItem("token");
            const response = await updateExpense(formData.id, editFormData, token); // Send editFormData
            console.log('Response from updateExpense:', response);

            if (!response.success) {
                throw new Error('Network response was not ok');
            }

            console.log('Expense updated successfully:', response.data);
            fetchExpenses(); // Refresh the expense list after update
            setOpenEditModel(false); // Close the edit modal
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleAddModel = () => {
        setOpenModel(true);
    };

    const handleEditModel = (expense) => {
        setFormData({
            id: expense._id,
            title: expense.title,
            description: expense.description,
            date: expense.date.split('T')[0], // Format date for input
            amount: expense.amount,
            file: null // Reset file to ensure no previous file is carried over
        });
        setExistingFile(expense.billImage); // Store the existing file reference
        setOpenEditModel(true);
    };

 

    const handleViewModel = async (expenseId) => {
        setOpenViewModel(true);
        try {
            const response = await viewExpense(expenseId);
            if (response.success) {
                console.log(response.data);
                setSelectedExpense(response.data);
            } else {
                throw new Error('Failed to fetch expense details');
            }
        } catch (error) {
            console.error('Error fetching expense details:', error);
        }
    };

    const handleDeleteModel = () => {
        setOpenDeleteModel(true);
    };

    const handleDrop = (e) => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && droppedFile.size <= 10 * 1024 * 1024) { // 10MB limit
            setFile(droppedFile)
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) { // 10MB limit
            setFile(selectedFile)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(); // Create a new FormData object
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('amount', amount);
        if (file) {
            formData.append('billImage', file); // Append the file to the form data
        }

        try {
            const token = localStorage.getItem("token");
            const response = await addExpense(formData, token); // Send formData instead of expenseData
            console.log(response);

            if (!response.success) {
                throw new Error('Network response was not ok');
            }

            const data = response.data;
            console.log('Expense submitted successfully:', data);
            fetchExpenses();
            
            // Reset form fields
            setTitle('');
            setDescription('');
            setDate('');
            setAmount('');
            setFile(null);
            setOpenModel(false);
        } catch (error) {
            console.error('Error submitting expense:', error);
        } finally {
            setIsSubmitting(false);
            setOpenModel(false);
        }
    };

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const response = await listExpenses()
            if (response.data) {
                setExpenses(response.data); // Set the fetched expenses to state
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error('No token found. Please log in again.'); // Check if token exists
            }
            console.log(expenseId)
            const response = await deleteExpense(expenseId, token); // Assuming deleteExpense is the API call
            console.log(response);

            if (!response.success) {
                throw new Error(`Failed to delete expense: ${response.message || 'Unknown error'}`); // More informative error message
            }

            console.log('Expense deleted successfully');
            fetchExpenses(); // Refresh the expense list after deletion
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    useEffect(() => {
        fetchExpenses(); // Call the fetch function
    }, []); // Empty dependency array to run once on mount

    

    return (
        <>
            <Aside />
            <div className="main bg-[#F0F5FB]">
                <div className="flex min-h-screen">
                    {/* Sidebar placeholder */}


                    <div className="flex-1">
                       <Navbar/>

                        <main className="py-6 px-4">
                           <div className='bg-white p-5 '>
                           <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-semibold">Add Expenses Details</h1>
                                <button onClick={handleAddModel} className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New Expenses details
                                </button>
                            </div>
                            <div className="border rounded-lg bg-white overflow-x-auto">
                                {isLoading ? (
                                     <div className="flex items-center justify-center p-8">
                                     <div className="text-center">
                                       <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                                       
                                     </div>
                                   </div>
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-[#EEF1FD]">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Title</th>
                                                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Description</th>
                                                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Date</th>
                                                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Amount</th>
                                                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Bill Format</th>
                                                <th scope="col" className="px-12 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {expenses.map((expense, index) => (
                                                <tr key={index} className="">
                                                    <td className="px-6 py-4 whitespace-nowrap">{expense.title}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap max-w-md truncate">{expense.description}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{expense.date.split('T')[0]}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">₹ {expense.amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4" />
                                                            {expense.billImage ? (
                                                                <>
                                                                    Bill Available: <span className="font-semibold">{expense.billImage.name}</span>
                                                                </>
                                                            ) : (
                                                                'Bill Not Available'
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => handleEditModel(expense)} className="p-1 text-green-500 hover:text-green-600 focus:outline-none">
                                                                
                                                                <img src="/public/image/Dashborad/edit.png" alt="" srcset="" />
                                                            </button>
                                                            <button onClick={() => handleViewModel(expense._id)} className="p-1 text-blue-500 hover:text-blue-600 focus:outline-none">
                                                            <img src="/public/image/Dashborad/view.png" alt="" srcset="" />

                                                            </button>
                                                            <button onClick={() => {
                                                                setOpenDeleteModel(true);
                                                                setExpenseToDelete(expense._id); 
                                                            }} className="p-1 text-red-500 hover:text-red-600 focus:outline-none">
                                                                                                                       <img src="/public/image/Dashborad/delete.png" alt="" srcset="" />

                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                           </div>
                        </main>
                    </div>
                </div>
                {openModel && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold">Add Expenses Details</h2>

                                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Title<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter Title"
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Description<span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Enter Description"
                                            rows={3}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">
                                                Date<span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                                    required
                                                />
                                                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">
                                                Amount<span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5">₹</span>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="0000"
                                                    className="w-full px-3 py-2 pl-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Upload Bill<span className="text-red-500">*</span>
                                        </label>
                                        <div
                                            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={handleDrop}
                                            onClick={() => document.getElementById('file-upload')?.click()}
                                        >
                                            <input
                                                id="file-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/png,image/jpeg,image/gif"
                                                onChange={handleFileChange}
                                            />
                                            <div className="mx-auto w-12 h-12 border-2 rounded-lg flex items-center justify-center mb-2">
                                                <span className="text-2xl">+</span>
                                            </div>
                                            <div className="text-sm font-medium">
                                                {file ? file.name : (
                                                    <>
                                                        <span className="text-blue-600">Upload a file</span> or drag and drop
                                                    </>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setOpenModel(false)}
                                            className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-solid border-white border-r-transparent align-[-0.125em] mr-2"></div>
                                                    Saving...
                                                </div>
                                            ) : (
                                                'Save'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                {openEditModel && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-40">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold">Edit Expenses</h2>

                                <form onSubmit={handleEditSubmit} className="mt-6 space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Title<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Description<span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">
                                                Date<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">
                                                Amount<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Upload Bill<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="file"
                                            name="file"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    file: file // Update the file directly
                                                }));
                                            }}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="flex justify-between gap-4 pt-4">
                                        <button
                                            onClick={() => setOpenEditModel(false)}
                                            type="button"
                                            className="flex-1 px-6 py-2 border rounded-md hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                {openViewModel && selectedExpense && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-40">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold">View Expense Details</h2>
                                    <button onClick={() => setOpenViewModel(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm text-gray-500">Title</label>
                                        <p className="mt-1 text-base">{selectedExpense.title}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-500">Description</label>
                                        <p className="mt-1 text-base">{selectedExpense.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-500">Date</label>
                                            <p className="mt-1 text-base">{selectedExpense.date.split('T')[0]}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-500">Amount</label>
                                            <p className="mt-1 text-base">₹ {selectedExpense.amount}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-500">Bill</label>
                                        <div className="mt-1 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-lg border bg-white flex items-center justify-center">
                                                {selectedExpense.billImage ? (
                                                    <img src={selectedExpense.billImage} alt={selectedExpense.billImage.name} className="h-10 w-10 rounded-lg" />
                                                ) : (
                                                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="ml-3 flex flex-col flex-grow">
                                                {selectedExpense.billImage && (
                                                    <p className="text-sm">{selectedExpense.billImage.split('/').pop()}</p>
                                                )}
                                            </div>
                                            <div className="ml-3 flex items-center">
                                                {selectedExpense.billImage && (
                                                    <button
                                                        onClick={() => window.open(selectedExpense.billImage, '_blank')}
                                                        className="text-gray-500 hover:text-gray-700"
                                                    >
                                                        <Eye className="h-5 w-5" /> {/* Eye icon for download */}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {openDeleteModel && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                            <div className="p-6 space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">Delete Expense?</h2>
                                <p className="text-gray-500">Are you sure you want to delete this Expense?</p>
                                <div className="flex gap-4 pt-2">
                                    <button onClick={() => setOpenDeleteModel(false)} type="button" className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                        Cancel
                                    </button>
                                    <button onClick={() => {
                                        handleDeleteExpense(expenseToDelete); // Call delete function with the expense ID
                                        setOpenDeleteModel(false); // Close the modal
                                    }} type="button" className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}

