import React from 'react';
import { Search, Edit, Trash2, Loader2 } from 'lucide-react';

export default function ViewRegistrations({ navigateTo }) {
  const [regs, setRegs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchRegs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/registrations');
      const result = await res.json();
      if (result.success) setRegs(result.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  React.useEffect(() => { fetchRegs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/registrations/${id}`, { method: 'DELETE' });
      if (res.ok) fetchRegs();
      else alert('Failed to delete registration.');
    } catch (err) { alert('Network error.'); }
  };

  if (loading) return <div className="text-center py-20"><Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" /></div>;

  const filteredRegs = regs.filter(reg =>
    reg.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">All Registrations</h3>
        <div className="flex space-x-2 w-full sm:w-auto items-center">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search registrations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
          </div>
          <select className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"><option>All Events</option></select>
          <button className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors">Export CSV</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Ticket ID</th>
              <th className="px-6 py-4 font-medium">Student Name</th>
              <th className="px-6 py-4 font-medium">GR No.</th>
              <th className="px-6 py-4 font-medium">Event Registered</th>
              <th className="px-6 py-4 font-medium">Reg. Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredRegs.map((reg) => (
              <tr key={reg._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-gray-500 text-xs">{reg.ticketId}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{reg.user?.name || 'Unknown'}</td>
                <td className="px-6 py-4 text-gray-600">{reg.user?.gr || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">{reg.event?.title || 'Unknown Event'}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(reg.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${reg.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{reg.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => navigateTo('Edit Registration', reg._id)} className="text-gray-400 hover:text-indigo-600 p-1 mx-1 transition-colors"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(reg._id)} className="text-gray-400 hover:text-red-600 p-1 mx-1 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {regs.length === 0 && <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No registrations found in the database.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
