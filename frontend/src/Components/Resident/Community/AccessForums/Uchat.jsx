import React, { useState, useEffect, useRef } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import UAside from '../../../Common/SideBar/ResidentSideBar/UAside';
import { Video, Phone, X } from 'lucide-react';
import Navbar from '../../../Common/Navbar/Navbar';
import { useChat } from '../../../../context/ChatContext.jsx';
import { getResidents } from '../../../../utils/api.js';
import { chatApi } from '../../../../services/chatApi.js';

const Uchat = () => {
    
    const {
        socket,
        messages: contextMessages,
        setMessages: setContextMessages,
        sendMessage: contextSendMessage,
        joinChat,
        onlineUsers,
        isUserOnline,
        getUserLastSeen
    } = useChat();

    const loggedInUserId = localStorage.getItem('userId');

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState('');
    const [residents, setResidents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResident, setSelectedResident] = useState(null);
    const [callState, setCallState] = useState({ isActive: false, type: null });
    const fileInputRef = useRef(null);
    const [currentChatId, setCurrentChatId] = useState(null);
    const messagesEndRef = useRef(null);

    const fetchResidents = async () => {
        try {
            const response = await getResidents();
            const loggedInUserEmail = localStorage.getItem('Email');
            const filteredResidents = response.data.filter(
                resident => resident.email !== loggedInUserEmail
            );
            setResidents(filteredResidents);
            if (filteredResidents.length > 0) {
                setSelectedResident(filteredResidents[0]);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                window.location.href = '/login';
            }
            console.error('Error fetching residents:', error);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [contextMessages]);

    useEffect(() => {
        if (socket) {
            // Remove any existing listeners first
            socket.off('newMessage');
            
            // Add new listener
            socket.on('newMessage', (newMessage) => {
                console.log('Received new message:', newMessage);
                
                // Only add message if it's for the current chat
                if (newMessage.chat === currentChatId) {
                    setContextMessages(prev => {
                        // Check if message already exists
                        if (prev.some(msg => msg.id === newMessage._id)) {
                            return prev;
                        }
                        
                        return [...prev, {
                            id: newMessage._id,
                            sender: newMessage.sender._id === loggedInUserId ? 'You' : newMessage.sender.fullName,
                            content: newMessage.text,
                            timestamp: new Date(newMessage.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            }),
                            senderId: newMessage.sender._id
                        }];
                    });
                }
            });

            return () => {
                socket.off('newMessage');
            };
        }
    }, [socket, currentChatId, loggedInUserId]);

    useEffect(() => {
        if (selectedResident && socket) {
            const initializeChat = async () => {
                try {
                    const response = await chatApi.createChat(selectedResident._id);
                    const chatId = response._id;
                    setCurrentChatId(chatId);
                    
                    // Fetch existing messages first
                    const existingMessages = await chatApi.getChatMessages(chatId);
                    setContextMessages(existingMessages);
                    
                    // Join the chat room
                    joinChat(chatId);
                    socket.emit('joinChat', {
                        chatId,
                        userId: loggedInUserId
                    });

                } catch (error) {
                    console.error('Error initializing chat:', error);
                }
            };
            initializeChat();
        }
    }, [selectedResident, socket]);

    const handleSendMessage = async () => {
        if (message.trim() === '' || !selectedResident || !currentChatId) return;

        try {
            const messageData = {
                chatId: currentChatId,
                text: message.trim(),
                senderId: loggedInUserId,
                receiverId: selectedResident._id
            };

            // Clear input field immediately
            setMessage('');

            // Only send through context
            await contextSendMessage(messageData);

        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filteredResidents = residents.filter((resident) =>
            resident.name?.toLowerCase().includes(query.toLowerCase()) ||
            resident.email?.toLowerCase().includes(query.toLowerCase())
        );
        setResidents(filteredResidents);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !currentChatId) return;

        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const uploadResponse = await chatApi.uploadMedia(formData);
            
            const messageData = {
                chatId: currentChatId,
                text: file.name,
                senderId: loggedInUserId,
                receiverId: selectedResident._id,
                mediaUrl: uploadResponse.url
            };

            socket.emit('sendMessage', messageData);

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        }
    };

    const handleEmojiSelect = (emoji) => {
        setMessage((prevMessage) => prevMessage + emoji.native);
        setShowEmojiPicker(false);
    };

    const handleCall = (type) => {
        setCallState({ isActive: true, type });
    };

    const endCall = () => {
        setCallState({ isActive: false, type: null });
    };

    const formatLastSeen = (userId) => {
        const lastSeen = getUserLastSeen(userId);
        if (!lastSeen) return 'Offline';
        return new Date(lastSeen).toLocaleString();
    };

    return (
        <div className='flex h-screen bg-gray-50'>
            <UAside />
            <div className="flex-1 overflow-auto">
             <Navbar/>
                <div className="flex shadow bg-white p-2 h-[860px] flex-col md:flex-row">
                    {/* Left Sidebar */}
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
                        <div className="flex-1 overflow-y-auto">
                            {/* Residents List */}
                            {residents.map((resident) => (
                                <div
                                    key={resident._id}
                                    className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b 
                                        ${selectedResident?._id === resident._id ? 'bg-gray-100' : ''}`}
                                    onClick={() => setSelectedResident(resident)}
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

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-3">
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

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {contextMessages.map((msg) => {
                                const isOwnMessage = msg.senderId === loggedInUserId;
                                const senderName = isOwnMessage ? 'You' : 
                                    (msg.sender?.fullName || selectedResident?.name || 'User');
                                
                                return (
                                    <div 
                                        key={msg.id} 
                                        className={`flex items-start gap-2.5 ${
                                            isOwnMessage ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        {!isOwnMessage && (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                                {msg.sender?.photo ? (
                                                    <img 
                                                        src={msg.sender.photo} 
                                                        alt={senderName} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                                        {senderName.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        <div className={`flex flex-col gap-1 max-w-[70%] ${
                                            isOwnMessage ? 'items-end' : 'items-start'
                                        }`}>
                                            <div className={`${
                                                isOwnMessage 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'bg-gray-100'
                                            } rounded-lg p-3`}>
                                                <p>{msg.content}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <span>{msg.timestamp}</span>
                                                {isOwnMessage && (
                                                    <span>✓</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t">
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                    onClick={() => fileInputRef.current?.click()}
                                >
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
                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                        />
                                    </svg>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept="image/*,video/*"
                                />
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 px-4 py-2 rounded-full bg-gray-100 focus:outline-none"
                                />
                                <button
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
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
                                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full"
                                    onClick={handleSendMessage}
                                >
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                            {showEmojiPicker && (
                                <div className="absolute bottom-20 right-4">
                                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Call Overlay */}
                    {callState.isActive && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                                <h3 className="text-xl font-semibold mb-4">
                                    {callState.type === 'audio' ? 'Audio Call' : 'Video Call'} with {selectedResident?.name}
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
            </div>
        </div>
    )
}

export default Uchat;