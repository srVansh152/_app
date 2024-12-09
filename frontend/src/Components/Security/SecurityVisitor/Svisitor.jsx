import { Bell } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SAside from '../../Common/SideBar/SecuritySideBar/SAside';
import Navbar from '../../Common/Navbar/Navbar';
import { createVisitorLog, getVisitorLogs } from '../../../utils/api'; // Import getVisitorLogs function

const Svisitor = () => {

  const [openModel, setOpenModel] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    wing: "",
    unit: "",
    date: "",
    time: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error messages
  const [successMessage, setSuccessMessage] = useState(null); // State to manage success message
  const [visitors, setVisitors] = useState([]); // State to store the fetched visitor logs

  const fetchVisitorLogs = async () => {
    const response = await getVisitorLogs();
    if (response.success) {
      setVisitors(response.data.visitorLogs); // Assuming 'visitors' is the key that holds the visitor list
    } else {
      setError(response.message);
    }
  };
  // Fetch visitor logs on component mount
  useEffect(() => {
    fetchVisitorLogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const visitorLogData = {
      visitorName: formData.name,
      phoneNumber: formData.phoneNumber,
      wing: formData.wing,
      unit: formData.unit,
      date: formData.date,
      time: formData.time,
    };

    const response = await createVisitorLog(visitorLogData);
    setLoading(false);

    if (response.success) {
      fetchVisitorLogs();
      setSuccessMessage(response.message);
      setOpenModel(false); // Close the modal on successful submission
      alert(response.message);
    } else {
      setError(response.message);
    }
  };

  const handleAddModel = () => {
    setOpenModel(true);
  };

  return (
    <div className="flex h-screen">
      <SAside />
      <div className="flex-1 flex flex-col bg-slate-50">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div className='bg-white px-4 rounded py-4 flex-1 overflow-hidden'>
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold">Visitor Tracking</h1>
              <div className="flex gap-4">
                <select className="px-3 py-2 border rounded-md bg-white">
                  <option>Week</option>
                </select>
                <button onClick={handleAddModel} className="px-4 py-2 bg-gradient-to-r from-[#FE512E] to-[#F09619] text-white rounded-md hover:bg-orange-600 transition-colors">
                  Add Visitor details
                </button>
              </div>
            </div>

            <div className="rounded-lg shadow flex-1 overflow-y-auto">
              <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b text-sm text-gray-500 bg-[#EEF1FD]">
                <div>Visitor Name</div>
                <div>Phone Number</div>
                <div>Date</div>
                <div>Unit Number</div>
                <div>Time</div>
              </div>

              <div className="divide-y">
                {visitors.length > 0 ? (
                  visitors.map((visitor, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={visitor.avatar || "/placeholder.svg?height=32&width=32"}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-medium">{visitor.visitorName}</span>
                      </div>
                      <div>{visitor.phoneNumber}</div>
                      <div>{visitor.date}</div>
                      <div>{visitor.unit}</div>
                      <div>{visitor.time}</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-5 text-center py-4 text-gray-500">No visitor logs available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding new visitor */}
      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Add Visitor Details.</h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Form fields for adding visitor details */}
                <div>
                  <label className="block text-sm mb-1">
                    Visitor Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Phone<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Enter Phone"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Wing<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="wing"
                      placeholder="Enter Wing"
                      value={formData.wing}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Unit<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="unit"
                      placeholder="Enter Unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="date"
                      placeholder="Select Date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Time<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="time"
                      placeholder="Select Time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setOpenModel(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                {successMessage && <div className="text-green-500 text-sm mt-2">{successMessage}</div>}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Svisitor;
