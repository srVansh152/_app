import React, { useState, useEffect, useRef } from 'react';

import { Bell, X, ChevronDown, Hash, List, Radio, Star, Type } from 'lucide-react';
import { Link } from 'react-router-dom';

import UAside from '../../../Common/SideBar/ResidentSideBar/UAside';
import Utitle from '../../../../User/Utitle';
import Navbar from '../../../Common/Navbar/Navbar';


const Ucommunity = () => {
    
    const [selectedContact, setSelectedContact] = useState("Community")
    const [votes, setVotes] = useState(0);
    const [answers, setAnswers] = useState(0);
    const [questions, setQuestions] = useState('What is the capital of France?');
    const [contents, setContents] = useState('Feel free to let me know if you need more examples or if there like to include in your dummy content');
    const [views, setViews] = useState(40);
    const contacts = [
        { name: "Community", message: "Typing...", time: "9:20", unread: false }
    ]



   


    return (
        <div className='flex h-screen bg-gray-50'>
            <UAside />
            <div className="flex-1 overflow-auto">
              <Navbar/>
                <div className="flex h-screen bg-gray-100">
                    <aside className="w-full sm:w-1/4 bg-white p-4 border-r border-gray-200">
                        <h1 className="text-xl font-bold mb-4">Chat</h1>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search Here"
                                className="w-full p-2 pl-8 border border-gray-300 rounded-md"
                            />
                            <svg
                                className="w-4 h-4 absolute left-2 top-3 text-gray-400"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <ul>
                            {contacts.map((contact, index) => (
                                <li
                                    key={index}
                                    className={`flex items-center justify-between p-2 mb-2 rounded-lg cursor-pointer ${selectedContact === contact.name ? "bg-gray-200" : ""
                                        }`}
                                    onClick={() => setSelectedContact(contact.name)}
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                                        <div>
                                            <p className="font-semibold">{contact.name}</p>
                                            <p className="text-sm text-gray-500">{contact.message}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">{contact.time}</p>
                                        {contact.unread && (
                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </aside>
                    <main className="flex-1 p-4 hidden lg:block">
    <header className="flex items-center justify-between mb-4 flex-col sm:hidden">
        <div className="flex items-center mb-2 sm:mb-0">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
            <div>
                <h2 className="text-xl font-bold">Community</h2>
                <p className="text-sm text-gray-500">9:00 PM</p>
            </div>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center">
            Ask Question
            <svg
                className="w-4 h-4 ml-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
        </button>
    </header>
    <div className="space-y-4 overflow-auto h-[calc(100vh-8rem)]">
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-sm text-gray-500">
                        {votes} votes • {answers} answers
                    </p>
                    <h3 className="font-semibold">{questions}</h3>
                </div>
                <div className="flex items-center text-gray-500">
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {views}
                </div>
            </div>
            <p className="text-sm text-gray-600">{contents}</p>
        </div>
        <Utitle />
    </div>
</main>

                </div>

            </div>

        </div>

    )
}

export default Ucommunity
