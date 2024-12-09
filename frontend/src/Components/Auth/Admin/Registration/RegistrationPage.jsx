import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { registerUser, createSociety, getSocieties } from "../../../../utils/api";
import axios from "axios";


export default function RegistrationPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [societies, setSocieties] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    society: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [societyData, setSocietyData] = useState({
    societyname: "",
    societyaddress: "",
    country: "",
    state: "",
    city: "",
    zipcode: "",
  });

  const navigate = useNavigate();

  const fetchSocieties = async () => {
    try {
      const data = await getSocieties();
      console.log(data.data);

      setSocieties(data.data);
    } catch (error) {
      console.error("Error fetching societies:", error);
    }
  };

  useEffect(() => {
    // get socitey data 
    fetchSocieties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare payload for the register API
    const payload = {
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      society: formData.society,
      password: formData.password,
    };

    try {
      // Call the registerUser function from api.js
      const response = await registerUser(payload);
      console.log(response.data.token);
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        alert("Registration successful!");
        navigate('/admin/dashboard');
      } else {
        alert(response.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };



  const handleCreateSociety = async () => {
    try {
      // Prepare payload for society creation
      const payload = {
        societyname: societyData.societyname,
        societyaddress: societyData.societyaddress,
        country: societyData.country,
        state: societyData.state,
        city: societyData.city,
        zipcode: societyData.zipcode,
      };

      // Call the createSociety function from api.js
      const response = await createSociety(payload);

      if (response.success) {
        
        setSocieties(prevSocieties => [...prevSocieties, response.data]);


        // Reset the society form data
        setSocietyData({
          societyname: "",
          societyaddress: "",
          country: "",
          state: "",
          city: "",
          zipcode: "",
        });

        // Close the modal
        setOpenModel(false);

        // Show success message
        alert("Society created successfully!");
      } else {
        alert(response.message || "Failed to create society. Please try again.");
      }
    } catch (error) {
      // More detailed error handling
      console.error("Error creating society:", error);

      if (error.response) {
        // Server responded with a status code out of the 2xx range
        alert(error.response.data.message || "Error creating society. Please try again.");
      } else if (error.request) {
        // Request was made, but no response was received
        alert("No response from server. Please check your internet connection.");
      } else {
        // Other errors
        alert("Error creating society: " + error.message);
      }
    }
  };


  const openModal = () => {
    setOpenModel(true);
  };

  const handleSocietyInputChange = (e) => {
    setSocietyData({
      ...societyData,
      [e.target.name]: e.target.value
    });
  };


  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left side */}
      <div className="lg:w-1/2 p-8 flex flex-col bg-gray-50">
      <div className="mb-8">
          <div className="text-4xl font-bold text-orange-500">
            Dash<span className="text-gray-800">Stack</span>
          </div>

        </div>
        <div className="flex-grow flex flex-col items-center justify-center">
          <img
            src="/image/Registration.png"
            alt="Society Management Illustration"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="lg:w-1/2 p-8 relative">
        <div className="absolute inset-0 z-0">
          <img src="public/image/vector.png" className="object-cover w-full h-full" alt="Background Vector" />
        </div>
        <div className="w-3/5 mx-auto shadow-lg p-10 rounded-lg relative z-10 bg-white">
          <h1 className="text-2xl font-bold mb-6">Registration</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name*</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter First Name"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  value={formData.firstName}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name*</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter Last Name"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  value={formData.lastName}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address*</label>
              <input
                id="email"
                type="email"
                placeholder="Enter Email Address"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                value={formData.email}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number*</label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter Phone Number"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                value={formData.phone}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country*</label>
                <input
                  id="country"
                  type="text"
                  placeholder="Enter Country"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  value={formData.country}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State*</label>
                <input
                  id="state"
                  type="text"
                  placeholder="Enter State"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  value={formData.state}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City*</label>
                <input
                  id="city"
                  type="text"
                  placeholder="Enter City"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  value={formData.city}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="society" className="block text-sm font-medium text-gray-700">
                Select Society*
              </label>
              <div className="mt-1 relative">
                {/* Dropdown button */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white text-left"
                >
                  {formData.society
                    ? societies.find((s) => s._id === formData.society)?.societyname || "Select Society"
                    : "Select Society"}
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    ▼
                  </span>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {societies.map((val) => (
                      <li
                        key={val._id}
                        onClick={() => {
                          setFormData({ ...formData, society: val._id });
                          setIsDropdownOpen(false);
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {val.societyname}
                      </li>
                    ))}
                    {/* Create Society Option */}
                    <li
                      key="create-society"
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-orange-600 font-semibold"
                      onClick={() => {
                        openModal(); // Opens the modal for creating a new society
                        setIsDropdownOpen(false);
                      }}
                    >
                      Create New Society
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password*</label>
              <input
                id="password"
                type="password"
                placeholder="Enter Password"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                value={formData.password}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password*</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                value={formData.confirmPassword}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                checked={formData.agreeToTerms}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to all the Terms and Privacy Policies
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-[#E74C3C] hover:underline">Login</a>
          </p>
        </div>
      </div>

      {openModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4">Create New Society</h2>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                handleCreateSociety(societyData);
              }}>
                <div>
                  <label
                    htmlFor="societyname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Society Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="societyname"
                    name="societyname"
                    value={societyData.societyname}
                    onChange={handleSocietyInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 border p-3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="societyaddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Society Address
                  </label>
                  <input
                    type="text"
                    id="societyaddress"
                    name="societyaddress"
                    value={societyData.societyaddress}
                    onChange={handleSocietyInputChange}
                    placeholder="Enter Address"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 border p-3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={societyData.country}
                      onChange={handleSocietyInputChange}
                      required
                      placeholder="Enter Country"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 border p-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={societyData.state}
                      onChange={handleSocietyInputChange}
                      required
                      placeholder="Enter State"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 border p-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={societyData.city}
                      onChange={handleSocietyInputChange}
                      required
                      placeholder="Enter City"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 border p-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zipcode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Zip Code<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="zipcode"
                      name="zipcode"
                      value={societyData.zipcode}
                      onChange={handleSocietyInputChange}
                      required
                      placeholder="Enter Zip Code"
                      className="mt-1 block w-full border p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                <div className="flex justify-between space-x-4 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-[47%]"
                    onClick={() => setOpenModel(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-[47%] hover:bg-gradient-to-r hover:from-[#FE512E] hover:to-[#F09619] transition-all duration-300"
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
  );
}