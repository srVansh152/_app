import React, { useState, useEffect } from 'react'
import { Bell, PencilIcon, Eye, MoreVertical, Plus, Trash } from 'lucide-react'
import Aside from '../../../Common/SideBar/AdminSideBar/Aside';
import Navbar from '../../../Common/Navbar/Navbar';
import { createComplaint, listComplaints, deleteComplaint, updateComplaint, viewComplaint } from '../../../../utils/api';

function CreateComplain() {
  const [reporterName, setReporterName] = useState("Evelyn Harper");
  const [reportTitle, setReportTitle] = useState("Unethical Behavior");
  const [details, setDetails] = useState("The celebration of Ganesh Chaturthi involves the installation of clay idols in Resident.");
  const [section, setSection] = useState("A");
  const [unitNumber, setUnitNumber] = useState("1001");
  const [urgency, setUrgency] = useState("medium");
  const [currentStatus, setCurrentStatus] = useState("open");
  const [openModal, setOpenModal] = useState(false)
  const [openEditModel, setOpenEditModal] = useState(false)
  const [openViewModel, setOpenViewModal] = useState(false)
  const [openDeleteModel, setOpenDeleteModel] = useState(false)
  const [formData, setFormData] = useState({
    complainer: "",
    society: "",
    complaintName: "",
    description: "",
    wing: "",
    unitNumber: "",
    priority: "",
    status: "Pending",
  });
  const [fetchedComplaints, setFetchedComplaints] = useState([]);
  const [complaintIdToDelete, setComplaintIdToDelete] = useState(null);
  const [complaintIdToEdit, setcomplaintIdToEdit] = useState(null);
  const [viewComplaintDetails, setViewComplaintDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const response = await listComplaints();
      setFetchedComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await createComplaint(formData);
        console.log('Complaint created successfully:', response);
        fetchComplaints()
        setOpenModal(false);
        setFormData({
            complainer: "",
            society: "",
            complaintName: "",
            description: "",
            wing: "",
            unitNumber: "",
            priority: "",
            status: "Pending",
        });
    } catch (error) {
        console.error('Error creating complaint:', error);
    }
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
  
  const handleAddModel = () => {
    setOpenModal(true)
  }
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
  const handleViewModel = (complaint) => {
    handleViewComplaint(complaint); // Call the view function with the complaint ID
  }
  const handleDeleteModel = (complaintId) => {
    setOpenDeleteModel(true);
    setComplaintIdToDelete(complaintId);
  };



  const getPriorityStyles = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500 text-white'
      case 'medium':
        return 'bg-blue-500 text-white'
      case 'low':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'solve':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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

  const handleViewComplaint = async (complaintId) => {
    try {
        const response = await viewComplaint(complaintId); // Call the view API
        console.log('Complaint details fetched successfully:', response);
        setViewComplaintDetails(response.data.complaint); // Store the fetched details in state
        setOpenViewModal(true); // Open the view modal
    } catch (error) {
        console.error('Error fetching complaint details:', error);
    }
  };

  return (
    <div>
      <Aside />
      <div className="main bg-[#F0F5FB] min-h-screen">
        <Navbar/>
        <div className='container-fulid p-2'>
        <div className="bg-white mx-3 rounded">
          <div className=" overflow-hidden  p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Create Complaint</h1>
              <button onClick={handleAddModel} className="rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600">
                <Plus className="mr-2 inline-block h-4 w-4"/>
                Create Complaint
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border shadow bg-white">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
          
                </div>
              </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">
                        Complainer Name
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">
                        Complaint Name
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">
                        Description
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">
                        Unit Number
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">
                        Priority
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">
                        Status
                      </th>
                      <th className="px-10 py-3  items-center text-right text-xs font-medium uppercase tracking-wider text-black">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {fetchedComplaints.map((complaint) => (
                      <tr key={complaint._id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <img
                              className="h-8 w-8 rounded-full object-cover"
                              src={complaint.complainer.avatar}
                              alt={complaint.complaintName}
                            />
                            <span className="ml-2 text-[16px] font-medium text-gray-900">{complaint.complaintName}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-[16px] text-gray-900">{complaint.complaintName}</td>
                        <td className="max-w-xs truncate px-6 py-4 text-[16px] text-gray-500">{complaint.description}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-1">
                            <span className="text-[16px] font-medium text-gray-900">{complaint.unitNumber}</span>
                            <span className="text-[16px] text-gray-500">{complaint.unitId}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-2  text-xs font-medium ${getPriorityStyles(
                              complaint.priority
                            )}`}
                          >
                            {complaint.priority}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-2 text-xs font-medium ${getStatusStyles(
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
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-6">Create Complaint</h2>
        
          <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Complainer Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="complainer"
          value={formData.complainer}
          onChange={handleChange}
          placeholder="Enter Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Complaint Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="complaintName"
          value={formData.complaintName}
          onChange={handleChange}
          placeholder="Enter Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Description<span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter Description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Wing<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="wing"
            value={formData.wing}
            onChange={handleChange}
            placeholder="Enter Wing"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Unit<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="unitNumber"
            value={formData.unitNumber}
            onChange={handleChange}
            placeholder="Enter Unit"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Priority<span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          {["High", "Medium", "Low"].map((level) => (
            <label key={level} className="flex items-center">
              <input
                type="radio"
                name="priority"
                value={level}
                onChange={handleChange}
                className="w-4 h-4 text-gray-600"
                checked={formData.priority === level}
              />
              <span className="ml-2 text-sm text-gray-600">{level}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Status<span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          {["Open", "Pending", "Solve"].map((status) => (
            <label key={status} className="flex items-center">
              <input
                type="radio"
                name="status"
                value={status}
                onChange={handleChange}
                className="w-4 h-4 text-gray-600"
                checked={formData.status === status}
                disabled={status === "Solve"}
              />
              <span className="ml-2 text-sm text-gray-600">{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={()=>setOpenModal(false)}
          type="button"
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Create
        </button>
      </div>
    </form>
        </div>
          </div>
        </div>
      )}

{openViewModel && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="relative p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">View Complaint</h2>
            <button onClick={()=> setOpenViewModal(false)} className="text-gray-400 hover:text-gray-500">
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
  )
}

export default CreateComplain