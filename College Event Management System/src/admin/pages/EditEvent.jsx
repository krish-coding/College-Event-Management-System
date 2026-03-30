import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function EditEvent({ navigateTo, editId }) {
  const [eventData, setEventData] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);
        const result = await res.json();
        if (result.success) { const ev = result.data.find(e => e._id === editId); if (ev) setEventData(ev); }
      } catch (err) { console.error('Error fetching event'); }
    };
    if (editId) fetchEvent();
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const updated = {
      title: formData.get('title'), category: formData.get('category'),
      totalCapacity: Number(formData.get('totalCapacity')), organizer: formData.get('organizer'),
      date: formData.get('date'), time: formData.get('time'),
      location: formData.get('location'), status: formData.get('status'),
      description: formData.get('description')
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
      if (res.ok) { alert('✅ Event Updated Successfully!'); navigateTo('Manage Events'); }
      else alert('❌ Failed to update event.');
    } catch (err) { alert('Network error'); }
    finally { setIsSubmitting(false); }
  };

  if (!eventData) return <div className="p-8 text-center text-gray-500"><Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600 mb-4" /> Loading event details...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-500">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Edit Event: {eventData.title}</h3>
          <p className="text-sm text-gray-500 mt-1">Make changes to the existing event data.</p>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-mono border border-gray-200">ID: {editId.slice(-6).toUpperCase()}</span>
      </div>
      <form className="p-6 sm:p-8 space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input name="title" type="text" required defaultValue={eventData.title} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" defaultValue={eventData.category} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="Cultural">Cultural</option>
                  <option value="Technical">Technical</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Business">Business</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Capacity</label>
                <input name="totalCapacity" type="number" defaultValue={eventData.totalCapacity} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organizing Department / Club</label>
              <input name="organizer" type="text" required defaultValue={eventData.organizer} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input name="date" type="date" required defaultValue={eventData.date?.split('T')[0]} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input name="time" type="time" required defaultValue={eventData.time} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location / Venue</label>
              <input name="location" type="text" required defaultValue={eventData.location} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" defaultValue={eventData.status} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Published">Published (Active)</option>
                <option value="Draft">Draft (Hidden)</option>
                <option value="Closed">Closed (No more registrations)</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows="4" defaultValue={eventData.description} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100 space-x-4">
          <button type="button" onClick={() => navigateTo('Manage Events')} className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting} className={`px-8 py-3 text-white font-bold rounded-xl shadow-sm transition-colors ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}


