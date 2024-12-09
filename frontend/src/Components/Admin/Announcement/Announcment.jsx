import React, { useEffect, useState } from 'react';
import {  Calendar, Clock, X  } from 'lucide-react'
import { MoreVertical } from "lucide-react"
import Aside from '../../Common/SideBar/AdminSideBar/Aside';
import Navbar from '../../Common/Navbar/Navbar';
import { createAnnouncement, getAnnouncements, deleteAnnouncement, updateAnnouncement, getAnnouncementDetail } from '../../../utils/api';

function Announcment() {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [description, setDescription] = useState("");
  const [announcementDate, setAnnouncementDate] = useState("");
  const [announcementTime, setAnnouncementTime] = useState("");
  const [title, setTitle] = useState("");
  const [descriptionn, setDescriptionn] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [openViewModel, setOpenViewModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcementIdToDelete, setAnnouncementIdToDelete] = useState(null);
  const [announcementIdToEdit, setAnnouncementIdToEdit] = useState(null);
  const [announcementDetails, setAnnouncementDetails] = useState(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the data to be sent to the API
    const announcementData = {
      title: announcementTitle,
      description: description,
      date: announcementDate,
      time: announcementTime,
    };
    console.log(announcementData);
  
    try {
      // Make the API call to save the announcement
      const response = await createAnnouncement(announcementData);

      if (!response.success) {
        throw new Error('Network response was not ok');
      }

      setOpenModel(false)
      fetchAnnouncements()

      console.log(response.data)

    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Prepare the data to be sent to the API
    const editedAnnouncementData = {
      title: title,
      description: descriptionn,
      date: date,
      time: time,
    };
    console.log(editedAnnouncementData);
  
    try {
      // Make the API call to update the announcement
      const response = await updateAnnouncement(announcementIdToEdit, editedAnnouncementData); // Use the ID of the announcement being edited

      if (!response.success) {
        throw new Error('Network response was not ok');
      }

      setOpenEditModel(false);
      fetchAnnouncements(); // Refresh the announcements list

      console.log(response.data);

    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  const handleAddModel = () => {
    setOpenModel(true);
  };

  const handleEditModel = (announcement) => {
    setTitle(announcement.title);
    setDescriptionn(announcement.description);
    setDate(announcement.date);
    setTime(announcement.time);
    setAnnouncementIdToEdit(announcement._id); // Store the ID of the announcement being edited
    setOpenEditModel(true);
  };

  const handleViewModel = async (id) => {
    try {
      const response = await getAnnouncementDetail(id);
      if (response.success) {
        setAnnouncementDetails(response.data);
        setOpenViewModel(true);
      } else {
        throw new Error('Failed to fetch announcement details');
      }
    } catch (error) {
      console.error('Error fetching announcement details:', error);
    }
  };
  const handleDeleteModel = (id) => {
    setOpenDeleteModel(true);
    setAnnouncementIdToDelete(id);
  };

  const handleDeleteAnnouncement = async (id) => {
    console.log(`Deleting announcement with ID: ${id}`);
    try {
      const response = await deleteAnnouncement(id);
      if (response.success) {
        fetchAnnouncements();
      } else {
        throw new Error('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  

  return (
    <div>
      <Aside />
      <div className="main bg-[#F0F5FB] min-h-screen">
      <Navbar/>
        {/* Summary Cards */}
        <div className="container-fulid p-2">

          <div className=" bg-white py-3 px-3 rounded">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Announcement</h1>
              <button onClick={handleAddModel} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
                Create Announcement
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {loading ? (
                <div className="col-span-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                  </div>
                </div>
              ) : (
                announcements.map((announcement, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden">
                    <div className="bg-[#4F6BF6] text-white p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h2 className="font-medium">{announcement.title}</h2>

                      </div>
                      {/* Attach dropdown to all cards */}
                      <div className="relative group">
                        <button className="text-blue-600 bg-white hover:bg-white p-1 rounded">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 ease-in-out">
                          <div className="py-1">
                            <button onClick={() => handleEditModel(announcement)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Edit
                            </button>
                            <button onClick={() => handleViewModel(announcement._id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              View
                            </button>
                            <button onClick={() => handleDeleteModel(announcement._id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        <div className="">
                          <div className=" flex justify-between mt-2">
                            <p className="text-md text-gray-600">Announcement Date</p>
                            <p className="text-md  font-medium">{announcement.date}</p>
                          </div>
                          <div className=" flex justify-between mt-2">
                            <p className="text-md text-gray-600">Announcement Time</p>
                            <p className="text-md font-medium">{announcement.time}</p>
                          </div>
                        </div>
                        <div className='flex justify-between mt-2'>
                          <p className="text-md text-gray-600 ">Description</p>
                          <p className="text-md">{announcement.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-40 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-y-auto max-h-full">
            <div className="p-6">
              <h1 className="text-xl font-semibold mb-6">Add Announcement</h1>

              <div className="space-y-4">
                <form onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm mb-1">
                      Announcement Title<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={announcementTitle}
                      onChange={(e) => setAnnouncementTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Description<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[80px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">
                        Announcement Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={announcementDate}
                        onChange={(e) => setAnnouncementDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">
                        Announcement Time<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={announcementTime}
                        onChange={(e) => setAnnouncementTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setOpenModel(false)}
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {openDeleteModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">Delete Announcement?</h2>
              <p className="text-gray-500">Are you sure you want to delete this announcement?</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setOpenDeleteModel(false)}
                  className="px-6 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteAnnouncement(announcementIdToDelete);
                    setOpenDeleteModel(false);
                  }}
                  className="px-6 py-2.5 text-white font-medium bg-[#f1523d] rounded-lg hover:bg-[#d13d2a] focus:outline-none focus:ring-2 focus:ring-[#f1523d]"
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
              <h1 className="text-xl font-semibold mb-6">Edit Announcement</h1>

              <div className="space-y-4">
                <form onSubmit={handleEditSubmit}>
                  <div>
                    <label className="block text-sm mb-1">
                      Announcement Title<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Description<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={descriptionn}
                      onChange={(e) => setDescriptionn(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[80px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">
                        Announcement Date<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                        <Calendar className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-1">
                        Announcement Time<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                        <Clock className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setOpenEditModel(false)}
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
      {openViewModel && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">View Announcement</h1>
                <button onClick={() => setOpenViewModel(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {announcementDetails && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Title</label>
                    <div className="text-sm">{announcementDetails.title}</div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Description</label>
                    <div className="text-sm">{announcementDetails.description}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Date</label>
                      <div className="text-sm">{announcementDetails.date}</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Time</label>
                      <div className="text-sm">{announcementDetails.time}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    </div>



  )
}

export default Announcment