import React, { useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';


const ChatContainer = () => {

    const [selectedContact, setSelectedContact] = useState(null);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messages, setMessages] = useState([]);



    const fileInputRef = useRef(null);

        
    const handleSendMessage = () => {
        if (message.trim() !== '') {
            const newMessage = {
                id: messages.length + 1,
                sender: 'You',
                content: message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'text',
            };
            setMessages([...messages, newMessage]);
            setMessage('');

            if (selectedContact) {
                const updatedContacts = contacts.map((contact) =>
                    contact.id === selectedContact.id
                        ? { ...contact, lastMessage: message, lastMessageTime: newMessage.timestamp }
                        : contact
                );
                setContacts(updatedContacts);
            }
        }
    };
    
    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                const newMessage = {
                    id: messages.length + 1,
                    sender: 'You',
                    content,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                };
                setMessages([...messages, newMessage]);
            };
            reader.readAsDataURL(file);
        }
    };

    
    const handleEmojiSelect = (emoji) => {
        setMessage((prevMessage) => prevMessage + emoji.native);
        setShowEmojiPicker(false);
    };
  return (
    <div className='flex-1 flex flex-col'>
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selectedContact && messages.map((msg) => (
                                <div key={msg.id} className={`flex items-start gap-2.5  ${msg.sender === 'You' ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-8 h-8  rounded-full bg-gray-200" />
                                    <div className={`flex flex-col gap-1 ${msg.sender === 'You' ? 'items-end' : ''}`}>
                                        <div className="flex items-center gap-2">
                                            {msg.sender !== 'You' && <span className="font-medium">{msg.sender}</span>}
                                            <span className="text-sm text-gray-500">{msg.timestamp}</span>
                                            {msg.sender === 'You' && <span className="font-medium">{msg.sender}</span>}
                                        </div>
                                        <div className={`${msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3 max-w-md`}>
                                            {msg.type === 'text' && <p>{msg.content}</p>}
                                            {msg.type === 'image' && (
                                                <img
                                                    src={msg.content}
                                                    alt="Shared image"
                                                    className="rounded-lg mb-2 w-full h-48 object-cover"
                                                />
                                            )}
                                            {msg.type === 'video' && (
                                                <video controls className="rounded-lg mb-2 w-full h-48 object-cover">
                                                    <source src={msg.content} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
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
  )
}

export default ChatContainer
