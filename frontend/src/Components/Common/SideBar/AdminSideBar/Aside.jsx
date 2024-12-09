'use client'

import {
  Activity,
  DollarSign,
  Package,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Aside() {
  const navigate = useNavigate()
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState('')

  // Financial menu items
  const financialMenuItems = [
    { id: 2, label: 'Income', path: 'financial' },
    { id: 3, label: 'Expanse', path: 'expance' },
    { id: 4, label: 'Note', path: 'note' },
  ]

  // Complaint menu items
  const complaintMenuItems = [
    { id: 1, label: 'Create Complaint', path: 'createcomplain' },
    { id: 2, label: 'Request Tracking', path: 'requesttracking' },
  ]

  // Security management menu items
  const securityManagement = [
    { id: 1, label: 'Vistors Logs', path: 'visitorslogs' },
    { id: 2, label: 'Security Protocals', path: 'securityprotocols' },
  ]

  const handleDropdownToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? '' : dropdown)
  }

  // Update current path when location changes
  useEffect(() => {
    // Set initial path
    setCurrentPath(window.location.pathname)

    // Automatically open dropdown based on current path
    if (financialMenuItems.some(item => currentPath.includes(item.path))) {
      setOpenDropdown('Financial Management')
    } else if (complaintMenuItems.some(item => currentPath.includes(item.path))) {
      setOpenDropdown('Complaint Tracking')
    } else if (securityManagement.some(item => currentPath.includes(item.path))) {
      setOpenDropdown('Security Management')
    }
  }, [currentPath])

  // Helper function to check if a path is active
  const isPathActive = (path) => {
    return currentPath === `/admin/${path}` || currentPath.startsWith(`/admin/${path}/`)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-0 left-0 z-20 p-4"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <span className="text-2xl font-bold text-orange-500">☰</span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-[70%] md:w-[17%] bg-white border-r shadow-sm p-4 transition-transform duration-300 z-20 flex flex-col justify-between
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >

        <div>
          <h1 className="hidden text-2xl font-bold text-orange-500 cursor-pointer transition-colors hover:text-orange-600 lg:flex">
            Dash<span className="text-gray-800">Stack</span>
          </h1>

          <nav className="mt-8 space-y-2">
            {/* Dashboard */}
            <SidebarItem
              icon={Activity}
              label="Dashboard"
              path="dashboard"
              active={isPathActive('dashboard')}
              hovered={hoveredMenu === 'Dashboard'}
              onClick={(e) => {
                e.preventDefault()
                navigate('/admin/dashboard')
                setCurrentPath('/admin/dashboard')
                setIsSidebarOpen(false)
                setHoveredMenu(null)
              }}
              onMouseEnter={() => setHoveredMenu('Dashboard')}
              onMouseLeave={() => setHoveredMenu(null)}
            />


            {/* Resident Management */}
            <SidebarItem
              icon={Users}
              label="Resident Management"
              path="residence"
              active={isPathActive('residence')}
              hovered={hoveredMenu === 'Resident Management'}
              onClick={(e) => {
                e.preventDefault()
                navigate('/admin/residence')
                setCurrentPath('/admin/residence')
                setIsSidebarOpen(false)
                setHoveredMenu(null)
              }}
              onMouseEnter={() => setHoveredMenu('Resident Management')}
              onMouseLeave={() => setHoveredMenu(null)}
            />

            {/* Financial Management Dropdown */}
            <Dropdown
              label="Financial Management"
              icon={DollarSign}
              isOpen={openDropdown === 'Financial Management'}
              active={financialMenuItems.some(item => isPathActive(item.path))}
              hovered={hoveredMenu === 'Financial Management'}
              items={financialMenuItems}
              onClick={() => handleDropdownToggle('Financial Management')}
              onHoverEnter={() => setHoveredMenu('Financial Management')}
              onHoverLeave={() => setHoveredMenu(null)}
              currentPath={currentPath}
              setCurrentPath={setCurrentPath}
              setIsSidebarOpen={setIsSidebarOpen}
              setOpenDropdown={setOpenDropdown}
            />

            {/* Other menu items */}
            <SidebarItem
              icon={Package}
              label="Facility Management"
              path="Facilitymanagment"
              active={isPathActive('Facilitymanagment')}
              hovered={hoveredMenu === 'Facility Management'}
              onClick={(e) => {
                e.preventDefault()
                navigate('/admin/Facilitymanagment')
                setCurrentPath('/admin/Facilitymanagment')
                setIsSidebarOpen(false)
                setHoveredMenu(null)
              }}
              onMouseEnter={() => setHoveredMenu('Facility Management')}
              onMouseLeave={() => setHoveredMenu(null)}
            />

            {/* Complaint Tracking Dropdown */}
            <Dropdown
              label="Complaint Tracking"
              icon={Bell}
              isOpen={openDropdown === 'Complaint Tracking'}
              active={isPathActive('createcomplain') || isPathActive('requesttracking')}
              hovered={hoveredMenu === 'Complaint Tracking'}
              items={complaintMenuItems}
              onClick={() => handleDropdownToggle('Complaint Tracking')}
              onHoverEnter={() => setHoveredMenu('Complaint Tracking')}
              onHoverLeave={() => setHoveredMenu(null)}
              currentPath={currentPath}
              setCurrentPath={setCurrentPath}
              setIsSidebarOpen={setIsSidebarOpen}
              setOpenDropdown={setOpenDropdown}
            />

            {/* Security Management Dropdown */}
            <Dropdown
              label="Security Management"
              icon={Settings}
              isOpen={openDropdown === 'Security Management'}
              active={securityManagement.some(item => isPathActive(item.path))}
              hovered={hoveredMenu === 'Security Management'}
              items={securityManagement}
              onClick={() => handleDropdownToggle('Security Management')}
              onHoverEnter={() => setHoveredMenu('Security Management')}
              onHoverLeave={() => setHoveredMenu(null)}
              currentPath={currentPath}
              setCurrentPath={setCurrentPath}
              setIsSidebarOpen={setIsSidebarOpen}
              setOpenDropdown={setOpenDropdown}
            />

            <SidebarItem
              icon={Package}
              label="Security Guard"
              path="securityguard"
              active={isPathActive('securityguard')}
              hovered={hoveredMenu === 'Security Guard'}
              onClick={(e) => {
                e.preventDefault()
                navigate('/admin/securityguard')
                setCurrentPath('/admin/securityguard')
                setIsSidebarOpen(false)
                setHoveredMenu(null)
              }}
              onMouseEnter={() => setHoveredMenu('Facility Management')}
              onMouseLeave={() => setHoveredMenu(null)}
            />

            <SidebarItem
              icon={Bell}
              label="Announcement"
              path="announcment"
              active={isPathActive('announcment')}
              hovered={hoveredMenu === 'Announcement'}
              onClick={(e) => {
                e.preventDefault()
                navigate('/admin/announcment')
                setCurrentPath('/admin/announcment')
                setIsSidebarOpen(false)
                setHoveredMenu(null)
              }}
              onMouseEnter={() => setHoveredMenu('Announcement')}
              onMouseLeave={() => setHoveredMenu(null)}
            />

          </nav>

        </div>
        <SidebarItem
          icon={LogOut}
          className="mt-40"
          label="Logout"
          path="/"
          active={false}
          hovered={hoveredMenu === 'Logout'}
          onClick={(e) => {
            e.preventDefault()
            localStorage.clear()
            navigate('/')
            setCurrentPath('/')
            setIsSidebarOpen(false)
            setHoveredMenu(null)
          }}
          onMouseEnter={() => setHoveredMenu('Logout')}
          onMouseLeave={() => setHoveredMenu(null)}
        />
      </div>

      {/* Overlay for mobile menu */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-5 bg-black opacity-50 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </>
  )
}

function SidebarItem({ icon: Icon, label, path, active, hovered, onClick }) {
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
        onClick={onClick}
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

  const isDropdownActive = items.some(item => currentPath === `/admin/${item.path}`) || active

  return (
    <div className="my-1 relative">
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
              {currentPath === `/admin/${item.path}` && (
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-gradient-to-b from-[#FF4B1C] to-[#FF8037] rounded-r"
                  style={{ left: '-16px' }}
                />
              )}
              <a
                href={`/admin/${item.path}`}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(`/admin/${item.path}`)
                  setCurrentPath(`/admin/${item.path}`)
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-lg
                  ${currentPath === `/admin/${item.path}`
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
