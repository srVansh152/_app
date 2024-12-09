import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import UAside from '../../../Common/SideBar/ResidentSideBar/UAside';
import Navbar from '../../../Common/Navbar/Navbar';
import { createComplaint, listComplaints, deleteComplaint } from '../../../../utils/api';



const ComplaintSubmission = () => {

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [openModel, setOpenModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [formData, setFormData] = useState({
    complainerName: "",
    complaintName: "",
    description: "",
    wing: "",
    unit: "",
    priority: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adjustedData = {
      complainerName: formData.complainerName,
      complaintName: formData.complaintName,
      description: formData.description,
      wing: formData.wing,
      unitNumber: formData.unit,
      priority: formData.priority,
      status: formData.status,
    };

    console.log('Data being sent to the server:', adjustedData);

    try {
      const response = await createComplaint(adjustedData);
      console.log(response);
      if (!response.success) {
        throw new Error(`Error: ${response.message || 'Network response was not ok'}`);
      }

      await fetchComplaints();

      setOpenModel(false);
      setFormData({
        complainerName: "",
        complaintName: "",
        description: "",
        wing: "",
        unit: "",
        priority: "",
        status: "",
      });
    } catch (error) {
      console.error('Error saving complaint:', error.message);
    }
  };


  const handleAddModel = () => {
    setOpenModel(true);
  };
  const [complaintToDelete, setComplaintToDelete] = useState(null); // Track which complaint to delete

  const handleDeleteModel = (complaintId) => {
    setDropdownOpen(false)
    setComplaintToDelete(complaintId); // Set the complaint ID to delete
    setOpenDeleteModel(true);
  };



  const [complaintList, setComplaintList] = useState([]);
  const [loading, setLoading] = useState(true); // Step 1: Add loading state

  const fetchComplaints = async () => {
    setLoading(true); // Step 2: Set loading to true before fetching
    const response = await listComplaints();
    if (response.success) {
      console.log(response.data.complaints);
      setComplaintList(response.data.complaints); // Update complaintList with fetched data
    } else {
      console.error(response.message);
    }
    setLoading(false); // Step 2: Set loading to false after fetching
  };
  // Fetch complaints data on component mount
  useEffect(() => {

    fetchComplaints();
  }, []); // Empty dependency array to run only on mount

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleDeleteComplaint = async (complaintId) => {
    try {
      const response = await deleteComplaint(complaintId._id); // Call the delete API
      if (response.success) {
        await fetchComplaints(); // Refresh the complaint list
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      <UAside />
      <div className="flex-1 overflow-auto bg-[#F0F5FB] min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 bg-white mx-3 rounded">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-white bg-orange-500 rounded-lg">
                Complaint Submission
              </button>
              <button className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">
                <Link to="/user/urequestsubmission">
                  Request Submission
                </Link>
              </button>
            </div>
            <button onClick={handleAddModel} className="px-4 py-2 text-white bg-orange-500 rounded-lg">
              Create Complaint
            </button>
          </div>

          <h2 className="mb-4 text-xl font-semibold">Complaint</h2>

          {/* Step 3: Conditionally render loading text */}
          {loading ? (
            <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      
            </div>
          </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {complaintList.map((complaint, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-[#5678E9] px-4 py-2 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">{complaint.complaintName}</h2>
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-6 bg-white rounded"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                      {dropdownOpen === index && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button onClick={() => handleDeleteModel(complaint)}
                        
                            className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3 flex justify-between">
                      <span className="font-semibold">Request Date:</span> {new Date(complaint.createdAt).toLocaleDateString()}
                    </div>
                    <div className="mb-3 flex justify-between">
                      <span className="font-semibold">Status:</span>
                      <span className="ml-2 px-2 py-2 py-1 bg-[#EEF1FD] text-blue-800 rounded-full text-xs">
                        {complaint.status}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className="font-semibold">Description:</span>
                      <p className="mt-1 text-gray-600">{complaint.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
            </div>

      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Complaint</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complainer Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="complainerName"
                    value={formData.complainerName}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complaint Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="complaintName"
                    value={formData.complaintName}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter Description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wing<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="wing"
                      value={formData.wing}
                      onChange={handleChange}
                      placeholder="Enter Wing"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unitNumber}
                      onChange={handleChange}
                      placeholder="Enter Unit"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority<span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    {["High", "Medium", "Low"].map((priority) => (
                      <label key={priority} className="flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value={priority}
                          checked={formData.priority === priority}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{priority}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status<span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    {["Open", "Pending", "Solve"].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={formData.status === status}
                          disabled={status === "Solve"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    onClick={() => setOpenModel(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {openDeleteModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Delete Complaint?
              </h2>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this complaint?
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4 rounded-b-lg">
              <button
                onClick={() => setOpenDeleteModel(false)}
                className="px-4 border py-2 rounded text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteComplaint(complaintToDelete); // Pass the complaint ID to delete function
                  setOpenDeleteModel(false); // Close modal after deletion
                }}
                className="px-4 border ml-3 py-2 rounded bg-red-600 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComplaintSubmission