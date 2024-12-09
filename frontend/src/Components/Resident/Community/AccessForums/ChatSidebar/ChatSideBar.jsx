<<<<<<< HEAD
import React from 'react';

const ChatSidebar = ({ residents, selectedResident, handleResidentSelection, searchQuery, handleSearch, isUserOnline, formatLastSeen }) => {
    return (
        <div className="w-full md:w-80 border-r flex flex-col">
            <div className="p-4 border-b">
                <div className="relative">
                    <input
                        type="search"
                        placeholder="Search Residents"
                        className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                {residents.map((resident) => (
                    <div
                        key={resident._id}
                        className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b 
                            ${selectedResident?._id === resident._id ? 'bg-gray-100' : ''}`}
                        onClick={() => handleResidentSelection(resident)}
                    >
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                {resident.photo ? (
                                    <img 
                                        src={resident.photo} 
                                        alt={resident.name} 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                                        {resident.name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                isUserOnline(resident._id) ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <p className="font-medium truncate">{resident.name}</p>
                                <span className="text-xs text-gray-500">
                                    {isUserOnline(resident._id) ? 'Online' : `Last seen: ${formatLastSeen(resident._id)}`}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                                {resident.lastMessage || resident.email}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatSidebar;
=======
import React, { useEffect, useState } from 'react'

const ChatSideBar = ({ setSelectedUser }) => {

    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const initialContacts = [
            { id: 1, name: 'Ariene McCoy', lastMessage: 'Hi there! How are you?', lastMessageTime: '9:00 PM' },
            { id: 2, name: 'Michael John', lastMessage: 'Can we meet tomorrow?', lastMessageTime: '8:30 PM' },
            { id: 3, name: 'Elizabeth Sarah', lastMessage: 'The project is done!', lastMessageTime: '7:45 PM' },
            { id: 4, name: 'Jenny Wilson', lastMessage: "Don't forget the meeting", lastMessageTime: '6:15 PM' },
            { id: 5, name: 'Esther Howard', lastMessage: 'Thanks for your help', lastMessageTime: '5:30 PM' },
        ];
        setContacts(initialContacts);
        setSelectedContact(initialContacts[0]);
    }, []);



    const handleSearch = (query) => {
        setSearchQuery(query);
        const filteredContacts = contacts.filter((contact) =>
            contact.name.toLowerCase().includes(query.toLowerCase()) ||
            contact.lastMessage.toLowerCase().includes(query.toLowerCase())
        );
        setContacts(filteredContacts);
    };

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        setSelectedUser(contact);
    };

  return (
    <div>
        <div className="w-full md:w-80 border-r flex flex-col">
                        <div className="p-4 border-b">
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="Search Here"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className=" overflow-y-auto">
                            {/* Chat List */}
                            {contacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b ${selectedContact?.id === contact.id ? 'bg-gray-100' : ''}`}
                                    onClick={() => handleContactClick(contact)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="font-medium truncate">{contact.name}</p>
                                            <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">
                                            {contact.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
 
  )
}

export default ChatSideBar
>>>>>>> d48643beaaa3ce85afcd8cb146f60f702416ab6e
