import React from 'react';
import { Search, Edit, Trash2, Loader2 } from 'lucide-react';

export default function ManageStudents({ navigateTo }) {
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
        const result = await res.json();
        if (result.success) setStudents(result.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStudents();
  }, []);

  if (loading) return <div className="text-center py-20"><Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" /></div>;

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.gr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.enroll?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">Student Directory</h3>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by GR No. or Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Student Name</th>
              <th className="px-6 py-4 font-medium">University Email</th>
              <th className="px-6 py-4 font-medium">GR No.</th>
              <th className="px-6 py-4 font-medium">Enrollment No.</th>
              <th className="px-6 py-4 font-medium">Events Attended</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStudents.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{student.name}</td>
                <td className="px-6 py-4 text-gray-500">{student.email}</td>
                <td className="px-6 py-4 text-gray-900 font-mono">{student.gr || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-600 font-mono">{student.enroll || 'N/A'}</td>
                <td className="px-6 py-4 font-medium text-indigo-600">-</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => navigateTo('Edit Student', student._id)} className="text-gray-400 hover:text-indigo-600 p-1 mx-1 transition-colors"><Edit className="h-4 w-4" /></button>
                  <button onClick={async () => {
                    if (!window.confirm('Delete this student?')) return;
                    try {
                      await fetch(`${import.meta.env.VITE_API_URL}/api/users/${student._id}`, { method: 'DELETE' });
                      setStudents(students.filter(s => s._id !== student._id));
                    } catch (e) {}
                  }} className="text-gray-400 hover:text-red-600 p-1 mx-1 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No students registered yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}


