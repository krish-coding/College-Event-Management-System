import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, ArrowRight, Loader2 } from 'lucide-react';

const fallbackEvents = [
  { _id: '1', title: 'TechNova Hackathon 2026', date: '2026-10-15T18:00:00.000Z', time: '18:00', location: 'Main Computer Lab', category: 'Technical', price: 'Free', status: 'Published', description: 'Testing the backend connection', organizer: 'Computer Science Department', totalCapacity: 250, spotsFilled: 184 },
  { _id: '2', title: 'Rhythm & Beats: Cultural Night', date: '2026-11-02T18:00:00.000Z', time: '19:00', location: 'University Auditorium', category: 'Cultural', price: 'Student ID', status: 'Published', description: 'Annual cultural fest with exciting performances.', organizer: 'Cultural Committee', totalCapacity: 500, spotsFilled: 420 },
  { _id: '3', title: 'RoboWars Championship', date: '2026-12-10T10:00:00.000Z', time: '10:00', location: 'Engineering Block Plaza', category: 'Technical', price: '?10 Entry', status: 'Published', description: 'Battle of the bots. Join us for the ultimate showdown.', organizer: 'Robotics Club', totalCapacity: 100, spotsFilled: 45 },
];

export default function HomePage({ navigateTo, setSelectedEvent }) {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/events`)
      .then(res => { if (!res.ok) throw new Error('Network error'); return res.json(); })
      .then(data => {
        if (data.success) setFeaturedEvents(data.data.filter(e => e.status === 'Published').slice(0, 3));
        else setFeaturedEvents(fallbackEvents.slice(0, 3));
      })
      .catch(() => { console.warn('Backend not reachable. Using fallback data.'); setFeaturedEvents(fallbackEvents.slice(0, 3)); })
      .finally(() => setIsLoading(false));
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatPrice = (price) => {
    if (!price) return 'Free';
    return price.replace(/\$(\d+(\.\d+)?)/g, '₹$1');
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Experience the Best <span className="text-indigo-600">College Fests</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              From epic cultural nights and intense hackathons to club workshops. Your one-stop platform to register for campus events and manage student activities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={() => navigateTo('Events')} className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center group">
                Explore Fests <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigateTo('Register')} className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-100 rounded-xl font-semibold text-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center">
                Register Your Club
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-48 -right-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Campus Events</h2>
              <p className="text-gray-600">Get your squad ready for these highlights.</p>
            </div>
            <button onClick={() => navigateTo('Events')} className="hidden sm:flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20"><Loader2 className="h-10 w-10 text-indigo-600 animate-spin" /></div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map(event => (
                <div key={event._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
                  onClick={() => { setSelectedEvent(event); navigateTo('Event Details'); }}>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img src={event.image || `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&sig=${event._id}`} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">{formatPrice(event.price)}</div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">{event.title}</h3>
                    <div className="space-y-2 text-gray-600 text-sm mb-6 flex-grow">
                      <div className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />{formatDate(event.date)}</div>
                      <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" /><span className="truncate">{event.location}</span></div>
                    </div>
                    <button className="w-full py-2.5 bg-gray-50 text-indigo-600 font-semibold rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-gray-100 group-hover:border-transparent mt-auto">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-200 border-dashed"><p className="text-gray-500">No events found in the database.</p></div>
          )}
        </div>
      </section>
    </div>
  );
}



