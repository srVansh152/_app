import { Bell } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios'; // Make sure to import axios
import { Link } from 'react-router-dom';
import SAside from '../../Common/SideBar/SecuritySideBar/SAside';
import Navbar from '../../Common/Navbar/Navbar';

const SemergencyManagment = () => {
    const [alertType, setAlertType] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    // Function to add emergency alert
    const addEmergencyAlert = async (alertData) => {
        try {
            const token = localStorage.getItem('token');

            console.log(alertData)
            const response = await axios.post(
                `https://dashstack-90hs.onrender.com/api/emergency-alerts`,
                alertData,
                
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                }
            );
            console.log(response)
            return { success: true, message: response.data.message, data: response.data };
        } catch (error) {
            console.error('Add emergency alert error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add emergency alert.',
            };
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();


        if (!alertType || !description) {
            setFeedbackMessage('Please fill in all required fields.');
            return;
        }

        setIsLoading(true);
        setFeedbackMessage(''); // Clear any previous feedback message

        const alertData = {
            alertType,
            description,
        };

        const result = await addEmergencyAlert(alertData);

        setIsLoading(false);

        if (result.success) {
            setFeedbackMessage('Emergency alert sent successfully!');
            // Clear the form after success
            setAlertType('');
            setDescription('');
        } else {
            setFeedbackMessage(result.message);
        }
    };

    return (
        <div className="flex">
            <SAside />
            <div className="flex-1 min-h-screen bg-slate-50">
                {/* Navigation */}
                <Navbar />

                {/* Main Content */}
                <main className="flex min-h-[calc(100vh-81px)] items-center justify-center p-4">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
                        <h1 className="mb-6 text-xl font-semibold text-center">Alert</h1>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label htmlFor="alertType" className="block text-sm font-medium text-gray-700">
                                    Alert Type*
                                </label>
                                <select
                                    id="alertType"
                                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={alertType}
                                    onChange={(e) => setAlertType(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Select Alert
                                    </option>
                                    <option value="Fire">Fire</option>
                                    <option value="Earthquake">Earthquake</option>
                                    <option value="Flooding">Flooding</option>
                                    <option value="Medical">Medical</option>
                                    <option value="Power Outage">Power Outage</option>
                                    <option value="Intruder">Intruder</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description*
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="An emergency description typically refers to a detailed account or explanation of an emergency situation..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {feedbackMessage && (
                                <div
                                    className={`text-sm font-medium mt-2 ${feedbackMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    {feedbackMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SemergencyManagment;
