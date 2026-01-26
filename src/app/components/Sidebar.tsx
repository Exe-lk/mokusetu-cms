'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/src/store/hooks';
import { logout } from '@/src/store/slices/authSlice';
import Image from 'next/image';
import { 
  MdDashboard, 
  MdPages, 
  MdArticle, 
  MdBusinessCenter, 
  MdPeople, 
  MdSettings,
  MdDarkMode,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md';
import Swal from 'sweetalert2';
import { useSidebar } from './SidebarContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <MdDashboard /> },
  { name: 'Home', href: '/home', icon: <MdPages /> },
  { name: 'About Us', href: '/about', icon: <MdPages /> },
  { name: 'Services', href: '/services', icon: <MdBusinessCenter /> },
  { name: 'Blogs', href: '/blog', icon: <MdArticle /> }

];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isCollapsed, toggleCollapse } = useSidebar();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of the system.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        router.replace('/');
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1e293b] text-white rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64'} bg-[#1e293b] text-white flex flex-col
        `}
      >
        <div className={`p-6 border-b border-gray-700 ${isCollapsed ? 'px-3' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <Image 
              src="/assests/LogoonWhite.png" 
              alt="logo" 
              width={isCollapsed ? 32 : 40} 
              height={isCollapsed ? 32 : 40} 
            />
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg">MokuSetu</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex absolute -right-3 top-20 bg-[#1e293b] border-2 border-gray-600 text-white rounded-full p-1.5 hover:bg-gray-700 transition-colors z-50"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <MdChevronRight className="w-4 h-4" /> : <MdChevronLeft className="w-4 h-4" />}
        </button>

        <nav className="flex-1 p-4">
          <ul className={`space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                              (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              
              return (
                <li key={item.href} className={isCollapsed ? 'w-full' : ''}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} 
                      ${isCollapsed ? 'px-3' : 'px-4'} py-3 rounded-lg transition-all relative group
                      ${isActive 
                        ? 'bg-red-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <span className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                        {item.name}
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-gray-900 border-b-4 border-b-transparent"></span>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={`p-4 border-t border-gray-700 ${isCollapsed ? 'px-2' : ''}`}>
          <button 
            onClick={handleLogout} 
            className={`w-full bg-red-600 text-white py-2 rounded-lg ${isCollapsed ? 'px-2' : ''} relative group`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            {isCollapsed ? (
              <>
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  Logout
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-gray-900 border-b-4 border-b-transparent"></span>
                </span>
              </>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

