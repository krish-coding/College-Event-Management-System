import React, { useState } from 'react';
import {
  LayoutDashboard, CalendarPlus, CalendarDays, ClipboardList,
  Users, LogOut, Menu, ShieldCheck, Mail, Lock
} from 'lucide-react';

// Admin page imports
import AdminDashboard from './admin/pages/AdminDashboard';
import CreateEvent from './admin/pages/CreateEvent';
import ManageEvents from './admin/pages/ManageEvents';
import ViewRegistrations from './admin/pages/ViewRegistrations';
import ManageStudents from './admin/pages/ManageStudents';
import EditEvent from './admin/pages/EditEvent';
import EditStudent from './admin/pages/EditStudent';
import EditRegistration from './admin/pages/EditRegistration';

const PROJECT_NAME = 'CampusFest Admin';

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${active ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
      <span className="mr-3">{React.cloneElement(icon, { className: 'h-5 w-5' })}</span>
      {label}
    </button>
  );
}

function AdminLogin({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 sm:p-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-50 rounded-2xl"><ShieldCheck className="h-12 w-12 text-indigo-600" /></div>
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">Admin Portal</h2>
          <p className="text-center text-gray-500 mb-8">Sign in to manage CampusFest operations</p>
          <form onSubmit={onLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                <input type="email" name="email" required defaultValue="admin@marwadiuniversity.ac.in" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                <input type="password" name="password" required defaultValue="Admin123" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
              </div>
            </div>
            <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all">Secure Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminApp({ initialUser = null, onLogoutCallback = null }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialUser);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') })
      });
      const data = await res.json();
      if (res.ok && data.data?.role === 'admin') setIsAuthenticated(true);
      else alert('Invalid admin credentials or unauthorized.');
    } catch (err) { alert('Network error connecting to backend.'); }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('Dashboard');
    if (onLogoutCallback) onLogoutCallback();
  };

  const navigateTo = (page, id = null) => {
    setCurrentPage(page);
    setEditId(id);
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  if (!isAuthenticated) return <AdminLogin onLogin={handleLogin} />;

  const navItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard' },
    { icon: <CalendarPlus />, label: 'Create Event' },
    { icon: <CalendarDays />, label: 'Manage Events' },
    { icon: <ClipboardList />, label: 'View Registrations' },
    { icon: <Users />, label: 'Manage Students' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-20 border-b border-gray-800">
          <ShieldCheck className="h-8 w-8 text-indigo-500 mr-2" />
          <span className="text-xl font-bold tracking-wide">{PROJECT_NAME}</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(({ icon, label }) => (
            <NavItem key={label} icon={icon} label={label} active={currentPage === label} onClick={() => navigateTo(label)} />
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">AD</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">admin@marwadiuniversity.ac.in</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-400/10 transition-colors">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-10">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 mr-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{currentPage}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Reserved for future header items */}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {currentPage === 'Dashboard' && <AdminDashboard navigateTo={navigateTo} />}
          {currentPage === 'Create Event' && <CreateEvent navigateTo={navigateTo} />}
          {currentPage === 'Manage Events' && <ManageEvents navigateTo={navigateTo} />}
          {currentPage === 'View Registrations' && <ViewRegistrations navigateTo={navigateTo} />}
          {currentPage === 'Manage Students' && <ManageStudents navigateTo={navigateTo} />}
          {currentPage === 'Edit Event' && <EditEvent navigateTo={navigateTo} editId={editId} />}
          {currentPage === 'Edit Student' && <EditStudent navigateTo={navigateTo} editId={editId} />}
          {currentPage === 'Edit Registration' && <EditRegistration navigateTo={navigateTo} editId={editId} />}
        </main>
      </div>
    </div>
  );
}