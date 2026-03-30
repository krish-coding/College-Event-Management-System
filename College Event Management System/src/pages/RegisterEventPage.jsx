import React, { useState } from 'react';
import { CalendarDays, MapPin, Ticket, Users, Info, Image as ImageIcon, DollarSign } from 'lucide-react';

export default function RegisterEventPage({ navigateTo, user }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageBase64, setImageBase64] = useState('');

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
      description: formData.get('description'),
      image: imageBase64 || formData.get('imageUrl') || '',
      createdBy: user ? user._id : null
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newEvent),
      });
      const result = await response.json();
      if (response.ok) { alert('✅ Event successfully saved!'); e.target.reset(); navigateTo('My Events'); }
      else alert('❌ Failed to save event: ' + result.message);
    } catch (error) {
      alert('❌ Could not connect to the backend server.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Create a New Event</h1>
          <p className="text-lg text-gray-600">Fill out the details below to publish your campus fest, workshop, or club activity.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section 1: Basic Info */}
          <div className="p-6 sm:p-10 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><Info className="h-5 w-5 mr-2 text-indigo-600" /> Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input name="title" type="text" required placeholder="e.g., Annual Tech Symposium 2026" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select name="category" required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 focus:bg-white appearance-none">
                    <option value="">Select a category</option>
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Business">Business / Entrepreneurship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizing Club/Department *</label>
                  <input name="organizer" type="text" required placeholder="e.g., Computer Science Society" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 focus:bg-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Date & Location */}
          <div className="p-6 sm:p-10 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><CalendarDays className="h-5 w-5 mr-2 text-indigo-600" /> Date & Location</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input name="date" type="date" required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input name="time" type="time" required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location / Venue *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-400" /></div>
                  <input name="location" type="text" required placeholder="e.g., Main Auditorium, North Campus" className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Capacity */}
          <div className="p-6 sm:p-10 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><Ticket className="h-5 w-5 mr-2 text-indigo-600" /> Ticketing & Capacity</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Spots / Capacity *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Users className="h-5 w-5 text-gray-400" /></div>
                  <input name="totalCapacity" type="number" min="1" required placeholder="e.g., 200" className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 focus:bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign className="h-5 w-5 text-gray-400" /></div>
                  <input name="price" type="text" placeholder="Leave blank if Free" className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 focus:bg-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Media & Description */}
          <div className="p-6 sm:p-10 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><ImageIcon className="h-5 w-5 mr-2 text-indigo-600" /> Media & Description</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                <div className="flex flex-col space-y-3 mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><ImageIcon className="h-5 w-5 text-gray-400" /></div>
                    <input name="imageUrl" type="url" placeholder="Image URL (e.g. https://example.com/image.jpg)" className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 font-medium">OR upload from device:</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Description *</label>
                <textarea name="description" required rows="5" placeholder="Describe what your event is about..." className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white resize-y"></textarea>
              </div>
            </div>
          </div>

          <div className="p-6 sm:px-10 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end space-x-4">
            <button type="button" onClick={() => navigateTo('Dashboard')} className="px-6 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className={`px-8 py-3 font-bold text-white rounded-xl shadow-sm transition-all flex items-center ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isSubmitting ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


