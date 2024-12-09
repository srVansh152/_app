import React, { useState, useEffect } from 'react'
import { Bell, PencilIcon, Eye, MoreVertical, Plus, Trash } from 'lucide-react'
import { Link } from 'react-router-dom'
import Aside from '../../../Common/SideBar/AdminSideBar/Aside';
import Navbar from '../../../Common/Navbar/Navbar';
import axios from 'axios';
import { createRequest, listRequests, viewRequest, deleteRequest, updateRequest } from '../../../../utils/api';


function RequestTracking() {
  const [requestor, setRequestor] = useState("");
  const [society, setSociety] = useState("");
  const [requestName, setRequestName] = useState("");
  const [description, setDescription] = useState("");
  const [wing, setWing] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [openModal, setOpenModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openViewModel, setOpenViewModal] = useState(false)
  const [openDeleteModel, setOpenDeleteModel] = useState(false)
  const [complaints, setComplaints] = useState([]);
  const [complaintIdToDelete, setComplaintIdToDelete] = useState(null);
  const [complaintIdToEdit, setComplaintIdToEdit] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);


  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await listRequests();
      console.log(response.data.requests);

      setComplaints(response.data.requests);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const complaintData = {
      requestor,
      society,
      requestName,
      description,
      wing,
      unitNumber,
      priority,
      status,
    };


    try {
      const response = await createRequest(complaintData)
      console.log(response);
      fetchComplaints()
      setOpenModal(false); // Close the modal after successful submission

    } catch (error) {
      console.error('Error saving complaint:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedComplaintData = {
      requestor,
      society,
      requestName,
      description,
      wing,
      unitNumber,
      priority,
      status,
    };

    try {
      await updateRequest(complaintIdToEdit, updatedComplaintData); // Call the API to update the complaint
      fetchComplaints(); // Refresh the complaints list
      resetForm(); // Reset form fields after successful edit
      setOpenEditModal(false); // Close the edit modal
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
  }

  // New function to reset form fields
  const resetForm = () => {
    setRequestor("");
    setSociety("");
    setRequestName("");
    setDescription("");
    setWing("");
    setUnitNumber("");
    setPriority("");
    setStatus("");
    setComplaintIdToEdit(null);
  }

  const handleCancelEdit = () => {
    resetForm(); // Reset form fields when canceling
    setOpenEditModal(false); // Close the edit modal
  }

  const handleCreateIncome = () => {
    setOpenModal(true)
  }
  const handleEditIncome = (complaintId) => {
    const complaintToEdit = complaints.find(complaint => complaint._id === complaintId);
    setRequestor(complaintToEdit.requestor); // Populate requestor
    setSociety(complaintToEdit.society); // Populate society
    setRequestName(complaintToEdit.requestName); // Populate requestName
    setDescription(complaintToEdit.description); // Populate description
    setWing(complaintToEdit.wing); // Populate wing
    setUnitNumber(complaintToEdit.unitNumber); // Populate unitNumber
    setPriority(complaintToEdit.priority); // Populate priority
    setStatus(complaintToEdit.status); // Populate status
    setComplaintIdToEdit(complaintId)
    setOpenEditModal(true); // Open the edit modal
  }

  const handleViewIncome = async (complaintId) => {
    setOpenViewModal(true);
    setViewLoading(true);
    console.log(complaintId);

    try {
      const response = await viewRequest(complaintId);
      setSelectedComplaint(response.data.request);
    } catch (error) {
      console.error('Error fetching complaint details:', error);
    } finally {
      setViewLoading(false);
    }
  }

  const handleDeleteIncome = async (complaintId) => {
    setOpenDeleteModel(true);
    console.log(complaintId);

    setComplaintIdToDelete(complaintId);
  }

  const confirmDelete = async () => {
    try {
      await deleteRequest(complaintIdToDelete);
      fetchComplaints();
      setOpenDeleteModel(false);
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  }

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

  return (
    <>
      <Aside />
      <div className="main bg-[#F0F5FB] min-h-screen">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto m-2">
          <div className="container-fluid  p-2">
            <div className='bg-white p-4'>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Request Tracking</h1>
              <button onClick={handleCreateIncome} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                <Plus className="inline-block w-5 h-5 mr-2" />
                Create Request
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {loading ? (
                 <div className="flex items-center justify-center p-8">
                 <div className="text-center">
                   <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
           
                 </div>
               </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#202224] font-medium	font-bold uppercase tracking-wider">
                        Requester Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#202224] font-medium	font-bold uppercase tracking-wider">
                        Request Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#202224] font-medium	font-bold uppercase tracking-wider hidden md:table-cell">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#202224] font-medium	font-bold uppercase tracking-wider">
                        Request Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#202224] font-medium	font-bold uppercase tracking-wider">
                        Unit Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#202224] font-medium	font-bold uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#202224] font-medium	font-bold uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-[#202224] font-medium	font-bold uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {complaints.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                          No requests found
                        </td>
                      </tr>
                    ) : (
                      complaints.map((complaint) => (
                        <tr key={complaint.id} className='hover:bg-gray-50 transition-colors duration-150'>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={''} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{complaint.requestName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-md text-gray-900">{complaint.requestName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-md text-gray-500 max-w-xs truncate">{complaint.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-md text-gray-900">{new Date(complaint.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-md text-gray-900">{complaint.unitNumber}</div>
                            <div className="text-md text-gray-500">{complaint.unitId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-sm py-1 leading-5 font-semibold rounded-full ${getPriorityStyles(complaint.priority)}`}>
                              {complaint.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-sm py-1 leading-5 font-semibold rounded-full ${getStatusStyles(complaint.status)}`}>
                              {complaint.status}
                            </span>
                          </td>
                          <td className=" flex py-4 whitespace-nowrap text-right text-md font-medium">
                            <button onClick={() => handleEditIncome(complaint._id)} className="text-green-600 hover:text-green-900 mr-2">
                              <img src="/public/image/Dashborad/edit.png" alt="" srcset="" />
                              <span className="sr-only">Edit</span>
                            </button>
                            <button onClick={() => handleViewIncome(complaint._id)} className="text-blue-600 hover:text-blue-900 mr-2">
                            <img src="/public/image/Dashborad/view.png" alt="" srcset="" />

                              <span className="sr-only">View</span>
                            </button>
                            <button onClick={() => handleDeleteIncome(complaint._id)} className="text-red-600 hover:text-red-900">
                            <img src="/public/image/Dashborad/delete.png" alt="" srcset="" />

                              <span className="sr-only">Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            </div>
          </div>
        </main>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Create Request</h2>


              <form className="space-y-4" onSubmit={handleSubmit}>
                <input type="hidden" value={requestor} onChange={(e) => setRequestor(e.target.value)} />

                <input type="hidden" value={society} onChange={(e) => setSociety(e.target.value)} />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Request Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={requestName}
                    onChange={(e) => setRequestName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                      value={wing}
                      onChange={(e) => setWing(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium">
                      Unit Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={unitNumber}
                      onChange={(e) => setUnitNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Priority<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="High"
                        checked={priority === "High"}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">High</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="Medium"
                        checked={priority === "Medium"}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Medium</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="Low"
                        checked={priority === "Low"}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Low</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Status<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Open"
                        checked={status === "Open"}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Open</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Pending"
                        checked={status === "Pending"}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Pending</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Solve"
                        checked={status === "Solve"}
                        disabled={status === "Solve"}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Solve</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    Create
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {openEditModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Edit Request</h2>

              <form className="space-y-4" onSubmit={handleEditSubmit}>
                <input type="hidden" value={requestor} onChange={(e) => setRequestor(e.target.value)} />
                <input type="hidden" value={society} onChange={(e) => setSociety(e.target.value)} />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Request Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={requestName}
                    onChange={(e) => setRequestName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                      value={wing}
                      onChange={(e) => setWing(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium">
                      Unit Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={unitNumber}
                      onChange={(e) => setUnitNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Priority<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="High"
                        checked={priority === "High"}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">High</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="Medium"
                        checked={priority === "Medium"}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Medium</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="Low"
                        checked={priority === "Low"}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Low</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Status<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Open"
                        checked={status === "Open"}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Open</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Pending"
                        checked={status === "Pending"}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Pending</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Solve"
                        checked={status === "Solve"}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Solve</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={handleCancelEdit}
                    type="button"
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {openViewModel && selectedComplaint && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="relative p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">View Complaint</h2>
                <button onClick={() => { setOpenViewModal(false) }} className="text-gray-400 hover:text-gray-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="sr-only">Close</span>
                </button>
              </div>

              <div>
                {viewLoading ? (
                  <div className="loader">Loading...</div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3 mb-6">
                      <img
                        src="/placeholder.svg?height=48&width=48"
                        alt="Evelyn Harper"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedComplaint.requestName}</h3>
                        <p className="text-sm text-gray-500">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-500">Request Name</label>
                        <p className="text-gray-900">{selectedComplaint.requestName}</p>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-500">Description</label>
                        <p className="text-gray-900">{selectedComplaint.description}</p>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm text-gray-500">Wing</label>
                          <p className="text-gray-900">{selectedComplaint.wing}</p>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-500">Unit</label>
                          <p className="text-gray-900">{selectedComplaint.unitNumber}</p>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-500">Priority</label>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {selectedComplaint.priority}
                          </span>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-500">Status</label>
                          <span className="text-blue-600">{selectedComplaint.status}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {openDeleteModel && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Delete Request?</h2>
              <p className="text-gray-500">Are you
                sure you want to delete this Request?</p>
              <div className="flex gap-4 pt-2">
                <button onClick={() => setOpenDeleteModel(false)} type="button" className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                  Cancel
                </button>
                <button onClick={confirmDelete} type="button" className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RequestTracking