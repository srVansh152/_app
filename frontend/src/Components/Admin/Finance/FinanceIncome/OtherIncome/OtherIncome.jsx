import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EllipsisVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import Aside from '../../../../Common/SideBar/AdminSideBar/Aside';
import Navbar from '../../../../Common/Navbar/Navbar';
import { createOtherIncome, editOtherIncome, getOtherIncomes } from '../../../../../utils/api';

function OtherIncome() {
  const [openModel, setOpenModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    dueDate: '',
    description: '',
    amount: ''
  });

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null); // Track open dropdown for each card
  const [festivals, setFestivals] = useState([]); // Initialize state for festivals
  const [selectedFestivalId, setSelectedFestivalId] = useState(null); // New state for selected festival ID
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const fetchFestivals = async () => {
    try {
      setIsLoading(true); // Set loading to true before fetch
      const response = await getOtherIncomes()
      setFestivals(response.data); // Set the fetched data to state
    } catch (error) {
      console.error('Error fetching festivals:', error);
    } finally {
      setIsLoading(false); // Set loading to false after fetch (success or error)
    }
  };

  useEffect(() => {
    fetchFestivals(); // Call the fetch function
  }, []); // Empty dependency array to run once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await createOtherIncome({
        title: formData.title,
        date: formData.date,
        dueDate: formData.dueDate,
        description: formData.description,
        amount: formData.amount
      });
      console.log(response);

      if (response.success) {
        fetchFestivals()
        setFormData({
          title: '',
          date: '',
          dueDate: '',
          description: '',
          amount: ''
        });
        setOpenModel(false)
      } else {
        console.error(response.errors);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddIncome = () => {
    setOpenModel(true);
  };
  const handleEditIncome = (festival) => {
    console.log(festival);
    setFormData({
      title: festival.title,
      date: festival.date,
      dueDate: festival.dueDate,
      description: festival.description,
      amount: festival.amount
    });
    setOpenDropdownIndex(null);
    setSelectedFestivalId(festival._id); // Set the selected festival ID
    setOpenEditModel(true);
  };

  const handleDeleteIncome = (festivalId) => {
    setOpenDropdownIndex(null);
    setSelectedFestivalId(festivalId); // Set the selected festival ID for deletion
    setOpenDeleteModel(true);
  };

  const toggleDropdown = (index) => {
    // Toggle the dropdown for the clicked card only
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleUpdateIncome = async (e) => {
    e.preventDefault();
    console.log("hello", selectedFestivalId);

    console.log(formData.title);
    try {
      const response = await editOtherIncome(selectedFestivalId, {
        title: formData.title,
        date: formData.date,
        dueDate: formData.dueDate,
        description: formData.description,
        amount: formData.amount
      });
      console.log(response);

      if (response.success) {
        fetchFestivals();
        setOpenEditModel(false);
        setSelectedFestivalId(null); // Reset the selected festival ID
        setFormData({
          title: '',
          date: '',
          dueDate: '',
          description: '',
          amount: ''
        });
      } else {
        console.error(response.errors);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Aside />
      <div className="main bg-[#F0F5FB]">
        <Navbar />
        {/* Summary Cards */}
       <div className='bg-white mx-4'>
       <div className="container-fulid mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex">
              <Link to="/admin/financial" className="px-4 py-2 text-gray-600 font-medium">Maintenance</Link>
              <button className="px-4 py-2 bg-orange-500 text-white font-medium rounded-t-lg">Other Income</button>
            </div>
          </div>

          <div className='flex justify-between items-center mb-4'>
            <div>
              <h2 className='text-[#202224] text-[20px] ps-3 font-semibold'>Other Income</h2>
            </div>
            <div>
              <div className='flex gap-4'>
                {/* <Link to="/admin/memberlist">
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center">
                  <EyeIcon className="w-5 h-5 mr-2" />
                  Views
                </button>
              </Link> */}
                <button onClick={handleAddIncome} className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Other Income
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
           <div className="flex items-center justify-center p-8">
           <div className="text-center">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
     
           </div>
         </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {festivals.map((festival, index) => (
                <div
                  key={index}
                  className="min-w-[300px] bg-white rounded-lg shadow snap-start"
                >
                  <div className="flex justify-between items-center bg-[#5678E9] text-white p-4 rounded-t-lg">
                    <h2 className="text-lg font-medium">{festival.title}</h2>

                    {/* Options button to toggle dropdown */}
                    <div className="relative">
                      <button
                        className="text-black bg-white hover:bg-white hover:text-black rounded p-1"
                        onClick={() => toggleDropdown(index)}
                      >
                        <EllipsisVertical />
                      </button>

                      {/* Dropdown menu */}
                      {openDropdownIndex === index && (
                        <div className="absolute right-0 px-2 mt-2 bg-white text-black rounded shadow-md">
                          <ul>
                            <li onClick={() => handleEditIncome(festival)} className="p-2 hover:bg-gray-200 cursor-pointer">Edit</li>
                            <Link to={`/admin/memberlist/${festival._id}`}>
                              <li className="p-2 hover:bg-gray-200 cursor-pointer">
                                View
                              </li>
                            </Link>
                            <li onClick={() => handleDeleteIncome(festival._id)} className="p-2 hover:bg-gray-200 cursor-pointer">Delete</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount Per Member</span>
                      <span className="text-gray-900">₹{festival.amount}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Member</span>
                      <span className="text-gray-900">{festival.totalMembers}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Date</span>
                      <span className="text-gray-900">{festival.date.split('T')[0]}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Due Date</span>
                      <span className="text-gray-900">{festival.dueDate.split('T')[0]}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-600">Description</span>
                      <p className="text-gray-900 text-sm">{festival.description}</p>
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
            <div className="p-6">
              <h1 className="text-xl font-bold text-gray-900 mb-6">Create Other Income</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter Description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0000"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button onClick={() => setOpenModel(false)}
                    type="button"
                    className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Other Income</h2>
              <form onSubmit={handleUpdateIncome} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date.split('T')[0]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate.split('T')[0]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter Description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0000"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button onClick={() => {
                    setOpenEditModel(false)
                    setFormData({
                      title: '',
                      date: '',
                      dueDate: '',
                      description: '',
                      amount: ''
                    });
                  }}
                    type="button"
                    className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 p-3">
                Delete Ganesh Chaturthi?
              </h2>
              <p className="text-gray-500 p-3">
                Are you sure you want to delete this?
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setOpenDeleteModel(false)}
                  className="px-6 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setOpenDeleteModel(false)}
                  className="px-6 py-2.5 text-white font-medium bg-[#f1523d] rounded-lg hover:bg-[#d13d2a] focus:outline-none focus:ring-2 focus:ring-[#f1523d]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OtherIncome;
