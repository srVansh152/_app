import React, { useEffect } from "react";
import { useState } from "react";
import { ChevronDown, Upload } from "lucide-react";
import axios from 'axios'; // Import axios for making API calls
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Import useNavigate, useParams, and useLocation

import { Link } from 'react-router-dom';
import { Activity, DollarSign, Package, Users, Bell, Settings, LogOut, Edit, Eye, Trash2, Check, X, CheckCircle, } from 'lucide-react';
import Aside from "../../../../Common/SideBar/AdminSideBar/Aside";
import Navbar from "../../../../Common/Navbar/Navbar";
import { createResident, updateResident, getResidentDetails } from "../../../../../utils/api";

const InputField = ({ label, type, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-[#202224]">{label}</label>
    <input
      type={type}
      className="mt-1 block w-full border bg-transparent rounded-md shadow-sm text-sm px-4 py-1"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export const Form = () => {
  const navigate = useNavigate(); // Create navigate function
  const { id } = useParams(); // Get id from URL parameters
  const location = useLocation(); // Get location to access state
  const { residentData } = location.state || {}; // Get resident data from state
  const [fullName, setFullName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [relation, setRelation] = useState('');
  const [activeTab, setActiveTab] = useState("owner");
  const [selectedImage, setSelectedImage] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(5);
  const [vehicleCount, setVehicleCount] = useState(3);
  const [vehicles, setVehicles] = useState([{}]);
  const [members, setMembers] = useState([{}]); // State to store member details
  const [files, setFiles] = useState({
    aadharFront: null,
    aadharBack: null,
    addressProof: null,
    rentAgreement: null,
  });
  const [wing, setWing] = useState(''); // State for wing
  const [unit, setUnit] = useState(''); // State for unit
  const [ownerFullName, setOwnerFullName] = useState(''); // State for Owner Full Name
  const [ownerPhone, setOwnerPhone] = useState('+91'); // State for Owner Phone
  const [ownerAddress, setOwnerAddress] = useState(''); // State for Owner Address
  const [dataCache, setDataCache] = useState(null); // State to store cached data

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await getResidentDetails(id);
          if (response.success) {
            handleEditData(response.data);
          } else {
            console.error('No data found in response:', response);
            resetFormFields();
          }
        } catch (error) {
          console.error('Error fetching data:', error.response ? error.response.data : error.message);
          resetFormFields();
        }
      } else if (residentData) {
        handleEditData(residentData);
      } else {
        resetFormFields();
      }
    };

    fetchData();
  }, [id, residentData]);

  const handleEditData = (newData) => {
    setFullName(newData.name || '');
    setPhoneNo(newData.phoneNumber || '');
    setEmail(newData.email || '');
    setAge(newData.age || '');
    setGender(newData.gender || '');
    setRelation('');
    setWing(newData.wing || '');
    setUnit(newData.unitNumber || '');
    setMembers(newData.members || [{}]);
    setVehicles(newData.vehicles || [{}]);
    
    setFiles({
      aadharFront: newData.documents?.aadhaarFront || null,
      aadharBack: newData.documents?.aadhaarBack || null,
      addressProof: newData.documents?.addressProof || null,
      rentAgreement: newData.documents?.rentAgreement || null,
      photo: newData.avatar || null,
    });
    
    if (newData.avatar) {
      setSelectedImage(newData.avatar);
    }
  };

  const resetFormFields = () => {
    setFullName('');
    setPhoneNo('');
    setEmail('');
    setAge('');
    setGender('');
    setRelation('');
    setWing('');
    setUnit('');
    setMembers([{}]);
    setVehicles([{}]);
    setFiles({
      aadharFront: null,
      aadharBack: null,
      addressProof: null,
      rentAgreement: null,
      photo: null,
    });
  };

  const handleMemberCountChange = (event) => {
    const count = Number(event.target.value);
    setMemberCount(count);

    setMembers((prev) => {
      const newMembers = [...prev];
      while (newMembers.length < count) {
        newMembers.push({});
      }
      return newMembers.slice(0, count);
    });
  };

  const handleInputChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleVehicleCountChange = (event) => {
    const count = Number(event.target.value);
    setVehicleCount(count);

    setVehicles((prev) => {
      const newVehicles = [...prev];
      while (newVehicles.length < count) {
        newVehicles.push({});
      }
      return newVehicles.slice(0, count);
    });
  };

  const handleInputVecChange = (index, field, value) => {
    const newVehicles = [...vehicles];
    newVehicles[index] = { ...newVehicles[index], [field]: value };
    setVehicles(newVehicles);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);

      setFiles((prevFiles) => ({
        ...prevFiles,
        photo: file,
      }));
    }
  };

  const handleFileChangee = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [field]: file,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Construct the ownerData object  
    const ownerData = {
        ...(residentData && { _id: residentData._id }), // Include ID if updating
        ...(files.photo && { avatar: files.photo }), // Include avatar if exists
        ...(fullName && { fullName: fullName }), // Ensure fullName is included
        ...(phoneNo && { phoneNumber: phoneNo }), // Include phoneNumber if exists
        ...(email && { email }), // Include email if exists
        ...(age && { age: Number(age) }), // Include age if exists
        ...(gender && { gender }), // Include gender if exists
        ...(wing && { wing }), // Include wing if exists
        ...(unit && { unitNumber: unit }), // Include unit if exists
        ...(relation && { relation }), // Include relation if exists
        documents: {
            ...(files.aadharFront && { aadhaarFront: files.aadharFront }), // Include aadhaarFront if exists
            ...(files.aadharBack && { aadhaarBack: files.aadharBack }), // Include aadhaarBack if exists
            ...(files.addressProof && { addressProof: files.addressProof }), // Include addressProof if exists
            ...(files.rentAgreement && { rentAgreement: files.rentAgreement }), // Include rentAgreement if exists
        },
        members: members.map(member => ({ // Map members to the correct structure
            ...(member.name && { name: member.name }), // Include name if exists
            ...(member.phoneNumber && { phoneNumber: member.phoneNumber }), // Include phoneNumber if exists
            ...(member.email && { email: member.email }), // Include email if exists
            ...(member.age && { age: Number(member.age) }), // Include age if exists
            ...(member.gender && { gender: member.gender }), // Include gender if exists
            ...(member.relation && { relation: member.relation }), // Include relation if exists
        })),
        vehicles: vehicles.map(vehicle => ({ // Map vehicles to the correct structure
            ...(vehicle.type && { type: vehicle.type }), // Include type if exists
            ...(vehicle.name && { name: vehicle.name }), // Include name if exists
            ...(vehicle.number && { number: vehicle.number }), // Include number if exists
        })),
        residentStatus: activeTab === "owner" ? "Owner" : "Tenant", // Set resident status
    };

    console.log('Owner Data:', ownerData); // Log the data being sent

    try {
        let response;
        if (residentData) {
            console.log(residentData, "residentData");
            response = await updateResident(residentData._id, ownerData);
            console.log('Data updated successfully:', response);
        } else {
            response = await createResident(ownerData);
            console.log('Data saved successfully:', response);
        }

        // Check if the response indicates success
        if (response && response.success) {
            navigate('/admin/residence'); // Navigate after successful operation
        } else {
            console.error('Failed to update/create resident:', response);
        }
    } catch (error) {
        console.error('Error saving data:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
  };

  const renderOwnerForm = () => (
    <div className="">
      <div className="flex sm:grid-cols-1 md:grid-cols-2 items-start space-x-4 bg-white px-3 pt-3 pb-4 rounded-lg">
        <div className="flex-shrink-0">
          <div className="relative w-20 h-20 ">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <button className="absolute inset-0 w-full h-full rounded-full focus:outline-none">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">+</span>
                    </div>
                  </div>
                </button>
              </div>
            )}
            <span className="mt-2 block text-xs text-gray-500 text-center">
              Add Photo
            </span>
          </div>
        </div>

        <div className="flex-1 grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name*
              </label>
              <input
                type="text"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number*
              </label>
              <input
                type="tel"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age*
              </label>
              <input
                type="number"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender*
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wing*
              </label>
              <input
                type="text"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={wing}
                onChange={(e) => setWing(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit*
              </label>
              <input
                type="text"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relation*
              </label>
              <input
                type="text"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {renderCommonFormSections()}
    </div>
  );

  const renderTenantForm = () => (
    <div className="">
      <div className="bg-white p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label className="text-neutral-700 font-semibold">
              Owner Full Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="border border-neutral-300 rounded-md p-2 mt-1"
              placeholder="Enter Full Name"
              value={ownerFullName}
              onChange={(e) => setOwnerFullName(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-700 font-semibold">
              Owner Phone<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="border border-neutral-300 rounded-md p-2 mt-1"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-700 font-semibold">
              Owner Address<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="border border-neutral-300 rounded-md p-2 mt-1"
              placeholder="Enter Address"
              value={ownerAddress}
              onChange={(e) => setOwnerAddress(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex  sm:grid-cols-1 md:grid-cols-2 items-start space-x-4 bg-white px-3 pt-3 pb-4 rounded-lg">
        <div className="flex-shrink-0">
          <div className="relative w-20 h-20 ">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <button className="absolute inset-0 w-full h-full rounded-full focus:outline-none">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">+</span>
                    </div>
                  </div>
                </button>
              </div>
            )}
            <span className="mt-2 block text-xs text-gray-500 text-center">
              Add Photo
            </span>
          </div>
        </div>

        <div className="flex-1 grid gap-6 py-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name*
              </label>
              <input
                type="text"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number*
              </label>
              <input
                type="tel"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age*
              </label>
              <input
                type="number"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender*
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wing*
              </label>
              <input
                type="text"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={wing}
                onChange={(e) => setWing(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit*
              </label>
              <input
                type="text"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relation*
              </label>
              <input
                type="text"
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {renderCommonFormSections()}
    </div>
  );

  const renderCommonFormSections = () => {
    const handleDragOver = (event) => {
      event.preventDefault();
    };

    const handleDrop = (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          console.log(e.target.result);
          setSelectedImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const renderUploadBox = (label, field) => (
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-700">{label}</h3>
        <label
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium">
                {files[field] ? files[field].name : "Upload a file"}
              </p>
              <p className="text-xs text-gray-500">or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFileChangee(e, field)}
            accept=".png, .jpg, .jpeg, .gif"
          />
        </label>
      </div>
    )

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white mt-3 p-3 rounded">
          {renderUploadBox("Upload Aadhar Card (Front Side)", "aadharFront")}
          {renderUploadBox("Upload Aadhar Card (Back Side)", "aadharBack")}
          {renderUploadBox("Address Proof (Vera Bill OR Light Bill)", "addressProof")}
          {renderUploadBox("Rent Agreement", "rentAgreement")}
        </div>

        <div className="bg-white p-3 rounded-lg my-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Member Counting (Other Members)</h3>
            <select
              className="border rounded px-2 py-1"
              value={memberCount}
              onChange={handleMemberCountChange}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            {Array.from({ length: memberCount }).map((_, index) => (
              <div key={index} className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#202224]">Full Name*</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border bg-transparent rounded-md shadow-sm text-sm px-4 py-1"
                    placeholder="Enter Name"
                    value={members[index]?.name || ''}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#202224]">Phone No*</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full border bg-transparent rounded-md shadow-sm text-sm px-4 py-1"
                    placeholder="+91"
                    value={members[index]?.phoneNumber || ''}
                    onChange={(e) => handleInputChange(index, 'phoneNumber', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#202224]">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border bg-transparent rounded-md shadow-sm text-sm px-4 py-1"
                    placeholder="Enter Email"
                    value={members[index]?.email || ''}
                    onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#202224]">Age*</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border bg-transparent rounded-md shadow-sm text-sm px-4 py-1"
                    placeholder="Enter Age"
                    value={members[index]?.age || ''}
                    onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#202224]">Gender*</label>
                  <select
                    className="mt-1 block w-full border bg-transparent rounded-md shadow-sm text-sm px-4 py-1 text-[#A7A7A7]"
                    value={members[index]?.gender || ''}
                    onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#202224]">Relation*</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border bg-transparent rounded-md shadow-sm text-sm px-4 py-1"
                    placeholder="Enter Relation"
                    value={members[index]?.relation || ''}
                    onChange={(e) => handleInputChange(index, 'relation', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Vehicle Counting</h3>
            <select
              className="border rounded px-2 py-1"
              value={vehicleCount}
              onChange={handleVehicleCountChange}
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            {Array.from({ length: vehicleCount }).map((_, index) => (
              <div key={index} className="flex gap-4 border p-4 rounded-lg">
                <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#202224]">Vehicle Type*</label>
                    <select
                      className="mt-1 block w-full border rounded-md bg-transparent text-sm px-4 py-1"
                      value={vehicles[index]?.type || ''}
                      onChange={(e) => handleInputVecChange(index, 'type', e.target.value)}
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="Two Wheeler">Two Wheeler</option>
                      <option value="Four Wheeler">Four Wheeler</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#202224]">Vehicle Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border rounded-md bg-transparent text-sm px-4 py-1"
                      placeholder="Enter Name"
                      value={vehicles[index]?.name || ''}
                      onChange={(e) => handleInputVecChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#202224]">Vehicle Number</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border rounded-md shadow-sm text-sm bg-transparent px-4 py-1"
                      placeholder="Enter Number"
                      value={vehicles[index]?.number || ''}
                      onChange={(e) => handleInputVecChange(index, 'number', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#202224] hover:bg-gray-50 w-[10%]"
            onClick={() => navigate('/admin/residence')}
          >
            Cancel
          </button>
          {residentData ? (
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-blue-700 hover:bg-gradient-to-r from-[#FE512E] to-[#F09619] hover:text-white transition duration:200 w-[10%]"
            >
              Edit
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-blue-700 hover:bg-gradient-to-r from-[#FE512E] to-[#F09619] hover:text-white transition duration:200 w-[10%]"
            >
              Create
            </button>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <Aside />
      <div className="main">
        <Navbar />
        <div className="min-h-screen bg-blue-50 sm:p-6 lg:p-8">
          <div className="w-full max-w-10xl bg-[#f0f5fb] rounded-lg p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row justify-between items-center bg-[#f0f5fb]">
                <div className="flex flex-wrap">
                  <button
                    type="button"
                    className={`text-lg font-semibold px-4 py-2 m-1 ${activeTab === "owner"
                      ? "text-[#FFFFFF] border-b-2 bg-gradient-to-r from-[#FE512E] to-[#F09619] p-2 rounded-t-lg border-[#FE512E] border-b-2"
                      : "text-[#202224] border-[#FE512E] border-b-2 bg-white p-2 rounded-t-lg"
                      }`}
                    onClick={() => setActiveTab("owner")}
                  >
                    Owner
                  </button>
                  <button
                    type="button"
                    className={`text-lg font-semibold px-4 py-2 m-1 ${activeTab === "tenant"
                      ? "text-[#FFFFFF] border-b-2 bg-gradient-to-r from-[#FE512E] to-[#F09619] p-2 rounded-t-lg border-[#FE512E] border-b-2"
                      : "text-[#202224] border-[#FE512E] border-b-2 bg-white p-2 rounded-t-lg"
                      }`}
                    onClick={() => setActiveTab("tenant")}
                  >
                    Tenant
                  </button>
                </div>
              </div>

              <div className="mt-4">
                {activeTab === "tenant" ? renderTenantForm() : renderOwnerForm()}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};