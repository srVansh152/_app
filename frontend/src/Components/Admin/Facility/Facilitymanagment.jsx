import React, { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, MoreVertical } from 'lucide-react'
import { Link } from 'react-router-dom';
import Aside from '../../Common/SideBar/AdminSideBar/Aside';
import Navbar from '../../Common/Navbar/Navbar';
import { addFacility, getFacilities, updateFacility } from '../../../utils/api';


function Facilitymanagment() {

  const [openModel, setOpenModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [facilityName, setFacilityName] = useState('');
  const [description, setDescription] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [remindBefore, setRemindBefore] = useState('');
  const [facility, setFacility] = useState("Parking Facilities");
  const [details, setDetails] = useState("The celebration of Ganesh Chaturthi involves the installation of clay idols of Ganesa in Resident.");
  const [scheduleDate, setScheduleDate] = useState("2024-02-25");
  const [reminderDays, setReminderDays] = useState("4");
  const [facilities, setFacilities] = useState([]);
  const [facilityId, setfacilityId] = useState("")
  const [loading, setLoading] = useState(true);



  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const response = await getFacilities();
      console.log(response);
      
      if (response.success) {
        setFacilities(response.data);
      } else {
        throw new Error('Failed to fetch facilities');
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const facilityData = {
      facilityName: facilityName,
      description: description,
      scheduleServiceDate: serviceDate,
      remindBeforeDays: remindBefore,
    };
    console.log(facilityData);

    try {
      const response = await addFacility(facilityData)
      console.log(response);

      if (!response.success) {
        throw new Error('Network response was not ok');
      }

      console.log('Facility created successfully:', response);
      // Optionally, reset the form or update the state
      setOpenModel(false);
      fetchFacilities()
    } catch (error) {
      console.error('Error creating facility:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedFacilityData = {
      facilityName: facility,
      description: details,
      scheduleServiceDate: scheduleDate,
      remindBeforeDays: reminderDays,
    };
    console.log(updatedFacilityData);
   
    try {
      console.log(facilityId)
      const response = await updateFacility(facilityId, updatedFacilityData);
      console.log(response);

      if (!response.success) {
        throw new Error('Network response was not ok');
      }

      console.log('Facility updated successfully:', response);
      setOpenEditModel(false);
      fetchFacilities();
    } catch (error) {
      console.error('Error updating facility:', error);
    }
  };

  const handleAddIncome = () => {
    setOpenModel(true);
  };
  
  const handleEdirIncome = (facilityData) => {
    setfacilityId(facilityData._id);
    setFacility(facilityData.facilityName);
    setDetails(facilityData.description);
    setScheduleDate(facilityData.scheduleServiceDate);
    setReminderDays(facilityData.remindBeforeDays);
    setOpenEditModel(true);
  };



  return (
    <div>
      <Aside />
      <div className="main bg-[#F0F5FB] min-h-screen">
        <Navbar />
        {/* Summary Cards */}
        <div className="container-fulid p-2">

          <div className="p-6 bg-white mx-3  overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Facility Managment</h1>
              <button onClick={handleAddIncome} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
                Create Facility
              </button>
            </div>

            {loading ? (
               <div className="flex items-center justify-center p-8">
               <div className="text-center">
                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
         
               </div>
             </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {facilities.map((facility, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden">
                    <div className="bg-[#4F6BF6] text-white p-4 flex justify-between items-center">
                      <h2 className="font-medium">{facility.facilityName}</h2>
                      <div className="flex items-center gap-2">
                        {/* Dropdown Menu for Edit, View, Delete */}
                        <div className="relative group">
                          <button className="text-blue-600 bg-white hover:bg-white p-1 rounded ">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg opacity-0 transform scale-95 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100">
                            <div className="py-1">
                              <button onClick={() => handleEdirIncome(facility)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 ">
                                Edit
                              </button>

                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className="p-4">
                          <div className="flex justify-between mt-2">
                            <p className="text-md text-gray-600 text-left">Upcoming Schedule Service Date</p>
                            <p className="text-sm font-medium text-right"> {facility.scheduleServiceDate} </p>
                          </div>
                         
                        <div className='flex justify-between mt-2'>
                          <p className="text-md text-gray-600 text-left">Description</p>
                          <p className="text-md text-right">{facility.description}</p>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Create Facility</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Facility Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Enter Description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Schedule Service Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={serviceDate}
                      onChange={(e) => setServiceDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Remind Before</label>
                  <div className="relative">
                    <select
                      value={remindBefore}
                      onChange={(e) => setRemindBefore(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white"
                    >
                      <option value="">Select Day</option>
                      <option value="1">1 Day Before</option>
                      <option value="2">2 Days Before</option>
                      <option value="3">3 Days Before</option>
                      <option value="7">1 Week Before</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpenModel(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {openEditModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Edit Facility</h2>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Facility Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Schedule Service Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Remind Before</label>
                  <div className="relative">
                    <select
                      value={reminderDays}
                      onChange={(e) => setReminderDays(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white"
                    >
                      <option value="1">1-day</option>
                      <option value="2">2-day</option>
                      <option value="3">3-day</option>
                      <option value="4">4-day</option>
                      <option value="7">7-day</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setOpenEditModel(false)}
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


    </div>



  )
}

export default Facilitymanagment
