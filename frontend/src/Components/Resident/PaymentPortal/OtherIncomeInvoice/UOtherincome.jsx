import React, { useState } from 'react'

import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import UAside from '../../../Common/SideBar/ResidentSideBar/UAside';
import Navbar from '../../../Common/Navbar/Navbar';


const UOtherincome = () => {
  const [openModel, setOpenModel] = useState(false);
  const [openPaymentModel, setopenPaymentModel] = useState(false);

  const handleAddModel = () => {
    setOpenModel(true);
  };
  const handlePaymentModel = () => {
    setopenPaymentModel(true);
  };

 

  const payments = [
    {
      eventName: "Navratri",
      dueDate: "11/01/2024",
      amount: "1000.00",
    },
    {
      eventName: "Navratri",
      dueDate: "11/01/2024",
      amount: "1000.00",
    },
    {
      eventName: "Navratri",
      dueDate: "11/01/2024",
      amount: "1000.00",
    },
    {
      eventName: "Navratri",
      dueDate: "11/01/2024",
      amount: "1000.00",
    },
  ]


  return (
    <div className='flex bg-[#F0F5FB] min-h-screen '>
      <UAside />
      <div className="flex-1 overflow-auto">
        <Navbar/>
        <div className="w-full p-6 space-y-4 bg-white mx-3 rounded">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Due Event Payment</h2>
            <button onClick={handleAddModel} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
              View Invoice
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {payments.map((payment, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-[#5678E9] text-white flex justify-between items-center">
                  <div className="text-sm font-medium">Due Event Payment</div>
                  <span className="text-xs bg-[#6786EB] px-2 py-1 rounded">Pending</span>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Event Name</span>
                      <span className="text-sm font-medium">{payment.eventName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Event Due Date</span>
                      <span className="text-sm font-medium">{payment.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount</span>
                      <span className="text-sm font-medium">${payment.amount}</span>
                    </div>
                  </div>
                  <button onClick={handlePaymentModel} className="w-full py-2 bg-gradient-to-r from-[#FE512E] to-[#F09619]  text-white rounded-md hover:bg-orange-600 transition-colors">
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {openModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Event Invoices List</h2>
          <button onClick={()=>setOpenModel(false)} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Invoice Id</div>
              <div>125465</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Owner Name</div>
              <div>Terry Rhiel Madsen</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Bill Date</div>
              <div>10/02/2024</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Payment Date</div>
              <div>10/02/2024</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Event Date</div>
              <div>6549873521</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Phone Number</div>
              <div>6549873521</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div>MaryDHurst@jourrapide.com</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Event Name</div>
            <div>Ganesh Chaturthi</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Description</div>
            <div className="text-sm">
              The celebration of Ganesh Chaturthi involves the installation of clay idols of Lord Ganesh in OurResident.
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="text-sm text-gray-500">Maintenance Amount</div>
              <div className="text-green-600">₹ 1500.00</div>
            </div>
            <div className="flex justify-between font-medium">
              <div>Grand Total</div>
              <div>₹ 1850.00</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Note</div>
            <div className="text-sm text-gray-600">
              A visual representation of your spending categories visual representation.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download Invoice
          </button>
        </div>
            </div>
          </div>
        )}

{openPaymentModel && (
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
          <button onClick={()=> setopenPaymentModel(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <Link to="/user/Upaymentcard">
          <button className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
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

export default UOtherincome
