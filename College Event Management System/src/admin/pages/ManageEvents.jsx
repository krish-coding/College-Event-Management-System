import React from 'react';
import { Search, Edit, Trash2, Loader2 } from 'lucide-react';

export default function ManageEvents({ navigateTo }) {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);
      const result = await res.json();
      if (result.success) setEvents(result.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  React.useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) fetchEvents();
      else alert('Failed to delete event.');
    } catch (err) { alert('Network error.'); }
  };

  if (loading) return <div className="text-center py-20"><Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" /></div>;

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">Event Catalog</h3>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Event ID</th>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Registrations</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredEvents.map((event) => (
              <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-gray-500 text-xs">{event._id.slice(-6).toUpperCase()}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{event.title}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-gray-600">{event.category}</td>
                <td className="px-6 py-4 font-medium text-indigo-600">{event.spotsFilled || 0} / {event.totalCapacity}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${event.status === 'Published' || event.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {event.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => navigateTo('Edit Event', event._id)} className="text-gray-400 hover:text-indigo-600 p-1 mx-1 transition-colors"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(event._id)} className="text-gray-400 hover:text-red-600 p-1 mx-1 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No events found in the database.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}


