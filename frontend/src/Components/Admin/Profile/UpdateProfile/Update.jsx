import React, { useState, useEffect } from 'react';
import { Pencil, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Aside from '../../../Common/SideBar/AdminSideBar/Aside';
import { getProfile, updateProfile } from '../../../../utils/api';
import Navbar from '../../../Common/Navbar/Navbar';

const Update = () => {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [formValues, setFormValues] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    selectSociety: '',
    country: '',
    state: '',
    city: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxFileSize = 2 * 1024 * 1024; // 2MB

      if (!validImageTypes.includes(file.type)) {
        setErrorMessage('Please upload a valid image (JPEG or PNG).');
        return;
      }

      if (file.size > maxFileSize) {
        setErrorMessage('Image size should not exceed 2MB.');
        return;
      }

      setSelectedImage(file); // Store the selected file
      setErrorMessage('');
    }
  };

  // Prepare and submit the form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true); // Show loading spinner or indicator

      // Prepare form data for submission
      const formData = new FormData();
      Object.keys(formValues).forEach((key) => {
        formData.append(key, formValues[key]);
      });

      // Append selected image if exists
      if (selectedImage) {
        formData.append('userPhoto', selectedImage);
      }

      // Retrieve token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }

      // Call the backend API to update the profile
      const response = await updateProfile(token, formData);

      if (response.success) {
        alert(response.message);
        navigate("/admin/dashboard")
        fetchProfile()
      } else {
        alert(response.message || 'Profile update failed.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile. Please try again.');
    } finally {
      setIsLoading(false); // Hide loading spinner or indicator
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoading(true);

      const profileResponse = await getProfile(token);
      if (profileResponse.success) {
        const userData = profileResponse.data.user;

        // Populate form fields
        setFormValues({
          firstname: userData.firstname || '',
          lastname: userData.lastname || '',
          phone: userData.phone || '',
          email: userData.email || '',
          selectSociety: userData.society?.societyname || '',
          country: userData.country || '',
          state: userData.state || '',
          city: userData.city || '',
        });

        // Set profile image if available
        setSelectedImage(userData.userPhoto || null);
      } else {
        setErrorMessage(profileResponse.message);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch user profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fieldsArray = [
    { label: 'First Name', name: 'firstname' },
    { label: 'Last Name', name: 'lastname' },
    { label: 'Phone Number', name: 'phone' },
    { label: 'Email Address', name: 'email' },
    { label: 'Select Society', name: 'selectSociety', disabled: true },
    { label: 'Country', name: 'country' },
    { label: 'State', name: 'state' },
    { label: 'City', name: 'city' },
  ];


  return (
    <>
      <Aside/>
      <div className="main">
        <Navbar/>
        <div className="w-full">
          <img src="/image/blacnk.png" alt="Background" className="w-full" />
        </div>
        <div className="max-w-[1000px] mx-auto mt-[-100px] flex justify-center p-4">
          <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {selectedImage ? (
                        <img 
                          src={typeof selectedImage === 'string' ? selectedImage : URL.createObjectURL(selectedImage)} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => document.getElementById('photo-upload').click()}
                      className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg border hover:bg-gray-50"
                    >
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-center mt-4">
                    {formValues.firstname || 'Your Name'}
                  </h2>
                </div>
                <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...fieldsArray].map(({ label, name, disabled }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700">{label}*</label>
                      <input
                        type="text"
                        name={name}
                        className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={formValues[name]}
                        onChange={handleChange}
                        disabled={disabled} // Add the disabled attribute here
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-orange-500 flex items-center hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Update;
