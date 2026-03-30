import React, { useState } from 'react';
import { CalendarDays, Menu, X } from 'lucide-react';

import AdminApp from './AdminApp';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import DashboardPage from './pages/DashboardPage';
import MyEventsPage from './pages/MyEventsPage';
import RegisterEventPage from './pages/RegisterEventPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Redirect admin users to the admin portal
  if (user && user.role === 'admin') {
    return <AdminApp initialUser={user} onLogoutCallback={() => { localStorage.removeItem('user'); setUser(null); }} />;
  }

  const navLinks = [
    { label: 'Home', page: 'Home' },
    { label: 'Events', page: 'Events' },
    { label: 'Dashboard', page: 'Dashboard' },
    { label: 'My Events', page: 'My Events' },
    { label: 'Register Event', page: 'Register Event' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 cursor-pointer flex-shrink-0" onClick={() => navigateTo('Home')}>
              <CalendarDays className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">CampusFest</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4 overflow-x-auto">
              {navLinks.map(({ label, page }) => (
                <button key={page} onClick={() => navigateTo(page)}
                  className={`font-medium transition-colors whitespace-nowrap ${currentPage === page ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>
                  {label}
                </button>
              ))}
              <div className="flex items-center space-x-2 border-l border-gray-200 pl-4 ml-2">
                {user ? (
                  <>
                    <span className="font-medium text-gray-700 mx-2">Hi, {user.name.split(' ')[0]}</span>
                    <button onClick={() => { localStorage.removeItem('user'); setUser(null); navigateTo('Home'); }} className="font-medium text-gray-600 hover:text-red-600 transition-colors whitespace-nowrap">Log out</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigateTo('Login')} className="font-medium text-gray-600 hover:text-indigo-600 transition-colors whitespace-nowrap">Log in</button>
                    <button onClick={() => navigateTo('Register')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap">Sign up</button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-gray-900">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg absolute w-full">
            {navLinks.map(({ label, page }) => (
              <button key={page} onClick={() => navigateTo(page)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">{label}</button>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2">
              {user ? (
                <button onClick={() => { localStorage.removeItem('user'); setUser(null); navigateTo('Home'); }} className="block w-full text-left px-3 py-2 mt-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Log out</button>
              ) : (
                <>
                  <button onClick={() => navigateTo('Login')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Log in</button>
                  <button onClick={() => navigateTo('Register')} className="block w-full text-left px-3 py-2 mt-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700">Sign up</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Page Routing */}
      <main className="flex-grow">
        {currentPage === 'Home' && <HomePage navigateTo={navigateTo} setSelectedEvent={setSelectedEvent} />}
        {currentPage === 'Events' && <EventsPage navigateTo={navigateTo} setSelectedEvent={setSelectedEvent} />}
        {currentPage === 'Event Details' && <EventDetailsPage navigateTo={navigateTo} event={selectedEvent} user={user} />}
        {currentPage === 'Login' && <LoginPage navigateTo={navigateTo} setUser={setUser} />}
        {currentPage === 'Register' && <RegisterPage navigateTo={navigateTo} setUser={setUser} />}
        {currentPage === 'Dashboard' && <DashboardPage navigateTo={navigateTo} user={user} />}
        {currentPage === 'My Events' && <MyEventsPage navigateTo={navigateTo} user={user} />}
        {currentPage === 'Register Event' && <RegisterEventPage navigateTo={navigateTo} user={user} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4"><CalendarDays className="h-6 w-6 text-indigo-400" /><span className="font-bold text-xl text-white">CampusFest</span></div>
            <p className="text-gray-400 text-sm">Your ultimate platform to discover, manage, and host amazing college fests, club workshops, and campus events.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigateTo('Home')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => navigateTo('Events')} className="hover:text-white transition-colors">Browse Campus Events</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <p className="text-sm text-gray-400 mb-2">studentcouncil@university.edu</p>
            <p className="text-sm text-gray-400">Student Activity Center</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} CampusFest. All rights reserved.
        </div>
      </footer>
    </div>
  );
}