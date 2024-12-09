import React from 'react';
import { Video, Phone, X, ArrowLeft } from 'lucide-react';

const ChatHeader = ({ selectedResident, handleCall, endCall, callState, isUserOnline, formatLastSeen, toggleSidebar }) => {
    return (
        <div className="flex items-center justify-between p-4 border-b" style={{ marginTop: '69px' }}>
            <div className="flex items-center gap-3">
                <button className="md:hidden p-2" onClick={toggleSidebar}>
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {selectedResident?.photo ? (
                            <img 
                                src={selectedResident.photo} 
                                alt={selectedResident.name} 
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                                {selectedResident?.name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    {selectedResident && (
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            isUserOnline(selectedResident._id) ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                    )}
                </div>
                <div>
                    <h2 className="font-semibold">{selectedResident?.name || 'Select a resident'}</h2>
                    <p className="text-sm text-gray-500">
                        {selectedResident ? 
                            (isUserOnline(selectedResident._id) ? 
                                'Active Now' : 
                                `Last seen: ${formatLastSeen(selectedResident._id)}`) 
                            : 'No resident selected'}
                    </p>
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
            </div>
        </div>
    );
};

export default ChatHeader;
