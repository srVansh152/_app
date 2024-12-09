import React, { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, MoreVertical } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import Aside from '../../../Common/SideBar/AdminSideBar/Aside';
import Navbar from '../../../Common/Navbar/Navbar';
import { addNote, getNotes, updateNote, deleteNote } from '../../../../utils/api';




function Note() {

  const [openModal, setOpenModal] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState([]);
  const [noteId, setNoteId] = useState(null);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);


  const FatchNotes = async () => {
    try {
      setLoading(true);
      const response = await getNotes()
      console.log(response)
      if (response.success) {
        setNotes(response.data);
      } else {
        throw new Error('Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FatchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const noteData = {
      title,
      description,
      date
    };

    try {
      const response = await addNote(noteData)

      if (!response.success) {
        throw new Error('Network response was not ok');
      }
      setOpenModal(false)
      FatchNotes();

      const result = response
      navigate("/admin/note")

      console.log('Note created successfully:', result);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const noteData = { title: title, description: description, date: date }; // Prepare the data
      const response = await updateNote(noteId, noteData); // Call the updateNote function with the note ID and data
      if (response.success) {
        FatchNotes()
        console.log("Note updated successfully:", response.data);
        setOpenEditModel(false);
      } else {
        console.error("Failed to update note:", response.message);
      }
    } catch (error) {
      console.error("Error in handleEditSubmit:", error);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      const response = await deleteNote(noteId);
      if (response.success) {
        console.log("Note deleted successfully:", response.message);
        FatchNotes();
      } else {
        console.error("Failed to delete note:", response.message);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleAddModel = () => {
    setOpenModal(true);
  };
  const handleEditModel = (note) => {
    console.log(note._id)
    setTitle(note.title);
    setDescription(note.description);
    setDate(note.date);
    setNoteId(note._id);
    setOpenEditModel(true);
  };



  return (
    <div>
      <Aside />
      <div className="main bg-[#F0F5FB] min-h-screen">
        <Navbar />
        {/* Summary Cards */}
     <div className='bg-white mx-4 rounded'>
     <div className="container-fulid">

<div className="p-6  overflow-hidden">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-semibold text-gray-900">Note</h1>
    <button onClick={handleAddModel} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
      Create Note
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
      {notes.map((note, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden">
          <div className="bg-[#4F6BF6] text-white p-4 flex justify-between items-center">
            <h2 className="font-medium">{note.title}</h2>
            <div className="flex items-center gap-2">
              {/* New Dropdown Button */}
              <div className="relative group">
                <button className="text-blue-600 bg-white hover:bg-white p-1 rounded ">
                  <MoreVertical className=" w-5 h-5  rounded" />
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg opacity-0 transform scale-95 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100">
                  <div className="py-1">
                    <button onClick={() => handleEditModel(note)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(note._id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <div className="">
                <div className=" flex justify-between mt-2">
                  <p className="text-md text-gray-600">Announcement Date</p>
                  <p className="text-md  font-medium">{note.date}</p>
                </div>
               
              </div>
              <div className='flex justify-between mt-2'>
                <p className="text-md text-gray-600 ">Description</p>
                <p className="text-md">{note.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
</div>
     </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Add Note</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                  <label className="block text-sm font-medium">
                    Date<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      placeholder="Select Date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
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

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Edit Note</h2>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Date<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
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

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpenEditModel(false)}
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

export default Note