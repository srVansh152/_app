import React, { useState, useEffect } from 'react'
import { Bell, PencilIcon, Eye, MoreVertical, Plus, Trash, Pencil, Trash2, Camera, Calendar, Clock, ChevronDown, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import Aside from '../../Common/SideBar/AdminSideBar/Aside'
import Navbar from '../../Common/Navbar/Navbar'
import { addSecurityGuard, listSecurityGuards, updateSecurityGuard, viewSecurityGuard, deleteSecurityGuard } from '../../../utils/api'

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

function SecurityGuard() {


  const [openModel, setOpenModel] = useState(false);
  const [openViewModel, setOpenViewModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [shift, setShift] = useState("");
  const [shiftDate, setShiftDate] = useState("");
  const [shiftTime, setShiftTime] = useState("");
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    gender: '',
    shift: '',
    shiftDate: '',
    shiftTime: '',
    profilePhoto: null,
    aadhaarCardImage: null,
    profilePhotoPreview: null,
    aadhaarCardName: '',
    aadhaarCardPreview: null
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [selectedGuardForView, setSelectedGuardForView] = useState(null);

  useEffect(() => {
    fetchGuards();
  }, []);

  const fetchGuards = async () => {
    try {
      setLoading(true);
      const response = await listSecurityGuards();
      if (response.success) {
        console.log(response.data);
        setGuards(response.data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Error fetching guards:', error);
      alert('Failed to fetch security guards');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModel = () => {
    setOpenModel(true);
  };
  const handleViewModel = async (guard) => {
    try {
      const response = await viewSecurityGuard(guard._id);
      if (response.success) {
        setSelectedGuardForView(response.data);
        setOpenViewModel(true);
      } else {
        alert(response.message || 'Failed to fetch guard details');
      }
    } catch (error) {
      console.error('Error viewing guard:', error);
      alert('Failed to fetch guard details');
    }
  };
  const handleDeleteModel = (guard) => {
    setSelectedGuard(guard);
    setOpenDeleteModel(true);
  };
  const handleEditModel = (guard) => {
    setSelectedGuard(guard);
    setFormData({
      fullName: guard.fullName,
      phoneNumber: guard.phoneNumber,
      gender: guard.gender.toLowerCase(),
      shift: guard.shift.toLowerCase(),
      shiftDate: formatDateForInput(guard.shiftDate),
      shiftTime: guard.shiftTime,
      profilePhoto: null,
      aadhaarCardImage: null,
      profilePhotoPreview: guard.profilePhoto,
      aadhaarCardName: 'Previous Aadhaar Card',
      aadhaarCardPreview: guard.aadhaarCardImage
    });
    setOpenEditModel(true);
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert files to base64 if needed
      let profilePhotoBase64 = null;
      let aadhaarCardBase64 = null;

      if (formData.profilePhoto) {
        profilePhotoBase64 = await fileToBase64(formData.profilePhoto);
      }
      if (formData.aadhaarCardImage) {
        aadhaarCardBase64 = await fileToBase64(formData.aadhaarCardImage);
      }

      // Validate required fields
      if (!profilePhotoBase64 || !aadhaarCardBase64) {
        alert("Profile photo and Aadhaar card image are required.");
        return;
      }

      // Create request data object matching the backend expectations
      const requestData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        shift: formData.shift,
        shiftDate: new Date(formData.shiftDate).toISOString(),
        shiftTime: formatShiftTime(formData.shiftTime),
        profilePhoto: profilePhotoBase64,
        aadhaarCardImage: aadhaarCardBase64
      };

      const response = await addSecurityGuard(requestData);
      if (response.success) {
        console.log(response);
        setOpenModel(false);
         fetchGuards();
        // Reset form
        setFormData({
          fullName: '',
          phoneNumber: '',
          gender: '',
          shift: '',
          shiftDate: '',
          shiftTime: '',
          profilePhoto: null,
          aadhaarCardImage: null,
          profilePhotoPreview: null,
          aadhaarCardName: '',
          aadhaarCardPreview: null
        });
        // You might want to refresh the guards list here
        return alert('Security Guard added successfully');
      }
    } catch (error) {
      console.error('Error adding security guard:', error);
      return alert(error.response?.data?.message || 'Failed to add security guard');
    }
  };

  // Helper function to format shift time
  const formatShiftTime = (time) => {
    // Convert 24h time to "HH:00 AM/PM - HH:00 AM/PM" format
    const [hours] = time.split(':');
    const hour = parseInt(hours, 10);

    // Assuming 8-hour shifts
    const startHour = hour;
    const endHour = (startHour + 8) % 24;

    const startPeriod = startHour >= 12 ? 'PM' : 'AM';
    const endPeriod = endHour >= 12 ? 'PM' : 'AM';

    const formattedStart = `${startHour % 12 || 12}:00 ${startPeriod}`;
    const formattedEnd = `${endHour % 12 || 12}:00 ${endPeriod}`;

    return `${formattedStart} - ${formattedEnd}`;
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      profilePhoto: file,
      profilePhotoPreview: URL.createObjectURL(file)
    }));
  };

  const handleAadharUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    // Create preview URL for the new file
    const previewUrl = URL.createObjectURL(file);

    setFormData(prev => ({
      ...prev,
      aadhaarCardImage: file,
      aadhaarCardName: file.name,
      aadhaarCardPreview: previewUrl
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    // Create preview URL for the dropped file
    const previewUrl = URL.createObjectURL(file);

    setFormData(prev => ({
      ...prev,
      aadhaarCardImage: file,
      aadhaarCardName: file.name,
      aadhaarCardPreview: previewUrl
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!selectedGuard?._id) {
      alert('No guard selected for editing');
      return;
    }

    try {
      // Convert files to base64 if needed
      let profilePhotoBase64 = null;
      let aadhaarCardBase64 = null;

      if (formData.profilePhoto) {
        profilePhotoBase64 = await fileToBase64(formData.profilePhoto);
      }
      if (formData.aadhaarCardImage) {
        aadhaarCardBase64 = await fileToBase64(formData.aadhaarCardImage);
      }

      const requestData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        shift: formData.shift,
        shiftDate: new Date(formData.shiftDate).toISOString(),
        shiftTime: formatShiftTime(formData.shiftTime),
        ...(profilePhotoBase64 && { profilePhoto: profilePhotoBase64 }),
        ...(aadhaarCardBase64 && { aadhaarCardImage: aadhaarCardBase64 })
      };

      const response = await updateSecurityGuard(selectedGuard._id, requestData);

      if (response.success) {
        setOpenEditModel(false);
         fetchGuards(); // Refresh the list
        setSelectedGuard(null); // Clear selected guard
        // Reset form
        setFormData({
          fullName: '',
          phoneNumber: '',
          gender: '',
          shift: '',
          shiftDate: '',
          shiftTime: '',
          profilePhoto: null,
          aadhaarCardImage: null,
          profilePhotoPreview: null,
          aadhaarCardName: '',
          aadhaarCardPreview: null
        });
        alert('Security Guard updated successfully');
      } else {
        alert(response.message || 'Failed to update security guard');
      }
    } catch (error) {
      console.error('Error updating security guard:', error);
      alert(error.response?.data?.message || 'Failed to update security guard');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    if (!selectedGuard?._id) {
      alert('No guard selected for deletion');
      return;
    }

    try {
      const response = await deleteSecurityGuard(selectedGuard._id);
      if (response.success) {
        setOpenDeleteModel(false);
         fetchGuards(); // Refresh the list
        setSelectedGuard(null);
        alert('Security Guard deleted successfully');
      } else {
        alert(response.message || 'Failed to delete security guard');
      }
    } catch (error) {
      console.error('Error deleting guard:', error);
      alert('Failed to delete security guard');
    }
  };

  return (
    <>
      <Aside />
      <div className="main ">
        <div className='bg-[#F0F5FB] min-h-screen'>
          <Navbar />
          <div className="py-6 px-4">
            <div className='bg-white p-4 rounded'>
              <div className="flex  justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Security Guard Details</h2>
                <button onClick={handleAddModel} className="bg-gradient-to-r from-[#FE512E] to-[#F09619] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="text-lg">+</span> Add Security
                </button>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                     <div className="flex items-center justify-center p-8">
                     <div className="text-center">
                       <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
               
                     </div>
                   </div>
                ) : (
                  <table className="min-w-full">
                    <thead className='bg-[#EEF1FD] rounded-lg'>
                      <tr className="border-b">
                        <th className="text-left p-4">Security Guard Name</th>
                        <th className="text-left p-4">Phone Number</th>
                        <th className="text-left p-4">Select Shift</th>
                        <th className="text-left p-4">Shift Date</th>
                        <th className="text-left p-4">Shift Time</th>
                        <th className="text-left p-4">Gender</th>
                        <th className="text-left p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guards.map((guard) => (
                        <tr key={guard._id} className="border-b">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={guard.profilePhoto}
                                alt=""
                                className="w-10 h-10 rounded-full"
                              />
                              <span>{guard.fullName}</span>
                            </div>
                          </td>
                          <td className="p-4">{guard.phoneNumber}</td>
                          <td className="p-4">
                            <span
                              className={`px-1 py-1 rounded-full text-md flex justify-center items-center gap-2 ${
                                guard.shift === "day"
                                  ? "bg-[#F4F4F4] text-[#FF9300]"
                                  : "bg-[#4F4F4F] text-white"
                              }`}
                            >
                              <img 
                                src={guard.shift === "day" 
                                  ? "/public/image/securityGurad/light.png" 
                                  : "/public/image/securityGurad/night.png"
                                } 
                                alt="" 
                                className="w-4 h-4"
                              />
                              {guard.shift}

                            </span>
                          </td>
                          <td className="p-4">{formatDate(guard.shiftDate)}</td>
                          <td className="p-4">{guard.shiftTime}</td>
                          <td className="p-4">
                            <span
                              className={`px-1 py-1 rounded-full text-md flex justify-center items-center gap-2 ${guard.gender === "male"
                                ? "bg-[#E9F6FC] text-[#5678E9]"
                                : "bg-[#FFF1F6] text-[#FE76A8]"
                                }`}
                            >
                               <img 
                                src={guard.gender === "male" 
                                  ? "/public/image/securityGurad/male.png" 
                                  : "/public/image/securityGurad/female.png"
                                } 
                                alt="" 
                                className="w-4 h-4"
                              />
                              {guard.gender}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button onClick={() => handleEditModel(guard)} className="p-1 rounded-full hover:bg-gray-100">
                                <img src="/public/image/Dashborad/edit.png" alt="" srcset="" />
                              </button>
                              <button onClick={() => handleViewModel(guard)} className="p-1 rounded-full hover:bg-gray-100">
                                <img src="/public/image/Dashborad/view.png" alt="" srcset="" />

                              </button>
                              <button onClick={() => handleDeleteModel(guard)} className="p-1 rounded-full hover:bg-gray-100">
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
        {openModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Add Security</h2>


                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Photo Upload */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {formData.profilePhotoPreview ? (
                          <img src={formData.profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => document.getElementById('photo-upload').click()}
                        className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg border hover:bg-gray-50"
                      >
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="photo-upload"
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-md font-medium mb-1">
                      Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-md font-medium mb-1">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Gender and Shift */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-md font-medium mb-1">
                        Gender<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-md font-medium mb-1">
                        Shift<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="shift"
                          value={formData.shift}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                          required
                        >
                          <option value="">Select Shift</option>
                          <option value="day">Day</option>
                          <option value="night">Night</option>
                          <option value="evening">Evening</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Shift Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-md font-medium mb-1">
                        Shift Date<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="shiftDate"
                          value={formData.shiftDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                          required
                        />
                        <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-md font-medium mb-1">
                        Shift Time<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          name="shiftTime"
                          value={formData.shiftTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                          required
                        />
                        <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Aadhar Card Upload */}
                  <div>
                    <label className="block text-md font-medium mb-1">
                      Upload Aadhar Card<span className="text-red-500">*</span>
                    </label>
                    <div
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleAadharUpload}
                      />
                      {formData.aadhaarCardPreview ? (
                        <div className="space-y-2">
                          <img
                            src={formData.aadhaarCardPreview}
                            alt="Aadhaar Card"
                            className="mx-auto max-h-32 object-contain"
                          />
                          <p className="text-md text-gray-600">Current Aadhaar Card</p>
                          <p className="text-xs text-blue-600">Click or drag to replace</p>
                        </div>
                      ) : (
                        <>
                          <div className="mx-auto w-12 h-12 border-2 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-2xl">+</span>
                          </div>
                          <div className="text-md font-medium">
                            {formData.aadhaarCardName ? (
                              formData.aadhaarCardName
                            ) : (
                              <>
                                <span className="text-blue-600">Upload a file</span> or drag and drop
                              </>
                            )}
                          </div>
                        </>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF, PDF up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setOpenModel(false)}
                      className="flex-1 px-6 py-2 border rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">View Security Guard Details</h2>
                  <button onClick={() => {
                    setOpenViewModel(false);
                    setSelectedGuardForView(null);
                  }} className="p-1 hover:bg-gray-100 rounded-full">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                    <img
                      src={selectedGuardForView?.profilePhoto}
                      alt={selectedGuardForView?.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-medium">{selectedGuardForView?.fullName}</h3>
                  <p className="text-md text-gray-500">{formatDate(selectedGuardForView?.shiftDate)}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Shift */}
                  <div className="flex flex-col items-center p-3 rounded-lg bg-orange-50">
                    <div className="flex items-center gap-1 text-orange-500 mb-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-md">{selectedGuardForView?.shift}</span>
                    </div>
                    <span className="text-xs text-gray-600">Select Shift</span>
                  </div>

                  {/* Shift Time */}
                  <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium mb-1">{selectedGuardForView?.shiftTime}</span>
                    <span className="text-xs text-gray-600">Shift Time</span>
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col items-center p-3 rounded-lg bg-pink-50">
                    <div className="flex items-center gap-1 text-pink-500 mb-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm">{selectedGuardForView?.gender}</span>
                    </div>
                    <span className="text-xs text-gray-600">Gender</span>
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
                <h2 className="text-xl font-semibold text-gray-900">Delete Security?</h2>

                <p className="text-gray-500">
                  Are you sure you want to delete this Security Guard?
                </p>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => {
                      setOpenDeleteModel(false);
                      setSelectedGuard(null);
                    }}
                    type="button"
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
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
        {openEditModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Edit Security</h2>

                <form className="space-y-6" onSubmit={handleEditSubmit}>
                  {/* Photo Upload */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {formData.profilePhotoPreview ? (
                          <img
                            src={formData.profilePhotoPreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => document.getElementById('edit-photo-upload').click()}
                        className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg border hover:bg-gray-50"
                      >
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="edit-photo-upload"
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Gender and Shift */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Gender<span className="text-red-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Shift<span className="text-red-500">*</span>
                      </label>
                      <select
                        name="shift"
                        value={formData.shift}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      >
                        <option value="Day">Day</option>
                        <option value="Night">Night</option>
                        <option value="Evening">Evening</option>
                      </select>
                    </div>
                  </div>

                  {/* Shift Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Shift Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="shiftDate"
                        value={formData.shiftDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Shift Time<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="shiftTime"
                        value={formData.shiftTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      />
                    </div>
                  </div>

                  {/* Aadhar Card Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Upload Aadhar Card<span className="text-red-500">*</span>
                    </label>
                    <div
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("edit-file-upload")?.click()}
                    >
                      <input
                        id="edit-file-upload"
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleAadharUpload}
                      />
                      {formData.aadhaarCardPreview ? (
                        <div className="space-y-2">
                          <img
                            src={formData.aadhaarCardPreview}
                            alt="Aadhaar Card"
                            className="mx-auto max-h-32 object-contain"
                          />
                          <p className="text-sm text-gray-600">Current Aadhaar Card</p>
                          <p className="text-xs text-blue-600">Click or drag to replace</p>
                        </div>
                      ) : (
                        <>
                          <div className="mx-auto w-12 h-12 border-2 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-2xl">+</span>
                          </div>
                          <div className="text-sm font-medium">
                            {formData.aadhaarCardName ? (
                              formData.aadhaarCardName
                            ) : (
                              <>
                                <span className="text-blue-600">Upload a file</span> or drag and drop
                              </>
                            )}
                          </div>
                        </>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF, PDF up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setOpenEditModel(false)}
                      className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

    </>
  )
}

export default SecurityGuard