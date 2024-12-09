import React, { useState } from 'react'

import { Calendar, Activity, DollarSign, Package, UserCircleIcon, Users, Bell, Settings, LogOut, Edit, Eye, Trash2, Check, X, CheckCircle, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Aside from '../Common/SideBar/AdminSideBar/Aside';




function AddMaintain() {
    const [isOpen, setIsOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [openModel, setOpenModel] = useState(false);
    const [openAddModel, setOpenAddModel] = useState(true);

    const currentYear = new Date().getFullYear();
    const maintenanceDueDate = `${currentYear + 1}-03-13`;

    const [maintenanceData, setMaintenanceData] = useState([
        {
            name: 'John Doe',
            unitNumber: 'A101',
            date: '2023-04-15',
            type: 'Tenant',
            phoneNumber: '123-456-7890',
            amount: 1000,
            penalty: null,
            status: 'Paid',
            paymentMethod: 'Online'
        },
        // Add more sample data as needed
    ]);

    const handleAddDetails = () => {
        setOpenModel(true);
    };

    const handleAdd = () => {
        setOpenAddModel(false);
    };


    const notifications = [
        {
            id: 1,
            user: 'Evelyn Harper',
            userCode: 'A- 101',
            message: 'gave a fund of',
            amount: '1000 rupees for Navratri.',
            time: '30 Minutes ago',
            avatar: '/api/placeholder/40/40',
            type: 'fund'
        },
        {
            id: 2,
            user: 'Evelyn Harper',
            userCode: 'A- 101',
            message: 'gave a',
            linkText: 'Maintenance',
            amount: ' of 1000 rupees.',
            time: '2 days ago',
            avatar: '/api/placeholder/40/40',
            type: 'maintenance'
        },
        {
            id: 3,
            user: 'Ganesh Chaturthi',
            userCode: 'A- 101',
            amount: '₹ 1,500',
            subtitle: 'Per Person Amount :',
            description: 'The celebration of Ganesh Chaturthi involves the installation of clay idols of Lord Ganesh in OutResident.',
            time: '2 days ago',
            type: 'event'
        }
    ];
    return (

        <div>
            <Aside />
            <div className="main">
                <header className="bg-white p-4 border-b flex justify-between items-center shadow-sm sticky top-0">
                    <div className="flex items-center">
                        <input
                            type="search"
                            placeholder="Search Here"
                            className="p-2 pl-4 bg-gray-50 rounded-lg w-64 border-2 border-transparent focus:border-orange-500 focus:outline-none transition-all duration-300"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {/* Notification Bell Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Dropdown Panel */}
                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border overflow-hidden">
                                    {/* Header */}
                                    <div className="flex justify-between items-center p-4 border-b">
                                        <h2 className="font-semibold text-gray-800">Notification</h2>
                                        <button
                                            onClick={() => { }}
                                            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                                        >
                                            Clear all
                                        </button>
                                    </div>

                                    {/* Notification List */}
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div key={notification.id} className="p-4 border-b hover:bg-gray-50 transition-colors">
                                                <div className="flex gap-3">
                                                    {/* Avatar or Icon */}
                                                    {notification.type !== 'event' && (
                                                        <img
                                                            src='/image/3504bec22d3fe96515e7c73aeadb9d13.jpg'
                                                            alt=""
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                    )}
                                                    {notification.type === 'event' && (
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-blue-500 text-xl">G</span>
                                                        </div>
                                                    )}

                                                    {/* Content */}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="text-sm text-gray-800">
                                                                    <span className="font-medium">{notification.user}</span>
                                                                    {notification.userCode && (
                                                                        <span className="text-gray-500"> ({notification.userCode})</span>
                                                                    )}
                                                                </p>
                                                                <p className="text-sm text-gray-600 mt-0.5">
                                                                    {notification.message}
                                                                    {notification.linkText && (
                                                                        <span className="text-blue-500"> {notification.linkText}</span>
                                                                    )}
                                                                    {notification.amount}
                                                                </p>
                                                                {notification.subtitle && (
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        {notification.subtitle} {notification.amount}
                                                                    </p>
                                                                )}
                                                                {notification.description && (
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        {notification.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-gray-400">{notification.time}</span>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-2 mt-3">
                                                            <button className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors flex items-center gap-1">
                                                                <Check className="w-4 h-4" />
                                                                Accept
                                                            </button>
                                                            <button className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors flex items-center gap-1">
                                                                <X className="w-4 h-4" />
                                                                Decline
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to='/editprofile'>

                            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all">
                                <img
                                    src="/api/placeholder/32/32"
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border-2 border-transparent hover:border-orange-500 transition-all"
                                />
                                <div>
                                    <p className="text-sm font-medium">Moni Roy</p>
                                    <p className="text-xs text-gray-500">admin</p>
                                </div>
                            </div>
                        </Link>

                    </div>
                </header>


                <div className="p-8 ">
                    <div className="flex gap-4 p-4 bg-white">
                        {/* Maintenance Amount Card */}
                        <div className="flex-1 bg-white rounded-lg p-4 shadow-sm relative">
                            <div className="absolute left-0 top-4 bottom-4 w-1 bg-green-500 rounded-r-full" />
                            <div className="pl-4">
                                <h3 className="text-sm text-gray-600 font-medium mb-1">Maintenance Amount</h3>
                                <div className="flex items-center">
                                    <span className="text-2xl font-semibold text-gray-900">₹</span>
                                    <span className="text-2xl font-semibold text-gray-900 ml-1">0</span>
                                </div>
                            </div>
                        </div>

                        {/* Penalty Amount Card */}
                        <div className="flex-1 bg-white rounded-lg p-4 shadow-sm relative">
                            <div className="absolute left-0 top-4 bottom-4 w-1 bg-red-500 rounded-r-full" />
                            <div className="pl-4">
                                <h3 className="text-sm text-gray-600 font-medium mb-1">Penalty Amount</h3>
                                <div className="flex items-center">
                                    <span className="text-2xl font-semibold text-gray-900">₹</span>
                                    <span className="text-2xl font-semibold text-gray-900 ml-1">0</span>
                                </div>
                            </div>
                        </div>

                        {/* Set Maintenance Button */}
                        <div className="flex items-center">
                            <button onClick={handleAddDetails} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
                                Set Maintenance
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b mb-6">
                        <div className="flex space-x-4 shadow">
                            <button className="px-4 py-2 text-white bg-orange-500 rounded-t-lg">
                                Maintenance
                            </button>
                            <Link to="/otherincome" className="px-4 py-2 text-gray-600">
                                Other Income
                            </Link>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold">Maintenance Details</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penalty</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {maintenanceData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <UserCircleIcon className="w-8 h-8 text-gray-400 mr-2" />
                                                    {item.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{item.unitNumber}</td>
                                            <td className="px-6 py-4">{item.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === 'Tenant' ? 'bg-pink-100 text-pink-800' : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{item.phoneNumber}</td>
                                            <td className="px-6 py-4 text-green-600">₹ {item.amount}</td>
                                            <td className="px-6 py-4">
                                                {item.penalty ? (
                                                    <span className="text-red-600">{item.penalty}</span>
                                                ) : (
                                                    "--"
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.paymentMethod === 'Online' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {item.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-blue-600 hover:text-blue-800">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>



            </div>

            {openAddModel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-40">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-5">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Maintenance Detail</h2>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Maintenance Amount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                            <input
                                                type="text"
                                                defaultValue="2,000"
                                                className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Penalty Amount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                            <input
                                                type="text"
                                                defaultValue="500"
                                                className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maintenance Due Date
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            defaultValue={maintenanceDueDate}
                                            className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Penalty Applied After Day Selection
                                    </label>
                                    <div className="relative">
                                        <select
                                            defaultValue="4"
                                            className="w-full appearance-none px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                        >
                                            <option value="4">4 Days</option>
                                            <option value="5">5 Days</option>
                                            <option value="6">6 Days</option>
                                            <option value="7">7 Days</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Link to="/admin/financial">
                                        <button onClick={() => setOpenAddModel(false)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                                            Cancel
                                        </button>
                                    </Link>

                                    <button className="flex-1 px-4 py-3 rounded-xl bg-orange-500 text-white font-medium hover:opacity-90 transition-opacity">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default AddMaintain
