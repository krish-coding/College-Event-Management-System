import React from 'react';
import { CalendarDays, ClipboardList, Users, Clock, Loader2 } from 'lucide-react';

export default function AdminDashboard({ navigateTo }) {
  const [dashboardData, setDashboardData] = React.useState({ totalEvents: 0, totalRegistrations: 0, registeredStudents: 0, recentRegs: [] });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, regRes, userRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/events`),
          fetch(`${import.meta.env.VITE_API_URL}/api/registrations`),
          fetch(`${import.meta.env.VITE_API_URL}/api/users`)
        ]);
        const events = await eventRes.json();
        const regs = await regRes.json();
        const users = await userRes.json();
        setDashboardData({
          totalEvents: events.success ? events.data.length : 0,
          totalRegistrations: regs.success ? regs.data.length : 0,
          registeredStudents: users.success ? users.data.length : 0,
          recentRegs: regs.success ? regs.data.slice(-5).reverse() : []
        });
      } catch (err) { console.error('Failed to load dashboard', err); }
    };
    fetchData();
  }, []);

  const stats = [
    { title: 'Total Events', value: dashboardData.totalEvents.toString(), icon: <CalendarDays className="h-6 w-6 text-blue-600" />, bg: 'bg-blue-50', link: 'Manage Events' },
    { title: 'Total Registrations', value: dashboardData.totalRegistrations.toString(), icon: <ClipboardList className="h-6 w-6 text-indigo-600" />, bg: 'bg-indigo-50', link: 'View Registrations' },
    { title: 'Registered Students', value: dashboardData.registeredStudents.toString(), icon: <Users className="h-6 w-6 text-purple-600" />, bg: 'bg-purple-50', link: 'Manage Students' },
    { title: 'Pending Approvals', value: '0', icon: <Clock className="h-6 w-6 text-orange-600" />, bg: 'bg-orange-50', link: 'Manage Events' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo(stat.link)}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>{stat.icon}</div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Recent Registrations</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {dashboardData.recentRegs.map((reg, index) => (
            <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase">
                  {reg.user?.name ? reg.user.name.charAt(0) : 'U'}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-bold text-gray-900">{reg.user?.name || 'Unknown User'}</p>
                  <p className="text-xs text-gray-500">Registered for {reg.event?.title || 'Unknown Event'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">{new Date(reg.createdAt).toLocaleDateString()}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Confirmed</span>
              </div>
            </div>
          ))}
          {dashboardData.recentRegs.length === 0 && <div className="px-6 py-8 text-center text-gray-500 text-sm">No recent registrations.</div>}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 text-center">
          <button onClick={() => navigateTo('View Registrations')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all registrations</button>
        </div>
      </div>
    </div>
  );
}


