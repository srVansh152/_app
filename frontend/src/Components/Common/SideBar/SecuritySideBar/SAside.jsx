'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Menu } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

function SAside() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  // Update current path when location changes
  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-0 left-0 z-20 p-4"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="text-2xl font-bold text-orange-500">☰</span>
      </button>

      {/* Sidebar */}
      <div
        className={`w-[70%] md:w-[17%] p-4 bg-white shadow-lg flex flex-col fixed inset-0 top-0 left-0 sm:relative sm:block transform transition-transform duration-300 z-30 h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Main content wrapper */}
        <div className="flex flex-col h-full justify-between">
          {/* Top section with logo and nav */}
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-orange-500">Dash</span>
              <span className="text-gray-800">Stack</span>
            </h1>

            <nav className="mt-8 space-y-2">
              {/* Security Dropdown */}
              <div className="relative my-1">
                {currentPath.includes('/security') && (
                  <div 
                    className={`absolute left-0 w-1 bg-gradient-to-b from-[#FF4B1C] to-[#FF8037] rounded-r
                      ${isOpen ? 'h-10 top-0' : 'h-8 top-1/2 -translate-y-1/2'}`}
                    style={{ left: '-16px' }}
                  />
                )}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  onMouseEnter={() => setHoveredMenu('Security')}
                  onMouseLeave={() => setHoveredMenu(null)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 rounded-lg
                    ${currentPath.includes('/security') || isOpen
                      ? 'bg-gradient-to-r from-[#FF4B1C] to-[#FF8037] text-white'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#FF4B1C] hover:to-[#FF8037] hover:text-white'}
                    ${hoveredMenu === 'Security' ? 'shadow-sm' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>Security</span>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isOpen && (
                  <div className="pl-8 mt-2 space-y-2">
                    {[
                      { path: '/security/Svisitor', label: 'Visitor Tracking' },
                      { path: '/security/Semergency', label: 'Emergency Management' }
                    ].map((item) => (
                      <div key={item.path} className="relative">
                        {currentPath === item.path && (
                          <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-gradient-to-b from-[#FF4B1C] to-[#FF8037] rounded-r"
                            style={{ left: '-16px' }}
                          />
                        )}
                        <Link
                          to={item.path}
                          className={`w-full flex items-center px-4 py-2 text-sm rounded-lg
                            ${currentPath === item.path
                              ? 'text-[#FF4B1C] font-medium'
                              : 'text-gray-600 hover:text-[#FF4B1C]'}`}
                        >
                          <span>{item.label}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Logout Button */}
          <button 
            className="mt-auto flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg font-bold hover:scale-105 transition-all duration-200"
            onClick={() => {
              localStorage.clear(); // Clear all localStorage data
              navigate('/login'); // Redirect to login page or any other page
            }}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-5 bg-black opacity-50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  )
}

export default SAside
