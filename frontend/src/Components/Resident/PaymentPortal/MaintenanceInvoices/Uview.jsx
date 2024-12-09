import React, { useState } from 'react'

import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import UAside from '../../../Common/SideBar/ResidentSideBar/UAside';
import Navbar from '../../../Common/Navbar/Navbar';


const Uviw = () => {

  const [openModel, setOpenModel] = useState(false);

  const handleAddModel = () => {
    setOpenModel(true);
  };


  return (
    <div className='flex h-screen bg-gray-50'>
      <UAside />
      <div className="flex-1 overflow-auto">
       <Navbar/>
        <main className="p-6">
          <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Maintenance Invoices</h2>
              <select className="border rounded-lg px-4 py-2">
                <option>Month</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="text-left border-b bg-gray-100">
                    <th className="pb-3 px-4">Invoice ID</th>
                    <th className="pb-3 px-4">Owner Name</th>
                    <th className="pb-3 px-4">Bill Date</th>
                    <th className="pb-3 px-4">Payment Date</th>
                    <th className="pb-3 px-4">Phone Number</th>
                    <th className="pb-3 px-4">Email</th>
                    <th className="pb-3 px-4">Maintenance Amount</th>
                    <th className="pb-3 px-4">Pending Amount</th>
                    <th className="pb-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "152563",
                      owner: "Terry Rhiel Madsen",
                      billDate: "10/02/2024",
                      paymentDate: "10/02/2024",
                      phone: "9764816457",
                      email: "FrancesLHarris@rhyta.com",
                      amount: "1500",
                      pending: "2500",
                    },
                    {
                      id: "152563",
                      owner: "Marcus Vaccaro",
                      billDate: "10/02/2024",
                      paymentDate: "10/02/2024",
                      phone: "9601765987",
                      email: "DavidRSkley@dayrep.com",
                      amount: "1500",
                      pending: "6500",
                    },
                    // Add more rows as needed
                  ].map((invoice, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">{invoice.id}</td>
                      <td className="py-4 px-4">{invoice.owner}</td>
                      <td className="py-4 px-4">{invoice.billDate}</td>
                      <td className="py-4 px-4">{invoice.paymentDate}</td>
                      <td className="py-4 px-4">{invoice.phone}</td>
                      <td className="py-4 px-4">{invoice.email}</td>
                      <td className="py-4 px-4 text-green-600">₹ {invoice.amount}</td>
                      <td className="py-4 px-4 text-red-500">{invoice.pending}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={handleAddModel}
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                        >
                          •••
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium">Maintenance Invoices</h2>
              <button onClick={() => setOpenModel(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Invoice Id</div>
                  <div>125463</div>
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

              <div>
                <div className="text-sm text-gray-500">Phone Number</div>
                <div>6549873521</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div>MaryDHurst@jourrapide.com</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Address</div>
                <div>2118 Thornridge Cir. Syracuse, Connecticut 35624</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">Maintenance Amount</div>
                  <div className="text-green-600">₹ 1500.00</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">Penalty</div>
                  <div className="text-red-500">₹ 350.00</div>
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
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Uviw
