import React, { useState, useEffect } from 'react'

import { ArrowRight, ArrowLeft, FileText, FileImage, Activity, DollarSign, Package, Users, Settings, LogOut, Edit, Eye, Trash2, Check, X, CheckCircle, ChevronDown, MoreHorizontal, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Aside from '../../../Common/SideBar/AdminSideBar/Aside';
import Navbar from '../../../Common/Navbar/Navbar';
import { getResidents, getResidentDetails, deleteResident } from '../../../../utils/api';
import { toast } from 'react-hot-toast';




function Residence() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [openDeleteStatusModel, setopenDeleteStatusModel] = useState(false);
  const [openProfileModel, setOpenProfilModel] = useState(false);
  const [Statusmodel, setStatusmodel] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [status, setStatus] = useState('occupied');
  const [agreement, setAgreement] = useState(false);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [residentDetails, setResidentDetails] = useState(null);
  const [selectedResidentId, setSelectedResidentId] = useState(null);
  const [selectedWing, setSelectedWing] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    setLoading(true);
    const response = await getResidents();
    if (response.success) {
      const transformedData = response.data.map(resident => ({
        _id: resident._id,
        name: resident.fullName,
        avatar: resident.photo,
        unitNumber: resident.unitNumber,
        unitStatus: resident.owner ? 'Occupied' : 'Vacant',
        residentStatus: resident.owner ? 'Owner' : 'Tenant',
        phoneNumber: resident.phoneNumber,
        member: resident.members?.length || 0,
        vehicle: resident.vehicles?.length || 0,
        email: resident.email,
        wing: resident.wing,
        age: resident.age,
        gender: resident.gender,
        documents: {
          aadhaarFront: resident.aadhaarFront,
          aadhaarBack: resident.aadhaarBack,
          addressProof: resident.addressProof,
          rentAgreement: resident.rentAgreement
        },
        members: resident.members || [],
        vehicles: resident.vehicles || []
      }));
      console.log(transformedData);
      setResidents(transformedData);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  const handleAddDetails = () => {
    if (agreement) {
      const newResidentData = {
        _id: null,
        fullName: '',
        phoneNumber: '',
        email: '',
        age: '',
        gender: '',
        unitNumber: '',
        wing: '',
        photo: '',
        owner: status === 'occupied',
        relation: 'self',
        members: [],
        vehicles: [],
        documents: {
          aadhaarFront: '',
          aadhaarBack: '',
          addressProof: '',
          rentAgreement: ''
        },
        isNewResident: true
      };

      navigate('/admin/form', {
        state: {
          isEditing: false,
          residentData: newResidentData,
          selectedResidentId: null
        }
      });
    } else {
      setOpenModel(true);
    }
  };
  const handleDeleteDetails = (resident) => {
    setSelectedResidentId(resident._id);
    setSelectedWing(resident.wing);
    setSelectedUnit(resident.unitNumber);
    console.log(resident._id);
    setOpenDeleteModel(true);
  };

  const handleProfileDetails = (resident) => {
    setSelectedResidentId(resident._id);

    setOpenProfilModel(true);
    setIsClosing(false);
  };

  const handleCloseProfileModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenProfilModel(false);
      setIsClosing(false);
    }, 300);
  };

  const fetchResidentDetails = async (id) => {
    setLoadingProfile(true);
    try {
      const response = await getResidentDetails(id);
      if (response.success) {
        setResidentDetails(response.data.resident);
      } else {
        toast.error(response.message || "Failed to fetch resident details");
      }
    } catch (error) {
      console.error("Error fetching resident details:", error);
      toast.error("Failed to fetch resident details");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (openProfileModel && selectedResidentId) {
      fetchResidentDetails(selectedResidentId);
    }
  }, [openProfileModel, selectedResidentId]);

  const handleEditModel = (resident) => {
    navigate('/admin/form', {
      state: {
        isEditing: true,
        residentData: resident
      }
    });
  };

  const handleStatusmodel = () => {
    setOpenDeleteModel(false)
    setStatusmodel(true)
  }

  const handleopenDeleteStatusModel = () => {
    setStatusmodel(false)
    setopenDeleteStatusModel(true)
  }

  const handleDeleteResident = async (id) => {
    try {
      const response = await deleteResident(id);
      if (response.success) {
        toast.success("Resident deleted successfully");
        setopenDeleteStatusModel(false);
        fetchResidents();
      } else {
        toast.error(response.message || "Failed to delete resident");
      }
    } catch (error) {
      console.error("Error deleting resident:", error);
      toast.error("Failed to delete resident");
    }
  };


  // const filteredResidents = residents.filter(resident => {
  //   const matchesWing = selectedWing ? resident.wing === selectedWing : true;
  //   const matchesUnit = selectedUnit ? resident.unitNumber === selectedUnit : true;
  //   return matchesWing && matchesUnit;
  // });

  return (
    <div className='bg-[#F0F5FB] min-h-screen'>
      <Aside />
      <div className="main ">
        <Navbar />



        <div className="max-w-8xl mx-auto py-6 sm:px-4 lg:px-4 bg-[#F0F5FB]">
          <div className="px-2 py-6 sm:px-0 ">
            <div className='bg-white px-3 py-4 rounded'>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Resident Tenant and Owner Details</h2>
                <button
                  onClick={handleAddDetails}
                  className="bg-gradient-to-r from-[#FE512E] to-[#F09619] text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                >
                  Add New Resident Details
                </button>
              </div>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>

                    </div>
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-red-600">{error}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-[#EEF1FD]">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Full Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Unit Number</th>
                          <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Unit Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Resident Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Phone Number</th>
                          <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Member</th>
                          <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Vehicle</th>
                          <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {residents.length > 0 ? (
                          residents.map((resident) => (
                            <tr key={resident._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    {resident.avatar ? (
                                      <img
                                        className="h-10 w-10 rounded-full"
                                        src={resident.avatar}
                                        alt={resident.name}
                                      />
                                    ) : (
                                      <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-md font-medium text-gray-900">
                                      {resident.name || '-'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                                {resident.unitNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">

                                <span className="px-2 py-1 inline-flex items-center text-sm leading-5 font-semibold rounded-full bg-[#ECFFFF] text-[#14B8A6]">
                                  <img
                                    src='/image/Resident/occu.png' // Corrected path to the image
                                    alt='Occupied'
                                    className='w-4 h-4 mr-2'
                                  />
                                  Occupied
                                </span>

                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex items-center text-sm leading-5 font-semibold rounded-full ${resident.residentStatus === 'Tenant'
                                    ? 'bg-pink-100 text-pink-800'
                                    : resident.residentStatus === 'Owner'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                  {resident.residentStatus === 'Tenant' && (
                                    <img
                                      src="/public/image/Resident/user.png"
                                      alt="Tenant"
                                      className="w-4 h-4 mr-2"
                                    />
                                  )}
                                  {resident.residentStatus === 'Owner' && (
                                    <img
                                      src="/public/image/Resident/tag-user.png"
                                      alt="Owner"
                                      className="w-4 h-4 mr-2"
                                    />
                                  )}
                                  {resident.residentStatus === 'Tenant' ? 'Tenant' : 'Owner'}
                                </span>

                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-md text-[#4F4F4F] font-semibold">{resident.phoneNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-md text-[#4F4F4F] font-semibold">{resident.member}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-md text-[#4F4F4F] font-semibold">{resident.vehicle}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-md font-medium flex">
                                <button onClick={() => handleEditModel(resident)} className="rounded p-1 text-green-600 hover:bg-green-50">
                                  <img src="/public/image/Dashborad/edit.png" alt="" />
                                </button>
                                <button onClick={() => handleDeleteDetails(resident)} className="rounded p-1 text-red-600 hover:bg-red-50">
                                  <img src="/public/image/Dashborad/delete.png" alt="" />
                                </button>
                                <button onClick={() => { handleProfileDetails(resident); }} className="rounded p-1 text-blue-600 hover:bg-blue-50">
                                  <img src="/public/image/Dashborad/view.png" alt="View" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-4">No residents found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>



        {openModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Residence Status</h2>
                <div className=" grid-cols-2 grid gap-4 py-2">

                  <label className=" items-center p-3 rounded-lg border border-orange-500 ">
                    <input type="radio" name="status" className="form-radio text-orange-500 bg-orange-500" defaultChecked />

                    <span className="text-black ml-2">Occupied </span>
                  </label>
                  <label className=" items-center p-3 rounded-lg border border-gray-200">
                    <input disabled type="radio" name="status" className="form-radio text-gray-400" />
                    <span className="text-gray-600  ml-2">Vacate</span>
                  </label>
                </div>
                <div className="flex items-center mt-4 text-sm text-gray-600">
                  <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
                  <span className="ml-2">By submitting, you agree to select Occupied</span>
                </div>
                <div className="flex justify-between gap-4 mt-6">
                  <button
                    onClick={() => setOpenModel(false)}
                    className="flex-1 px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <Link to="/admin/form" className="flex-1">
                    <button
                      className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md hover:from-orange-600 hover:to-orange-700 transition-colors"
                    >
                      Save
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        {openDeleteModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Update Status</h2>
                <div className=" grid-cols-2 grid gap-4 py-2">
                  <label className=" items-center p-3 rounded-lg border border-gray-200">
                    <input disabled type="radio" name="status" className="form-radio text-gray-400" />
                    <span className="text-gray-600  ml-2">Occupied</span>
                  </label>
                  <label className=" items-center p-3 rounded-lg border border-orange-500 ">
                    <input type="radio" name="status" className="form-radio text-orange-500 bg-orange-500" defaultChecked />

                    <span className="text-black ml-2">Vacate</span>
                  </label>
                </div>
                <div className="flex items-center mt-4 text-sm text-gray-600">
                  <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
                  <span className="ml-2">By submitting, you agree to select Occupied</span>
                </div>

                <div className="flex justify-between gap-4 mt-6">
                  <button
                    onClick={() => setOpenDeleteModel(false)}
                    className="flex-1 px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleStatusmodel}
                    className="flex-1 px-5 py-2 border border-gray-300 rounded-md text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-colors"
                  >
                    Save
                  </button>

                </div>


              </div>
            </div>
          </div>
        )}
        {openProfileModel && residentDetails && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end backdrop-blur-sm z-40 transition-all duration-300 ease-in-out ${isClosing ? 'opacity-0' : 'opacity-100'
              }`}
            onClick={handleCloseProfileModal}
          >
            <div
              className={`bg-white h-full w-full max-w-md transform transition-transform duration-300 ease-in-out ${isClosing ? 'translate-x-full' : 'translate-x-0'
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center">
                  <button
                    onClick={handleCloseProfileModal}
                    className="mr-2 me-3 text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h1 className="text-lg font-semibold text-gray-800 mt-1">
                    View Owner Details
                  </h1>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {loadingProfile ? (
                    <div className="flex items-center justify-center h-full">

                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>

                      </div>

                    </div>
                  ) : (
                    <div className="px-4 py-6">
                      <div className="flex flex-col items-center mb-6">
                        <img
                          src={residentDetails.photo || "/public/image/profile.png"}
                          alt={residentDetails.fullName}
                          className="w-20 h-20 rounded-full mb-2"
                        />
                        <h2 className="text-xl font-semibold text-gray-800">
                          {residentDetails.fullName}
                        </h2>
                        <p className="text-sm text-gray-600">{residentDetails.email}</p>
                      </div>

                      <div className="space-y-3 mb-6 px-4 bg-white rounded-lg p-4 shadow-sm">
                        {[
                          { label: 'Wing', value: residentDetails.wing },
                          { label: 'Unit', value: residentDetails.unitNumber },
                          { label: 'Age', value: residentDetails.age },
                          { label: 'Gender', value: residentDetails.gender },
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-sm text-gray-600">{item.label}</span>
                            <span className="text-sm font-medium text-gray-800">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className='bg-white rounded-lg bg-white rounded-lg p-4 shadow-sm'>
                        <div className="mb-2">
                          <h3 className="text-sm font-semibold text-gray-800 mb-2">
                            Document
                          </h3>
                          {residentDetails.documents && Object.entries(residentDetails.documents).map(([key, value], index) => (
                            value && (
                              <div
                                key={index}
                                className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                              >
                                <div className="flex items-center">
                                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                                    </p>
                                  </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="h-5 w-5" />
                                </button>
                              </div>
                            )
                          ))}
                        </div>




                        <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                              <img src="/public/image/Resident/Component54.png" alt="" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Adharcard Front Side.JPG</p>
                              <p className="text-sm text-gray-500">3.5 MB</p>
                            </div>
                          </div>
                          <button className="rounded-md p-2 hover:bg-gray-100">
                            {residentDetails.aadhaarFront ? (
                              <a href={residentDetails.aadhaarFront} target="_blank" rel="noopener noreferrer">
                                <img src="/public/image/Resident/eye.png" alt="" />
                              </a>
                            ) : 'N/A'}
                          </button>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                              <img src="/public/image/Resident/Component55.png" alt="" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Address Proof Front Side.PDF</p>
                              <p className="text-sm text-gray-500">3.5 MB</p>
                            </div>
                          </div>
                          <button className="rounded-md p-2 hover:bg-gray-100">
                            {residentDetails.aadhaarBack ? (
                              <a href={residentDetails.aadhaarBack} target="_blank" rel="noopener noreferrer">
                                <img src="/public/image/Resident/eye.png" alt="" />
                              </a>
                            ) : 'N/A'}
                          </button>
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-xl bg-white shadow-lg">
                        <div className="bg-[#5678E9] p-4">
                          <div className="flex items-center justify-between text-white">
                            <h2 className="text-1xl font-medium">Member Counting</h2>
                            <span className="text-1xl font-semibold">0{residentDetails.members.length}</span>
                          </div>
                        </div>
                        <div className="space-y-4 p-6">
                          {residentDetails.members.map((member, index) => (
                            <>
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-base font-medium text-gray-700">First Name</span>
                                <span className="text-base text-gray-600">{member.name}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-base font-medium text-gray-700">Phone No</span>
                                <span className="text-base text-gray-600">{member.phoneNumber}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-base font-medium text-gray-700">Age</span>
                                <span className="text-base text-gray-600">{member.age}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-base font-medium text-gray-700">Gender</span>
                                <span className="text-base text-gray-600">{member.gender}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-base font-medium text-gray-700">Relation</span>
                                <span className="text-base text-gray-600">{member.relation}</span>
                              </div>
                              <div className='border-b border-gray-200'></div>
                            </>
                          ))}
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-xl bg-white shadow-lg mt-4">
                        <div className="bg-[#5678E9] p-4">
                          <div className="flex items-center justify-between text-white">
                            <h2 className="text-1xl font-medium">vehicles Counting</h2>
                            <span className="text-1xl font-semibold">0{residentDetails.vehicles.length}</span>
                          </div>
                        </div>
                        <div className="space-y-4 p-6">
                          {residentDetails.vehicles.map((vehicles, index) => (
                            <>
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-base font-medium text-gray-700">vehicles type</span>
                                <span className="text-base text-gray-600">{vehicles.type}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-base font-medium text-gray-700">vehicles Name</span>
                                <span className="text-base text-gray-600">{vehicles.name}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-base font-medium text-gray-700">vehicles Number</span>
                                <span className="text-base text-gray-600">{vehicles.number}</span>
                              </div>

                              <div className='border-b border-gray-200'></div>
                            </>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {Statusmodel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Residence Status</h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="wing" className="text-sm font-medium text-gray-700">
                      Wing
                    </label>
                    <input
                      id="wing"
                      value={selectedWing}
                      readOnly
                      className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="unit" className="text-sm font-medium text-gray-700">
                      Unit
                    </label>
                    <input
                      id="unit"
                      value={selectedUnit}
                      readOnly
                      className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button onClick={() => setStatusmodel(false)} className="w-full  px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Cancel
                  </button>
                  <button onClick={handleopenDeleteStatusModel} className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {openDeleteStatusModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Do you want to vacate the finlay flat?
                </h2>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete all details?
                </p>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4 rounded-b-lg">

                <button
                  onClick={() => setopenDeleteStatusModel(false)}
                  className="w-full px-4 border py-2 rounded text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    handleDeleteResident(selectedResidentId);
                    setOpenDeleteModel(false);
                  }}
                  className="w-full px-4 border ml-3 py-2 rounded bg-[#E74C3C] text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Confirm
                </button>

              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  )
}

export default Residence
