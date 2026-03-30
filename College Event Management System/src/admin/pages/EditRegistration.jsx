import React from 'react';
import { Loader2 } from 'lucide-react';

export default function EditRegistration({ navigateTo, editId }) {
  const [regData, setRegData] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchReg = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/registrations');
        const result = await res.json();
        if (result.success) { const reg = result.data.find(r => r._id === editId); if (reg) setRegData(reg); }
      } catch (err) { console.error('Error fetching registration'); }
    };
    if (editId) fetchReg();
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    try {
      const res = await fetch(`http://localhost:5000/api/registrations/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: formData.get('status') }) });
      if (res.ok) { alert('✅ Registration Updated!'); navigateTo('View Registrations'); }
      else alert('❌ Failed to update registration.');
    } catch (err) { alert('Network error'); }
    finally { setIsSubmitting(false); }
  };

  if (!regData) return <div className="p-8 text-center text-gray-500"><Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600 mb-4" /> Loading registration details...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Edit Registration</h3>
          <p className="text-sm text-gray-500 mt-1">Manage ticket details and status.</p>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-mono border border-gray-200">{regData.ticketId}</span>
      </div>
      <form className="p-6 sm:p-8 space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
            <input type="text" disabled defaultValue={regData.user?.name} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-100 text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GR No.</label>
            <input type="text" disabled defaultValue={regData.user?.gr} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-100 text-gray-500 cursor-not-allowed font-mono" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
          <input type="text" disabled defaultValue={regData.event?.title} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-100 text-gray-500 cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Status</label>
          <select name="status" defaultValue={regData.status} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white">
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex justify-end pt-6 border-t border-gray-100 space-x-4">
          <button type="button" onClick={() => navigateTo('View Registrations')} className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting} className={`px-8 py-3 text-white font-bold rounded-xl shadow-sm transition-colors ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {isSubmitting ? 'Saving...' : 'Update Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}
