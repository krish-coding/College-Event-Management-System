import React, { useState } from 'react';
import { CalendarDays, MapPin, ArrowLeft, Heart, Share2, Info, ArrowRight, CheckCircle2, User, Loader2 } from 'lucide-react';

export default function EventDetailsPage({ navigateTo, event, user }) {
  const [isRegistering, setIsRegistering] = useState(false);

  if (!event) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <CalendarDays className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Event Selected</h2>
        <p className="text-gray-500 mb-6">Please go back to the catalog and select an event.</p>
        <button onClick={() => navigateTo('Events')} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">Back to Events Catalog</button>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const spotsLeft = event.totalCapacity - (event.spotsFilled || 0);
  const fillPercentage = ((event.spotsFilled || 0) / event.totalCapacity) * 100;
  const fallbackImage = `https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200&sig=${event._id}`;
  const formatPrice = (price) => {
    if (!price) return 'Free';
    return price.replace(/\$(\d+(\.\d+)?)/g, '₹$1');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 animate-in fade-in duration-500">
      <div className="relative w-full h-80 md:h-96 bg-gray-900">
        <img src={event.image || fallbackImage} alt={event.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        <div className="absolute top-6 left-4 sm:left-6 lg:left-8">
          <button onClick={() => navigateTo('Events')} className="flex items-center text-white bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg transition-colors font-medium text-sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-8">
            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{event.category}</span>
                <span className="flex items-center text-sm font-medium text-gray-500"><User className="h-4 w-4 mr-1" /> By {event.organizer}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">{event.title}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600 mt-1"><CalendarDays className="h-6 w-6" /></div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date & Time</p>
                    <p className="text-gray-900 font-semibold">{formattedDate}</p>
                    <p className="text-gray-600 text-sm">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600 mt-1"><MapPin className="h-6 w-6" /></div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Location</p>
                    <p className="text-gray-900 font-semibold">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">About this Event</h2>
              <p className="whitespace-pre-line leading-relaxed text-gray-600 mb-8">{event.description}</p>
              {event.highlights && (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Event Highlights</h3>
                  <ul className="space-y-3">
                    {event.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start"><CheckCircle2 className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" /><span>{highlight}</span></li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Price</p>
                  <p className="text-3xl font-extrabold text-gray-900">{formatPrice(event.price)}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2.5 rounded-full bg-gray-50 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors border border-gray-200"><Heart className="h-5 w-5" /></button>
                  <button className="p-2.5 rounded-full bg-gray-50 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-gray-200"><Share2 className="h-5 w-5" /></button>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-gray-900">{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Sold out!'}</span>
                  <span className="text-gray-500">{event.totalCapacity} total</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${fillPercentage}%` }}></div>
                </div>
              </div>

              <button
                disabled={spotsLeft <= 0 || isRegistering}
                className={`w-full text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg mb-4 flex justify-center items-center ${(spotsLeft <= 0 || isRegistering) ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                onClick={async () => {
                  if (!user) { alert('Please log in to register for events.'); navigateTo('Login'); return; }
                  setIsRegistering(true);
                  try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations`, {
                      method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: user._id, eventId: event._id })
                    });
                    const result = await res.json();
                    if (res.ok) { alert('Successfully registered!'); navigateTo('My Events'); }
                    else alert(result.message || 'Registration failed');
                  } catch (err) { alert('Network error.'); }
                  finally { setIsRegistering(false); }
                }}
              >
                {isRegistering ? 'Registering...' : (spotsLeft <= 0 ? 'Event is Full' : 'Register Now')} <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <p className="text-center text-sm text-gray-500 flex items-center justify-center"><Info className="h-4 w-4 mr-1" /> Subject to organizer approval.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



