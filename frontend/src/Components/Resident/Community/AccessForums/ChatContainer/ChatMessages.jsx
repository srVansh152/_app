import React from 'react';

const ChatMessages = ({ contextMessages, loggedInUserId, selectedResident, messagesEndRef }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
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
                                {msg.senderPhoto ? (
                                    <img 
                                        src={msg.senderPhoto} 
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
    );
};

export default ChatMessages; 