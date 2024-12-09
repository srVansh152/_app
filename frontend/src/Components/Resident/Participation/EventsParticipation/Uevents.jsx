import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { Bell, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import UAside from '../../../Common/SideBar/ResidentSideBar/UAside';
import Navbar from '../../../Common/Navbar/Navbar';
import { getAnnouncements } from '../../../../utils/api';

const Uevents = () => {


    const [activeTab, setActiveTab] = useState('events')
    const [events, setEvents] = useState([]);
    const [eventssecond, setEventsSecond] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await getAnnouncements();
            setEvents(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const response = await getAnnouncements();
            setEventsSecond(response.data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {

        fetchEvents();
        fetchActivities();
    }, []);

    return (
        <div className='flex h-screen bg-[#EEF1FD]'>
            <UAside />
            <div className="flex-1 overflow-auto">
                <Navbar />
                <div className="w-full mx-auto p-4">
                    <div className="mb-4 flex flex-col sm:flex-row">
                        <button
                            className={`px-4 py-2 rounded-tl-lg rounded-tr-lg ${activeTab === 'events' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors'
                                }`}
                            onClick={() => setActiveTab('events')}
                        >
                            Events Participate
                        </button>
                        <button
                            className={`mt-2 sm:mt-0 sm:ml-2 px-4 py-2 rounded-tl-lg rounded-tr-lg ${activeTab === 'activity' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors'
                                }`}
                            onClick={() => setActiveTab('activity')}
                        >
                            Activity Participate
                        </button>
                    </div>
                   
                    {activeTab === 'events' && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-8">
                                <h2 className="text-xl font-semibold mb-6">Events Participation</h2>
                                
                                {loading ? (
                                   <div className="flex items-center justify-center p-8">
                                     <div className="text-center">
                                       <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                                       
                                     </div>
                                   </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 px-4 py-2 bg-[#EEF1FD] rounded-t-lg">
                                        <div className="font-medium text-gray-700 p-2">Participator Name</div>
                                        <div className="font-medium text-gray-700 p-2">Description</div>
                                        <div className="font-medium text-gray-700 p-2">Event Time</div>
                                        <div className="font-medium text-gray-700 p-2">Event Date</div>
                                        <div className="font-medium text-gray-700 p-2">Event Name</div>
                                    </div>
                                )}
                                <div className="divide-y">
                                    {events.map((event, index) => (
                                        <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-6 px-4 py-5 items-center  transition-colors">
                                            <div className="flex items-center gap-2">
                                                <img src="path/to/your/image.jpg" alt="Participator" className="w-10 h-10 rounded-full border border-gray-300" />
                                                <span className="font-medium">{event.title}</span>
                                            </div>
                                            <div className="text-gray-600">{event.description}</div>
                                            <div className="text-gray-600">{event.time}</div>
                                            <div className="text-gray-600">{event.date.split('T')[0]}</div>
                                            <div className="text-gray-600">{event.title}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'activity' && (
                        <div className="w-full mx-auto">
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="p-8">
                                    <h2 className="text-xl font-semibold mb-6">Activity Participation</h2>
                                    
                                    <div className="divide-y divide-gray-200">
                                        {loading ? (
                                            <div className="flex items-center justify-center p-8">
                                            <div className="text-center">
                                              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                                              
                                            </div>
                                          </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 px-4 py-3 bg-[#EEF1FD] rounded-t-lg">
                                                <div className="font-medium text-gray-700 p-2">Participator Name</div>
                                                <div className="font-medium text-gray-700 p-2">Description</div>
                                                <div className="font-medium text-gray-700 p-2">Activity Time</div>
                                                <div className="font-medium text-gray-700 p-2">Activity Date</div>
                                                <div className="font-medium text-gray-700 p-2">Activity Name</div>
                                            </div>
                                        )}
                                        {eventssecond.map((event, index) => (
                                            <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4 px-4 py-5 items-center">
                                                <div className="flex items-center gap-2">
                                                    <img src="path/to/your/image.jpg" alt="Participator" className="w-10 h-10 rounded-full border border-gray-300" />
                                                    <span className="font-medium">{event.title}</span>
                                                </div>
                                                <div className="text-gray-600">{event.description}</div>
                                                <div className="text-gray-600">{event.time}</div>
                                                <div className="text-gray-600">{event.date.split('T')[0]}</div>
                                                <div className="text-gray-600">{event.title}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}

export default Uevents
