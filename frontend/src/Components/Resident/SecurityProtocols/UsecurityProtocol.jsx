import React, { useEffect, useState } from 'react'

import { Bell, Plus, PencilIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import UAside from '../../Common/SideBar/ResidentSideBar/UAside';
import Navbar from '../../Common/Navbar/Navbar';
import { getSecurityProtocols } from '../../../utils/api';



const UsecurityProtocol = () => {


  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSecurityProtocols = async () => {
    try {
      const response = await getSecurityProtocols();
      if (!response.success) {
        throw new Error('Failed to fetch security protocols');
      }
      const data = response.data.protocols
      setProtocols(data);
    } catch (error) {
      console.error('Error fetching security protocols:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityProtocols()
  }, []);

  return (
    <div className='flex bg-[#F0F5FB] min-h-screen'>
      <UAside />
      <div className="flex-1 overflow-auto">
        <Navbar />

        <div className="container-fulid">
          <div className="bg-white mx-3 py-4">
          <div className=' overflow-hidden   p-6'>
          <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Security Protocols</h1>

            </div>

            {loading ? (
             <div className="flex items-center justify-center p-8">
             <div className="text-center">
               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
               
             </div>
           </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#EEF1FD]">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-[#202224] font-semibold">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-[#202224] font-semibold">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-[#202224] font-semibold">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-[#202224] font-semibold">
                        Time
                      </th>

                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {protocols.map((protocol, index) => (
                      <tr key={index} className="">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm text-gray-600">
                                {protocol.title.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900">{protocol.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">{protocol.description}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{new Date(protocol.createdAt).toLocaleDateString()}</td>
                        <td className="whitespace-nowrap px-5 py-3 text-sm  ">
                          <span className='bg-[#F6F8FB] p-3 rounded-full'>{protocol.time}</span>
                          </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default UsecurityProtocol
