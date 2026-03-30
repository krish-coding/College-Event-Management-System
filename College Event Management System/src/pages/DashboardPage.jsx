import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Clock, Ticket, Activity, PlusCircle, Settings, Bell, Loader2 } from 'lucide-react';

export default function DashboardPage({ navigateTo, user }) {
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [hostingEvents, setHostingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigateTo('Login'); return; }
    const fetchData = async () => {
      try {
        const [regRes, eventRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/registrations?userId=${user._id}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/events`)
        ]);
        const regData = await regRes.json();
        const eventData = await eventRes.json();
        if (regData.success) setAttendingEvents(regData.data.map(r => r.event).filter(Boolean));
        if (eventData.success) setHostingEvents(eventData.data.filter(e => e.createdBy === user._id));
      } catch (err) { console.error('Dashboard fetch error:', err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user, navigateTo]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  const userStats = { attending: attendingEvents.length, hosting: hostingEvents.length, upcomingThisWeek: attendingEvents.length > 0 ? 1 : 0 };
  const upcomingSchedule = [
    ...attendingEvents.map(e => ({ id: e._id || Math.random(), title: e.title, rawDate: new Date(e.date), date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), time: e.time, location: e.location, type: 'Attending' })),
    ...hostingEvents.map(e => ({ id: e._id || Math.random(), title: e.title, rawDate: new Date(e.date), date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), time: e.time, location: e.location, type: 'Hosting' }))
  ].sort((a, b) => a.rawDate - b.rawDate).slice(0, 3);

  const notifications = [{ id: 1, text: `Welcome to CampusFest, ${user.name.split(' ')[0]}!`, time: 'Just now', unread: true }];

  return (
    <div className="bg-gray-50 min-h-screen py-10 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user ? user.name.split(' ')[0] : 'Guest'}! 👋</h1>
            <p className="text-gray-600 mt-1">Here is what's happening with your campus events.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => navigateTo('Register Event')} className="flex items-center px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"><PlusCircle className="h-5 w-5 mr-2" /> Create Event</button>
            <button onClick={() => navigateTo('Events')} className="flex items-center px-4 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">Browse Fests</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Registered Events', value: userStats.attending, icon: <Ticket className="h-8 w-8" />, bg: 'bg-blue-50 text-blue-600' },
            { label: 'Upcoming This Week', value: userStats.upcomingThisWeek, icon: <CalendarDays className="h-8 w-8" />, bg: 'bg-indigo-50 text-indigo-600' },
            { label: 'Events Hosting', value: userStats.hosting, icon: <Activity className="h-8 w-8" />, bg: 'bg-purple-50 text-purple-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>{stat.icon}</div>
              <div><p className="text-sm font-medium text-gray-500">{stat.label}</p><p className="text-2xl font-bold text-gray-900">{stat.value}</p></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Upcoming Schedule</h2>
              <button onClick={() => navigateTo('My Events')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View full calendar</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {upcomingSchedule.length > 0 ? upcomingSchedule.map((item) => (
                  <li key={item.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-indigo-50 rounded-xl text-indigo-700 flex-shrink-0">
                          <span className="text-xs font-semibold uppercase">{item.date.split(' ')[0]}</span>
                          <span className="text-xl font-bold leading-none">{item.date.split(' ')[1]}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {item.time}</span>
                            <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {item.location}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`hidden sm:block px-3 py-1 text-xs font-medium rounded-full ${item.type === 'Hosting' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{item.type}</span>
                    </div>
                  </li>
                )) : <li className="p-8 text-center text-gray-500">No upcoming events. <button onClick={() => navigateTo('Events')} className="text-indigo-600 font-medium">Browse events</button></li>}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><Bell className="h-5 w-5 mr-2 text-gray-500" /> Notifications</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
                <ul className="divide-y divide-gray-50">
                  {notifications.map((notif) => (
                    <li key={notif.id} className="p-4 flex items-start space-x-3">
                      <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${notif.unread ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                      <div>
                        <p className={`text-sm ${notif.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{notif.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><Settings className="h-5 w-5 mr-2 text-gray-500" /> Quick Links</h2>
              <button onClick={() => navigateTo('My Events')} className="w-full p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col items-center space-y-2 group">
                <div className="p-2 bg-gray-50 rounded-full group-hover:bg-indigo-50 transition-colors"><Ticket className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" /></div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">My Tickets</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


