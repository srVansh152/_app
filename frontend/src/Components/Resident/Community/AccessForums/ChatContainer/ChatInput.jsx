import React from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const ChatInput = ({ message, setMessage, handleSendMessage, fileInputRef, handleFileUpload, showEmojiPicker, setShowEmojiPicker, handleEmojiSelect }) => {
    return (
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
    );
};

export default ChatInput; 