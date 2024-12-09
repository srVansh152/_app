'use client'

import {
  Activity,
  User,
  FileText,
  Calendar,
  Users,
  DollarSign,
  Shield,
  LogOut,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UAside() {
  const navigate = useNavigate()
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState('')

  // Community menu items
  const communityMenuItems = [
    { id: 1, label: 'Access Forums', path: 'uchat' },
    // { id: 2, label: 'Polls', path: 'upools' },
    { id: 3, label: 'Communities Discussion', path: 'ucommunity' },
  ]

  // Payment Portal menu items
  const paymentMenuItems = [
    { id: 1, label: 'Maintenance invoices', path: 'Maintenace' },
    { id: 2, label: 'Other Income invoice', path: 'otherincome' },
  ]

  const handleDropdownToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? '' : dropdown)
  }

  // Update current path when location changes
  useEffect(() => {
    setCurrentPath(window.location.pathname)

    if (communityMenuItems.some(item => currentPath.includes(item.path))) {
      setOpenDropdown('Community')
    } else if (paymentMenuItems.some(item => currentPath.includes(item.path))) {
      setOpenDropdown('Payment Portal')
    }
  }, [currentPath])

  // Helper function to check if a path is active
  const isPathActive = (path) => {
    return currentPath === `/user/${path}` || currentPath.startsWith(`/user/${path}/`)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-0 left-0 z-20 p-4"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <span className="text-2xl font-bold text-[#FF4B1C]">☰</span>
      </button>

      {/* Sidebar */}
      <div className={`w-[70%] md:w-[17%] p-4 bg-white shadow-lg flex flex-col fixed inset-0 top-0 left-0 sm:relative sm:block transform transition-transform duration-300 z-30 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:static`}
        style={{ height: '100vh' }}
      >

        <div className='flex flex-col justify-between h-full'>
          <div className='sidebar-content'>
            <h1 className="hidden text-2xl font-bold text-orange-500 cursor-pointer transition-colors hover:text-orange-600 lg:flex">
              Dash<span className="text-gray-800">Stack</span>
            </h1>

            <nav className="mt-8 space-y-2">
              {/* Dashboard */}
              <SidebarItem
                icon={Activity}
                label="Dashboard"
                path="udashboard"
                active={isPathActive('udashboard')}
                hovered={hoveredMenu === 'Dashboard'}
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/user/udashboard')
                  setCurrentPath('/user/udashboard')
                  setIsSidebarOpen(false)
                  setHoveredMenu(null)
                }}
                onMouseEnter={() => setHoveredMenu('Dashboard')}
                onMouseLeave={() => setHoveredMenu(null)}
              />

              {/* Personal Detail */}
              <SidebarItem
                icon={User}
                label="Personal Detail"
                path="upersonaldetail"
                active={isPathActive('upersonaldetail')}
                hovered={hoveredMenu === 'Personal Detail'}
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/user/upersonaldetail')
                  setCurrentPath('/user/upersonaldetail')
                  setIsSidebarOpen(false)
                  setHoveredMenu(null)
                }}
                onMouseEnter={() => setHoveredMenu('Personal Detail')}
                onMouseLeave={() => setHoveredMenu(null)}
              />

              {/* Service and Complaint */}
              <SidebarItem
                icon={FileText}
                label="Service and Complaint"
                path="ucomplaintSubmission"
                active={isPathActive('ucomplaintSubmission')}
                hovered={hoveredMenu === 'Service and Complaint'}
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/user/ucomplaintSubmission')
                  setCurrentPath('/user/ucomplaintSubmission')
                  setIsSidebarOpen(false)
                  setHoveredMenu(null)
                }}
                onMouseEnter={() => setHoveredMenu('Service and Complaint')}
                onMouseLeave={() => setHoveredMenu(null)}
              />

              {/* Events Participation */}
              <SidebarItem
                icon={Calendar}
                label="Events Participation"
                path="uevents"
                active={isPathActive('uevents')}
                hovered={hoveredMenu === 'Events Participation'}
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/user/uevents')
                  setCurrentPath('/user/uevents')
                  setIsSidebarOpen(false)
                  setHoveredMenu(null)
                }}
                onMouseEnter={() => setHoveredMenu('Events Participation')}
                onMouseLeave={() => setHoveredMenu(null)}
              />

              {/* Community Dropdown */}
              <Dropdown
                label="Community"
                icon={Users}
                isOpen={openDropdown === 'Community'}
                active={communityMenuItems.some(item => isPathActive(item.path))}
                hovered={hoveredMenu === 'Community'}
                items={communityMenuItems}
                onClick={() => handleDropdownToggle('Community')}
                onHoverEnter={() => setHoveredMenu('Community')}
                onHoverLeave={() => setHoveredMenu(null)}
                currentPath={currentPath}
                setCurrentPath={setCurrentPath}
                setIsSidebarOpen={setIsSidebarOpen}
                setOpenDropdown={setOpenDropdown}
              />

              {/* Payment Portal Dropdown */}
              <Dropdown
                label="Payment Portal"
                icon={DollarSign}
                isOpen={openDropdown === 'Payment Portal'}
                active={paymentMenuItems.some(item => isPathActive(item.path))}
                hovered={hoveredMenu === 'Payment Portal'}
                items={paymentMenuItems}
                onClick={() => handleDropdownToggle('Payment Portal')}
                onHoverEnter={() => setHoveredMenu('Payment Portal')}
                onHoverLeave={() => setHoveredMenu(null)}
                currentPath={currentPath}
                setCurrentPath={setCurrentPath}
                setIsSidebarOpen={setIsSidebarOpen}
                setOpenDropdown={setOpenDropdown}
              />

              {/* Security Protocols */}
              <SidebarItem
                icon={Shield}
                label="Security Protocols"
                path="usecurityprotocol"
                active={isPathActive('usecurityprotocol')}
                hovered={hoveredMenu === 'Security Protocols'}
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/user/usecurityprotocol')
                  setCurrentPath('/user/usecurityprotocol')
                  setIsSidebarOpen(false)
                  setHoveredMenu(null)
                }}
                onMouseEnter={() => setHoveredMenu('Security Protocols')}
                onMouseLeave={() => setHoveredMenu(null)}
              />
            </nav>
          </div>

          <div className='logoutbtn'>

            {/* Logout */}
            <SidebarItem
              icon={LogOut}
              label="Logout"
              path="/"
              active={false}
              hovered={hoveredMenu === 'Logout'}
              onClick={(e) => {
                e.preventDefault()
                navigate('/')
                setCurrentPath('/')
                setIsSidebarOpen(false)
                setHoveredMenu(null)
              }}
              onMouseEnter={() => setHoveredMenu('Logout')}
              onMouseLeave={() => setHoveredMenu(null)}
            />
          </div>
        </div>

      </div>



      {/* Overlay for mobile menu */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-5 bg-black opacity-50 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </>
  )
}

// Include the SidebarItem and Dropdown component definitions from your Aside.jsx here
// ... (keep the existing SidebarItem and Dropdown components from your Aside.jsx)

// Add these component definitions at the bottom of the file
function SidebarItem({ icon: Icon, label, path, active, hovered, onClick, onMouseEnter, onMouseLeave }) {
  const isLogout = label === 'Logout';

  return (
    <div className="relative">
      {active && !isLogout && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-gradient-to-b from-[#FF4B1C] to-[#FF8037] rounded-r"
          style={{ left: '-16px' }}
        />
      )}
      <a
        href={`/${path}`}
        onClick={(e) => {
          e.preventDefault();
          if (isLogout) {
            localStorage.clear(); // Clear all localStorage data
          }
          onClick(e);
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`relative flex w-full items-center gap-3 px-4 py-3 text-sm transition-all duration-200 rounded-lg my-1
          ${isLogout
            ? 'text-red-600 font-bold hover:scale-105'
            : active
              ? 'bg-gradient-to-r from-[#FF4B1C] to-[#FF8037] text-white'
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#FF4B1C] hover:to-[#FF8037] hover:text-white'}
          ${hovered ? 'shadow-sm' : ''}`}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </a>
    </div>
  )
}

function Dropdown({
  label,
  icon: Icon,
  isOpen,
  active,
  hovered,
  items,
  onClick,
  onHoverEnter,
  onHoverLeave,
  currentPath,
  setCurrentPath,
  setIsSidebarOpen,
  setOpenDropdown
}) {
  const navigate = useNavigate()

  const isDropdownActive = items.some(item => currentPath === `/user/${item.path}`) || active

  return (
    <div className="my-1 relative" style={{ height: 'auto' }}>
      {isDropdownActive && (
        <div
          className={`absolute left-0 w-1 bg-gradient-to-b from-[#FF4B1C] to-[#FF8037] rounded-r
            ${isOpen
              ? 'h-10 top-0'
              : 'h-8 top-1/2 -translate-y-1/2'}`}
          style={{ left: '-16px' }}
        />
      )}
      <button
        onClick={onClick}
        onMouseEnter={onHoverEnter}
        onMouseLeave={onHoverLeave}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 rounded-lg
          ${isDropdownActive || isOpen
            ? 'bg-gradient-to-r from-[#FF4B1C] to-[#FF8037] text-white'
            : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#FF4B1C] hover:to-[#FF8037] hover:text-white'}
          ${hovered ? 'shadow-sm' : ''}`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 transition-transform duration-200 ${hovered ? 'scale-110' : ''}`} />
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="pl-8 mt-2 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="relative">
              {currentPath === `/user/${item.path}` && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-gradient-to-b from-[#FF4B1C] to-[#FF8037] rounded-r"
                  style={{ left: '-16px' }}
                />
              )}
              <a
                href={`/user/${item.path}`}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(`/user/${item.path}`)
                  setCurrentPath(`/user/${item.path}`)
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-lg
                  ${currentPath === `/user/${item.path}`
                    ? 'text-[#FF4B1C] font-medium'
                    : 'text-gray-600 hover:text-[#FF4B1C]'}`}
              >
                <span>{item.label}</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}