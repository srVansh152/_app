import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import Aside from '../../../Common/SideBar/AdminSideBar/Aside';
import { getProfile } from '../../../../utils/api'; // Adjust the path based on your project structure
import Navbar from '../../../Common/Navbar/Navbar';

const Editprofile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailAddress: '',
    selectSociety: '',
    country: '',
    state: '',
    city: '',
  });
  const [isLoading, setIsLoading] = useState(true); // To manage loading state
  const [apiError, setApiError] = useState(''); // To handle API errors

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const profileResponse = await getProfile(token);
      if (profileResponse.success) {
        const userData = profileResponse.data.user;

        // Populate form fields
        setFormValues({
          firstName: userData.firstname || '',
          lastName: userData.lastname || '',
          phoneNumber: userData.phone || '',
          emailAddress: userData.email || '',
          selectSociety: userData.society?.societyname || '',
          country: userData.country || '',
          state: userData.state || '',
          city: userData.city || '',
        });

        console.log(userData);

        // Set profile image if available
        setSelectedImage(userData.userPhoto || null);
      } else {
        setApiError(profileResponse.message);
      }
    } catch (error) {
      setApiError('Failed to fetch user profile.');
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageUpload = (event) => {
    // Disable image upload functionality
    event.preventDefault();
    setErrorMessage('Image upload is disabled.');
  };

  if (isLoading) {
    return <div><div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 flex items-center justify-center z-50">
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>

        </div>
      </div>
    </div></div>;
  }

  if (apiError) {
    return <div className="text-red-500">{apiError}</div>;
  }

  return (
    <>
      <Aside />
      <div className="main">
        <Navbar />
        <div className="w-full">
          <img src="/image/blacnk.png" alt="Background" className="w-full" />
        </div>
        <div className="w-full max-w-[1000px] mx-auto mt-[-100px] flex justify-center p-4">
          <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
                <Link to="/admin/update">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </Link>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
                  <div className="relative w-40 h-40">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Profile"
                        className="w-40 h-40 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                        <button className="absolute inset-0 w-full h-full rounded-full focus:outline-none">
                          <input
                            type="file"
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled // Disable file upload
                          />
                          <div className="text-center">
                            <div className="w-8 h-8 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-500">+</span>
                            </div>
                          </div>
                        </button>
                      </div>
                    )}

                    {errorMessage && (
                      <p className="mt-2 text-xs text-red-500">{errorMessage}</p>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-center mt-5">
                    {formValues.firstName} {formValues.lastName}
                  </h2>
                </div>
                <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'First Name', name: 'firstName' },
                    { label: 'Last Name', name: 'lastName' },
                    { label: 'Phone Number', name: 'phoneNumber' },
                    { label: 'Email Address', name: 'emailAddress' },
                    { label: 'Select Society', name: 'selectSociety' },
                    { label: 'Country', name: 'country' },
                    { label: 'State', name: 'state' },
                    { label: 'City', name: 'city' },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}*
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={formValues[field.name]}
                        disabled // Disable input fields
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Editprofile;
