import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import Aside from '../../Common/SideBar/AdminSideBar/Aside';
import Navbar from '../../Common/Navbar/Navbar';
import { getOtherIncomeById } from '../../../utils/api';

const MemberList = () => {
  const [memberData, setMemberData] = useState([]);
  const { id } = useParams(); // Extract ID from URI

  const fetchMemberData = async () => {
    console.log(id);
    
    try {
      const response = await getOtherIncomeById(id);
      console.log(response.data.paidByResidents);   
      setMemberData(response.data.paidByResidents);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  useEffect(() => {
    fetchMemberData(id); // Call fetchMemberData without passing id
  }, [id]); // Add id as a dependency

  return (
    <div>
      <Aside />
      <div className="main">
        <Navbar />
        <main className="p-6">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Ganesh Chaturthi Participator Member List
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200 rounded-lg">
                      <th className="pb-4 pt-2 px-3 text-md font-semibold text-gray-700 border  text-left">
                        Unit Number
                      </th>
                      <th className="pb-4 pt-2  text-md font-semibold text-gray-700 border text-left">
                        Payment Date
                      </th>
                      <th className="pb-4 pt-2 text-md font-semibold text-gray-700 border text-left">
                        Tenant/Owner Status
                      </th>
                      <th className="pb-4 pt-2  text-md font-semibold text-gray-700 border text-left">
                        Phone Number
                      </th>
                      <th className="pb-4 pt-2  text-md font-semibold text-gray-700 border text-left">
                        Amount
                      </th>
                      <th className="pb-4 pt-2  text-md font-semibold text-gray-700 border  text-left">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberData.map((row, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="py-4 text-md">
                          <span className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                ['A', 'B', 'C'].includes(row.residentId.wing) ? 'bg-blue-50 text-blue-600' :
                                row.residentId.wing >= 'D' && row.residentId.wing <= 'Z' ? 'bg-purple-50 text-purple-600' :
                                'bg-orange-50 text-orange-600'
                              }`}>
                              {row.residentId.wing}
                            </span>
                            <span className="font-medium text-gray-800">{row.residentId.unitNumber}</span>
                          </span>
                        </td>
                        <td className="py-4 text-gray-700 text-md font-medium">{row.date.split('T')[0]}</td>
                        <td className="py-4 text-lg">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-base font-medium ${row.status === 'Owner'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-pink-50 text-pink-600'
                            }`}>
                            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                            {row.status === 'Owner' ? 'Owner' : 'Tenant'}
                          </span>
                        </td>
                        <td className="py-4 text-gray-700 text-md font-medium">{row.residentId.phoneNumber}</td>
                        <td className="py-4 text-green-600 text-md font-medium">₹ {row.amount}</td>
                        <td className="py-4 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-md font-medium ${row.payment === 'Cash'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-blue-50 text-blue-600'
                            }`}>
                            {row.payment === 'Cash' ? '💵' : '🌐'}
                            <span className="ml-1">{row.paymentMethod}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  )
}

export default MemberList
