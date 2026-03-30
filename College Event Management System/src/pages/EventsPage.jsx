import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Search, Filter, Loader2 } from 'lucide-react';

const fallbackEvents = [
  { _id: '1', title: 'TechNova Hackathon 2026', date: '2026-10-15T18:00:00.000Z', time: '18:00', location: 'Main Computer Lab', category: 'Technical', price: 'Free', status: 'Published', description: 'Testing the backend connection', organizer: 'Computer Science Department', totalCapacity: 250, spotsFilled: 184 },
  { _id: '2', title: 'Rhythm & Beats: Cultural Night', date: '2026-11-02T18:00:00.000Z', time: '19:00', location: 'University Auditorium', category: 'Cultural', price: 'Student ID', status: 'Published', description: 'Annual cultural fest with exciting performances.', organizer: 'Cultural Committee', totalCapacity: 500, spotsFilled: 420 },
  { _id: '3', title: 'RoboWars Championship', date: '2026-12-10T10:00:00.000Z', time: '10:00', location: 'Engineering Block Plaza', category: 'Technical', price: '₹10 Entry', status: 'Published', description: 'Battle of the bots.', organizer: 'Robotics Club', totalCapacity: 100, spotsFilled: 45 },
  { _id: '4', title: 'Photography Workshop', date: '2026-10-20T14:00:00.000Z', time: '14:00', location: 'Art Studio Room 302', category: 'Workshop', price: 'Free', status: 'Published', description: 'Learn photography basics.', organizer: 'Photography Club', totalCapacity: 30, spotsFilled: 20 },
];

export default function EventsPage({ navigateTo, setSelectedEvent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Business'];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/events`)
      .then(res => { if (!res.ok) throw new Error('Network error'); return res.json(); })
      .then(data => {
        if (data.success) setAllEvents(data.data.filter(e => e.status === 'Published'));
        else setAllEvents(fallbackEvents);
      })
      .catch(() => { console.warn('Backend not reachable. Using fallback data.'); setAllEvents(fallbackEvents); })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatPrice = (price) => {
    if (!price) return 'Free';
    return price.replace(/\$(\d+(\.\d+)?)/g, '₹$1');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Browse Campus Events</h1>
          <p className="text-lg text-gray-600 max-w-2xl">Find your next favorite club meeting, workshop, or major college fest event.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
            <input type="text" placeholder="Search events or locations..." className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter className="h-5 w-5 text-gray-400 hidden sm:block mr-2" />
            {categories.map(category => (
              <button key={category} onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20"><Loader2 className="h-10 w-10 text-indigo-600 animate-spin" /></div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <div key={event._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
                onClick={() => { setSelectedEvent(event); navigateTo('Event Details'); }}>
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img src={event.image || `https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800&sig=${event._id}`} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">{formatPrice(event.price)}</div>
                  <div className="absolute top-4 left-4 bg-indigo-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm uppercase tracking-wide">{event.category}</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">{event.title}</h3>
                  <div className="space-y-2 text-gray-600 text-sm mb-6 flex-grow">
                    <div className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />{formatDate(event.date)}</div>
                    <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" /><span className="truncate">{event.location}</span></div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); navigateTo('Event Details'); }}
                    className="w-full py-2.5 bg-gray-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-600 hover:text-white transition-colors border border-gray-100 hover:border-transparent mt-auto">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
            <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter.</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="mt-6 text-indigo-600 font-medium hover:text-indigo-700">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}



