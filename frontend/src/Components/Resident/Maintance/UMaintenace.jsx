import React, { useState } from 'react'

import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import UAside from '../../Common/SideBar/ResidentSideBar/UAside';
import Navbar from '../../Common/Navbar/Navbar';


const UMaintenace = () => {

  const [openModel, setOpenModel] = useState(false);

  const handleAddModel = () => {
    setOpenModel(true);
  };


  return (
    <div className='flex'>
      <UAside />
      <div className="flex-1 overflow-auto bg-[#F0F5FB] min-h-screen ">
        <Navbar />
        <main className="p-6">
          {/* Breadcrumb */}


          {/* Maintenance Details */}
          <div className="bg-white rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">Show Maintenance Details</h2>
            <div className="flex gap-8 justify-end">
              <div>
                <div className="text-sm text-gray-500">Maintenance Amount</div>
                <div className="text-2xl font-medium text-green-600">₹ 1,500</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Penalty Amount</div>
                <div className="text-2xl font-medium text-red-500">₹ 500</div>
              </div>
            </div>
          </div>

          {/* Pending Maintenance */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Pending Maintenance</h2>
              <Link to="/user/Uview">
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg">
                  View Invoice
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg">
                  <div className="font-semibold flex justify-between items-center bg-[#5678E9] text-white px-4 py-2 rounded-t-lg">
                    <div className="text-white py-2 rounded">Maintenance</div>
                    <div className="bg-[#6786EB]  text-white px-5 py-2 rounded-full">Pending</div>

                  </div>
                  <div className="space-y-2 mb-4 p-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bill Date</span>
                      <span>1/01/2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pending Date</span>
                      <span>1/01/2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Maintenance Amount</span>
                      <span>1000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Maintenance Penalty Amount</span>
                      <span>250.00</span>
                    </div>
                    <div className="flex justify-between font-medium mb-3">
                      <span>Grand Total</span>
                      <span className="text-green-600">₹ 1,250</span>
                    </div>

                    {/* Pay Now button with margin-top applied */}
                    <button
                      onClick={handleAddModel}
                      className="w-full bg-gradient-to-r from-[#FE512E] to-[#F09619] hover:bg-orange-600 text-white py-2 rounded-lg transition-colors mt-5"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>

              ))}
            </div>
          </div>

          {/* Due Maintenance */}
          <div>
            <h2 className="text-lg font-medium mb-4">Due Maintenance</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2].map((item) => (
                <div key={item} className="bg-white rounded-lg p-4">
                  <div className="font-semibold flex justify-between items-center bg-[#5678E9] text-white px-4 py-2 rounded-t-lg">
                    <div className=" text-white  rounded">Maintenance</div>
                    <div className="bg-[#6786EB] text-white px-5 py-2 rounded-full">Pending</div>
                  </div>
                  <div className="space-y-2 mb-4 p-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date</span>
                      <span>1/01/2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount</span>
                      <span>1000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Due Maintenance Amount</span>
                      <span>250.00</span>
                    </div>
                  </div>
                  <button onClick={handleAddModel} className="w-full py-2   bg-gradient-to-r from-[#FE512E] to-[#F09619] text-white rounded-lg">
                    Pay Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Payment Method</h2>

              <div className="space-y-3">
                {/* Master Card */}
                <label className="flex items-center justify-between p-3 rounded-lg border-2 hover:border-orange-500 bg-orange-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded ">
                      <img src="/image/master.png" alt="" />
                    </div>
                    <span className="font-medium">Master Card</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                  />
                </label>

                {/* Visa Card */}
                <label className="flex items-center justify-between p-3 rounded-lg border  hover:border-orange-500 bg-orange-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded">
                      <img src="/image/visa.png" alt="" />

                    </div>
                    <span className="text-gray-500">Visa Card</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                  />
                </label>

                {/* Cash Payment */}
                <label className="flex items-center justify-between p-3 rounded-lg border  hover:border-orange-500 bg-orange-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded">
                      <img src="/image/Frame.png" alt="" />

                    </div>
                    <span className="text-gray-500">Cash Payment</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                  />
                </label>
              </div>
            </div>

            <div className="p-4 flex gap-3">
              <button 
                onClick={() => setOpenModel(false)} 
                className="w-full px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <Link to="/user/Ucard" className="w-full">
                <button 
                  className="w-full px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Pay Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UMaintenace
