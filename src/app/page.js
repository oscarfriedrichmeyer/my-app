"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [confessions, setConfessions] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', city: '', confession: '' });
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('likedConfessions') || '[]');
    }
    return [];
  });
  const [image, setImage] = useState(null);
  const inputImageRef = useRef(null);

  // Admin state
  const [admin, setAdmin] = useState(false);
  const [adminLogin, setAdminLogin] = useState({ user: '', pass: '' });

  useEffect(() => {
    fetchConfessions();
  }, []);

  useEffect(() => {
    localStorage.setItem('likedConfessions', JSON.stringify(likedIds));
  }, [likedIds]);

  const fetchConfessions = async () => {
    setLoading(true);
    const res = await fetch('/api/confession');
    const data = await res.json();
    setConfessions(data.confessions || []);
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.confession) {
      setMessage('Please fill in your confession.');
      return;
    }
    // Prepare submission object
    const submission = { ...form };
    if (image) submission.image = image;
    const res = await fetch('/api/confession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
    if (res.ok) {
      setMessage('Thank you for your confession!');
      setForm({ name: '', age: '', city: '', confession: '' });
      setImage(null);
      fetchConfessions();
    } else {
      setMessage('Failed to submit confession.');
    }
  };

  const handleLike = async (id) => {
    if (likedIds.includes(id)) return;
    await fetch(`/api/confession?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ like: true }),
    });
    setLikedIds([...likedIds, id]);
    fetchConfessions();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target && event.target.result ? event.target.result : null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Admin login handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminLogin.user === 'Oscar' && adminLogin.pass === 'Admin123') {
      setAdmin(true);
      setAdminLogin({ user: '', pass: '' });
    } else {
      setAdmin(false);
      setAdminLogin({ user: '', pass: '' });
    }
  };

  // Admin delete handler
  const handleDelete = async (id) => {
    if (!admin) return;
    await fetch(`/api/confession?id=${id}`, {
      method: 'DELETE',
    });
    fetchConfessions();
  };

  let sortedConfessions = [...confessions];
  if (filter === 'most-liked') {
    sortedConfessions.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (filter === 'hot') {
    // Reddit-style hot algorithm: score = likes / (hours since post + 2)^1.5
    sortedConfessions.sort((a, b) => {
      const now = Date.now();
      const score = (c) => {
        const likes = c.likes || 0;
        const hours = Math.max((now - new Date(c.date).getTime()) / 36e5, 0.01);
        return likes / Math.pow(hours + 2, 1.5);
      };
      return score(b) - score(a);
    });
  } else {
    sortedConfessions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return (
    <>
      <div className="relative min-h-screen flex flex-col items-center justify-start bg-[url('/grid-bg.png')] bg-repeat bg-[#f7f7fa] overflow-x-hidden">
        {/* Side navigation links with images - remove border/shadow/bg from images */}
        <div className="fixed top-1/2 left-0 z-40 -translate-y-1/2 flex flex-col items-center space-y-4 md:space-y-8 pl-2 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center">
            <img src="/cat-monitor.jpg" alt="Funny Jobs" className="w-28 h-28 md:w-36 md:h-36 object-contain mb-2" />
            <a href="https://sugar.health/jobs" target="_blank" rel="noopener noreferrer" className="font-mono text-black text-lg md:text-2xl tracking-wider mt-2 underline underline-offset-4">JOBS AT SUGAR</a>
          </div>
        </div>
        <div className="fixed top-1/2 right-0 z-40 -translate-y-1/2 flex flex-col items-center space-y-4 md:space-y-8 pr-2 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center">
            <img src="/double-head.jpg" alt="Funny About" className="w-28 h-28 md:w-36 md:h-36 object-contain mb-2" />
            <a href="https://sugar.health/about-us" target="_blank" rel="noopener noreferrer" className="font-mono text-black text-lg md:text-2xl tracking-wider mt-2 underline underline-offset-4">WTF IS SUGAR</a>
          </div>
        </div>

        {/* Hero Section: Centered Logo with Glow, more whitespace */}
        <div className="absolute top-0 left-0 w-full flex flex-col items-center z-10 pt-0">
          <div className="relative flex flex-col items-center">
            <Image src="/image-Photoroom.jpg" alt="Sugar Hero" width={180} height={180} className="rounded-2xl object-cover mb-4 shadow-lg border-2 border-white/80" />
            {/* Removed the 'Sugar' label overlay */}
          </div>
        </div>

        {/* Confession Card Section - lighter, more open */}
        <div className="relative z-20 w-full max-w-2xl mx-auto mt-[120px] md:mt-[160px] mb-8 p-6 bg-white/80 rounded-3xl shadow-lg border border-gray-100 backdrop-blur-sm">
          <h1 className="text-3xl font-extrabold text-center mb-2 font-sans text-black">Sweet Confessions</h1>
          <p className="text-center text-gray-600 mb-6 font-mono text-base">
            Share your fitness sins and guilty pleasures. We don't judge - okay mayble a little bit<br />
            <span className="block mt-2 text-pink-600 font-bold">The 15 most-liked submissions win a 50€ Sugar event voucher!</span>
          </p>
          <form onSubmit={handleSubmit} className="mb-6 space-y-4">
            {/* Get Sugar for iOS Button - above confession entry field, black button */}
            <div className="flex justify-center">
              <a
                href="https://apps.apple.com/de/app/sugar-do-stuff-together/id6468963352?l=en-GB"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-base px-6 py-3 font-mono bg-black text-white rounded-full shadow hover:bg-gray-900 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.564 13.233c-.024-2.568 2.1-3.792 2.19-3.849-1.194-1.74-3.05-1.98-3.705-2.004-1.578-.162-3.084.927-3.885.927-.798 0-2.016-.903-3.318-.879-1.71.024-3.294.99-4.176 2.511-1.788 3.099-.456 7.687 1.278 10.207.846 1.215 1.854 2.577 3.174 2.527 1.278-.048 1.755-.819 3.294-.819 1.536 0 1.962.819 3.318.795 1.38-.024 2.244-1.239 3.084-2.454.978-1.416 1.38-2.793 1.404-2.862-.03-.012-2.682-1.029-2.706-4.003zm-3.09-7.29c.705-.855 1.185-2.049 1.053-3.243-1.02.042-2.25.678-2.985 1.533-.654.75-1.23 1.962-1.014 3.12 1.14.09 2.322-.582 2.946-1.41z"/></svg>
                <span>Get Sugar for iOS</span>
              </a>
            </div>
            {/* Confession entry field */}
            <div>
              <label htmlFor="confession" className="block text-black text-base font-semibold mb-1 font-mono">Your Confession or Guilty Pleasure</label>
              <textarea id="confession" name="confession" value={form.confession} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white/60 text-gray-800 font-mono" placeholder="E.g. I eat chocolate after every workout..." rows={3} />
            </div>
            {/* Image upload option below confession field */}
            <div className="flex flex-col items-center mb-2">
              <label htmlFor="image-upload" className="block text-gray-700 font-mono text-sm mb-1">Optional: Add an image</label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={inputImageRef}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
            {/* Login with Sugar Button and hint - outlined black button */}
            <div className="flex flex-col items-center gap-2">
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2 border-2 border-black text-black font-bold font-mono text-base rounded-full shadow-none bg-transparent hover:bg-black hover:text-white transition"
              >
                <span role="img" aria-label="candy">🍬</span>
                <span>Login with Sugar</span>
              </a>
              <p className="text-center text-gray-600 font-mono text-sm max-w-xs">
                <span className="font-bold text-pink-600">You need to login with Sugar to participate in the competition.</span>
              </p>
            </div>
            {/* Name, Age, City for anonymous confessions only */}
            <div className="mt-2 mb-2">
              <p className="text-center text-gray-500 font-mono text-xs mb-2">If you want to confess <span className="font-bold">without logging in with Sugar</span>, enter your name, age, and city below. Otherwise, your submission will link to your profile</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="name" className="block text-black font-semibold mb-1 font-mono text-sm">Name</label>
                  <input type="text" id="name" name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white/60 text-gray-800 font-mono text-sm" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="age" className="block text-black font-semibold mb-1 font-mono text-sm">Age</label>
                  <input type="number" id="age" name="age" value={form.age} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white/60 text-gray-800 font-mono text-sm" placeholder="Your age" />
                </div>
                <div>
                  <label htmlFor="city" className="block text-black font-semibold mb-1 font-mono text-sm">City</label>
                  <input type="text" id="city" name="city" value={form.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white/60 text-gray-800 font-mono text-sm" placeholder="Your city" />
                </div>
              </div>
            </div>
            <button type="submit" className="w-full px-6 py-3 bg-black text-white text-lg font-bold rounded-full shadow-none hover:bg-gray-900 transition font-mono mt-2">Share My Confession 🍭</button>
            {message && <p className="mt-4 text-center text-green-600 text-base font-semibold font-mono">{message}</p>}
          </form>

          {/* Image Preview Section - below form, clickable, lighter border */}
          {image && (
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <a href={image} target="_blank" rel="noopener noreferrer" title="View full size">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Upload Preview"
                    className="rounded-2xl object-cover w-44 h-44 md:w-56 md:h-56 border-2 border-pink-200 bg-white/70 shadow transition-transform duration-200 group-hover:scale-105 group-hover:border-pink-400 cursor-pointer"
                    style={{ maxHeight: '224px', maxWidth: '224px', aspectRatio: '1/1', objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                    <span className="text-white font-mono text-sm">Click to view full size</span>
                  </div>
                </a>
              </div>
              <button
                type="button"
                className="mt-2 text-xs text-gray-500 underline hover:text-pink-500 font-mono"
                onClick={() => { setImage(null); if(inputImageRef.current) inputImageRef.current.value = ''; }}
              >Remove image</button>
            </div>
          )}

          {/* Filters - more minimal, pill buttons, black/outline style */}
          <div className="flex justify-center gap-3 mb-6">
            <button onClick={() => setFilter('newest')} className={`px-4 py-2 rounded-full text-base font-semibold font-mono border-2 ${filter === 'newest' ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black hover:bg-black hover:text-white'}`}>Newest</button>
            <button onClick={() => setFilter('hot')} className={`px-4 py-2 rounded-full text-base font-semibold font-mono border-2 ${filter === 'hot' ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black hover:bg-black hover:text-white'}`}>Hot</button>
            <button onClick={() => setFilter('most-liked')} className={`px-4 py-2 rounded-full text-base font-semibold font-mono border-2 ${filter === 'most-liked' ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black hover:bg-black hover:text-white'}`}>Top</button>
          </div>
          <h2 className="text-xl font-bold text-black mb-4 text-center font-sans">Recent Confessions</h2>
          {loading ? <p className="text-center text-blue-400 text-base font-mono">Loading the sweetness...</p> : null}
          {sortedConfessions.length === 0 && !loading && <p className="text-blue-400 text-center font-mono">No confessions yet. Be the first to sweeten the feed!</p>}
          <ul className="space-y-5 max-h-96 overflow-y-auto">
            {sortedConfessions.map((c, idx) => (
              <li key={c.id || idx} className="bg-white/70 p-4 rounded-2xl shadow border border-gray-100 relative">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-black font-mono text-sm">{c.name || 'Anonymous'}{c.age ? `, ${c.age}` : ''}{c.city ? `, ${c.city}` : ''}</span>
                  <span className="text-xs text-gray-400 font-mono">{c.date ? new Date(c.date).toLocaleDateString() : ''}</span>
                </div>
                {c.image && (
                  <div className="flex justify-center mb-2">
                    <a href={c.image} target="_blank" rel="noopener noreferrer" title="View full size">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.image}
                        alt="Confession Upload"
                        className="rounded-xl object-cover w-72 h-72 md:w-96 md:h-96 border-2 border-pink-200 bg-white/70 shadow hover:scale-105 hover:border-pink-400 cursor-pointer transition-transform"
                        style={{ maxHeight: '384px', maxWidth: '384px', aspectRatio: '1/1', objectFit: 'cover' }}
                      />
                    </a>
                  </div>
                )}
                <p className="text-gray-800 text-base mb-2 italic font-mono">“{c.confession}”</p>
                <button onClick={() => handleLike(c.id)} disabled={likedIds.includes(c.id)} className={`text-pink-500 hover:text-pink-700 font-bold text-lg flex items-center gap-1 font-mono ${likedIds.includes(c.id) ? 'opacity-50 cursor-not-allowed' : ''}`}>❤️ {c.likes || 0}</button>
                {admin && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-700 font-mono bg-white/80 rounded px-2 py-0.5 border border-red-100 shadow-sm"
                    title="Delete confession"
                  >Delete</button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Subtle admin login form (bottom right, tiny, only if not logged in as admin) */}
        {!admin && (
          <form onSubmit={handleAdminLogin} className="fixed bottom-2 right-2 z-50 flex flex-col items-end opacity-30 hover:opacity-100 transition-opacity">
            <input
              type="text"
              placeholder="user"
              value={adminLogin.user}
              onChange={e => setAdminLogin({ ...adminLogin, user: e.target.value })}
              className="w-16 text-xs px-1 py-0.5 rounded border border-gray-200 mb-0.5 bg-white/80 font-mono"
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="pass"
              value={adminLogin.pass}
              onChange={e => setAdminLogin({ ...adminLogin, pass: e.target.value })}
              className="w-16 text-xs px-1 py-0.5 rounded border border-gray-200 mb-0.5 bg-white/80 font-mono"
              autoComplete="off"
            />
            <button type="submit" className="text-[10px] px-2 py-0.5 rounded bg-gray-200 text-gray-600 font-mono">login</button>
          </form>
        )}
      </div>
    </>
  );
}
