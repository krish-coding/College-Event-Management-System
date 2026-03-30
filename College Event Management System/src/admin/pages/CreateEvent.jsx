import React from 'react';

export default function CreateEvent({ navigateTo }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imageBase64, setImageBase64] = React.useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const newEvent = {
      title: formData.get('title'),
      category: formData.get('category'),
      totalCapacity: Number(formData.get('totalCapacity')),
      organizer: formData.get('organizer'),
      date: formData.get('date'),
      time: formData.get('time'),
      location: formData.get('location'),
      status: formData.get('status') === 'Published (Active)' ? 'Published' : formData.get('status') === 'Draft (Hidden)' ? 'Draft' : 'Closed',
      description: formData.get('description'),
      image: imageBase64 || formData.get('imageUrl') || '',
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newEvent),
      });
      const result = await response.json();
      if (response.ok) { alert('✅ Event successfully saved to the database!'); e.target.reset(); navigateTo('Manage Events'); }
      else alert('❌ Failed to save event: ' + result.message);
    } catch (error) { alert('❌ Could not connect to the backend server.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-500">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Add New Event to Catalog</h3>
        <p className="text-sm text-gray-500 mt-1">Events created here are saved to MongoDB and published to the student portal.</p>
      </div>
      <form className="p-6 sm:p-8 space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input name="title" type="text" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Campus Rock Night" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="Cultural">Cultural</option>
                  <option value="Technical">Technical</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Business">Business</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Capacity</label>
                <input name="totalCapacity" type="number" defaultValue="100" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organizing Department / Club</label>
              <input name="organizer" type="text" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Student Council" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input name="date" type="date" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input name="time" type="time" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location / Venue</label>
              <input name="location" type="text" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Main Auditorium" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Published (Active)</option>
                <option>Draft (Hidden)</option>
                <option>Closed (No more registrations)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
              <div className="flex flex-col space-y-3">
                <input name="imageUrl" type="url" placeholder="Image URL (e.g. https://...)" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 font-medium">OR upload from device:</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" required rows="4" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Write event details here..."></textarea>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button type="submit" disabled={isSubmitting} className={`px-8 py-3 text-white font-bold rounded-xl shadow-sm transition-colors ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {isSubmitting ? 'Saving...' : 'Publish Event'}
          </button>
        </div>
      </form>
    </div>
  );
}


