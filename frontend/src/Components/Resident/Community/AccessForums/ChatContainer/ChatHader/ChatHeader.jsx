import React, { useState, useEffect } from 'react';
import { Video, Phone, Paperclip, Smile, Send, Bell, X } from 'lucide-react';

const ChatHeader = () => {
    const [selectedContact, setSelectedContact] = useState(null);
     const [callState, setCallState] = useState({ isActive: false, type: null });
   



    const handleCall = (type) => {
        setCallState({ isActive: true, type });
    };

    const endCall = () => {
        setCallState({ isActive: false, type: null });
    };


    return (
        <div>
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3 ms-3">
                <div className="w-10 h-10 sm:ms-5 lg:ms-0 rounded-full bg-gray-200" />

                    <div>
                        <h2 className="font-semibold">{selectedContact?.name || 'Select a contact'}</h2>
                        <p className="text-sm text-gray-500">{selectedContact ? 'Active Now' : 'No contact selected'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => handleCall('audio')}
                        aria-label="Start audio call"
                    >
                        <Phone className="w-5 h-5 text-gray-500" />
                    </button>
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => handleCall('video')}
                        aria-label="Start video call"
                    >
                        <Video className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {callState.isActive && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                                <h3 className="text-xl font-semibold mb-4">
                                    {callState.type === 'audio' ? 'Audio Call' : 'Video Call'} with {selectedContact?.name}
                                </h3>
                                <p className="mb-4">Call duration: 00:00</p>
                                <button
                                    onClick={endCall}
                                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-200"
                                >
                                    <X className="w-6 h-6 inline-block mr-2" />
                                    End Call
                                </button>
                            </div>
                        </div>
                    )}
        </div>
    );
}

export default ChatHeader
