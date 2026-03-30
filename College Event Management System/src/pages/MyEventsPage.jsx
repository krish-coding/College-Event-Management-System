import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Ticket, Activity, QrCode, Edit3, Users, Loader2 } from 'lucide-react';

export default function MyEventsPage({ navigateTo, user }) {
  const [activeTab, setActiveTab] = useState('attending');
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [hostingEvents, setHostingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigateTo('Login'); return; }
    const fetchMyEvents = async () => {
      try {
        const [regRes, eventRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/registrations?userId=${user._id}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/events`)
        ]);
        const regData = await regRes.json();
        const eventData = await eventRes.json();
        if (regData.success) {
          setAttendingEvents(regData.data.filter(r => r.event).map(r => ({
            id: r.event._id, title: r.event.title,
            date: new Date(r.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: r.event.time, location: r.event.location,
            image: r.event.image || `https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800&sig=${r.event._id}`,
            ticketId: r.ticketId
          })));
        }
        if (eventData.success) {
          setHostingEvents(eventData.data.filter(e => e.createdBy === user._id).map(e => ({
            id: e._id, title: e.title,
            date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: e.status || 'Published', spotsFilled: e.spotsFilled || 0, spotsTotal: e.totalCapacity,
            image: e.image || `https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800&sig=${e._id}`
          })));
        }
      } catch (err) { console.error('Error fetching my events', err); }
      finally { setLoading(false); }
    };
    fetchMyEvents();
  }, [user, navigateTo]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">My Events</h1>
          <p className="text-lg text-gray-600">Manage your event tickets and track the fests you are organizing.</p>
        </div>

        <div className="flex space-x-1 border-b border-gray-200 mb-8">
          {[['attending', <Ticket className="h-4 w-4 mr-2" />, `Attending (${attendingEvents.length})`], ['hosting', <Activity className="h-4 w-4 mr-2" />, `Hosting (${hostingEvents.length})`]].map(([tab, icon, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 font-medium text-sm flex items-center border-b-2 transition-colors ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              {icon}{label}
            </button>
          ))}
        </div>

        {activeTab === 'attending' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attendingEvents.length > 0 ? attendingEvents.map(event => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="relative h-40 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">Ticket ID</p>
                    <p className="font-mono text-lg font-semibold">{event.ticketId}</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{event.title}</h3>
                  <div className="space-y-3 text-gray-600 text-sm mb-6 flex-grow">
                    <div className="flex items-center"><CalendarDays className="h-4 w-4 mr-3 text-indigo-500" /><span className="font-medium">{event.date} at {event.time}</span></div>
                    <div className="flex items-start"><MapPin className="h-4 w-4 mr-3 text-indigo-500 mt-0.5" /><span>{event.location}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button onClick={() => navigateTo('Event Details')} className="py-2.5 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 text-sm">Event Details</button>
                    <button className="py-2.5 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100 flex items-center justify-center text-sm" onClick={() => alert(`Showing QR Code for ticket: ${event.ticketId}`)}>
                      <QrCode className="h-4 w-4 mr-1.5" /> View Pass
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
                <Ticket className="mx-auto h-12 w-12 text-gray-300 mb-4" /><h3 className="text-lg font-medium text-gray-900">No upcoming events</h3>
                <p className="mt-1 text-gray-500">You haven't registered for any fests yet.</p>
                <button onClick={() => navigateTo('Events')} className="mt-6 text-indigo-600 font-medium hover:text-indigo-700">Browse Events</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hosting' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hostingEvents.length > 0 ? hostingEvents.map(event => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="relative h-32 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide shadow-sm">{event.status}</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-6 flex items-center"><CalendarDays className="h-4 w-4 mr-2" /> {event.date}</p>
                  <div className="mb-6 flex-grow">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-gray-700">Registrations</span>
                      <span className="text-indigo-600">{event.spotsFilled} / {event.spotsTotal}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(event.spotsFilled / event.spotsTotal) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button className="py-2 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 text-sm flex items-center justify-center"><Users className="h-4 w-4 mr-1.5" /> Attendees</button>
                    <button className="py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-200 text-sm flex items-center justify-center"><Edit3 className="h-4 w-4 mr-1.5" /> Manage</button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
                <Activity className="mx-auto h-12 w-12 text-gray-300 mb-4" /><h3 className="text-lg font-medium text-gray-900">Not hosting anything</h3>
                <p className="mt-1 text-gray-500">You aren't organizing any events right now.</p>
                <button onClick={() => navigateTo('Register Event')} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Create an Event</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


