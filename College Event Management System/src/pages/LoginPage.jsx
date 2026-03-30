import React, { useState } from 'react';
import { CalendarDays, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage({ navigateTo, setUser }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') })
      });
      const result = await res.json();
      if (res.ok) {
        setUser(result.data);
        localStorage.setItem('user', JSON.stringify(result.data));
        navigateTo('Dashboard');
      } else alert(result.message || 'Login failed');
    } catch (err) { alert('Network error connecting to backend.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><div className="p-3 bg-indigo-100 rounded-2xl"><CalendarDays className="h-10 w-10 text-indigo-600" /></div></div>
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Please sign in to your CampusFest account</p>
        </div>

        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-gray-100 rounded-3xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                <input type="email" name="email" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors sm:text-sm" placeholder="you@university.edu" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                <input type="password" name="password" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors sm:text-sm" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isSubmitting ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Signing in...</> : 'Sign in'}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">Don't have an account?{' '}
              <button onClick={() => navigateTo('Register')} className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">Sign up now</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


