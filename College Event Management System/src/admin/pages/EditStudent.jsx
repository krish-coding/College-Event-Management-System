import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function EditStudent({ navigateTo, editId }) {
  const [studentData, setStudentData] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users');
        const result = await res.json();
        if (result.success) { const st = result.data.find(u => u._id === editId); if (st) setStudentData(st); }
      } catch (err) { console.error('Error fetching student'); }
    };
    if (editId) fetchStudent();
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const updated = { name: formData.get('name'), email: formData.get('email'), gr: formData.get('gr'), enroll: formData.get('enroll') };
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
      if (res.ok) { alert('✅ Student Record Updated!'); navigateTo('Manage Students'); }
      else alert('❌ Failed to update student.');
    } catch (err) { alert('Network error'); }
    finally { setIsSubmitting(false); }
  };

  if (!studentData) return <div className="p-8 text-center text-gray-500"><Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600 mb-4" /> Loading student details...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Edit Student Record</h3>
          <p className="text-sm text-gray-500 mt-1">Update information for {studentData.name}.</p>
        </div>
        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100 flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Active Student</span>
      </div>
      <form className="p-6 sm:p-8 space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" type="text" required defaultValue={studentData.name} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University Email</label>
            <input name="email" type="email" required defaultValue={studentData.email} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GR No.</label>
            <input name="gr" type="text" required defaultValue={studentData.gr} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment No.</label>
            <input name="enroll" type="text" required defaultValue={studentData.enroll} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white font-mono" />
          </div>
        </div>
        <div className="flex justify-end pt-6 border-t border-gray-100 space-x-4">
          <button type="button" onClick={() => navigateTo('Manage Students')} className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting} className={`px-8 py-3 text-white font-bold rounded-xl shadow-sm transition-colors ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  );
}
