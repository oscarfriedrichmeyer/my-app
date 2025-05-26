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
    if (!form.name || !form.age || !form.city || !form.confession) {
      setMessage('Please fill in all fields.');
      return;
    }
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

  const sortedConfessions = [...confessions].sort((a, b) => {
    if (filter === 'most-liked') {
      return (b.likes || 0) - (a.likes || 0);
    }
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <>
      <div className="relative min-h-screen flex flex-col items-center justify-start bg-[url('/grid-bg.png')] bg-repeat bg-[#f7f7f7] overflow-x-hidden">
        {/* Side navigation links with images - fixed at medium height, cutout style, underlined text */}
        <div className="fixed top-1/2 left-0 z-40 -translate-y-1/2 flex flex-col items-center space-y-4 md:space-y-8 pl-2">
          <div className="flex flex-col items-center">
            <img src="/cat-monitor.jpg" alt="Funny Jobs" className="w-36 h-36 md:w-44 md:h-44 object-contain mb-2 bg-transparent" style={{background: 'transparent', boxShadow: 'none', border: 'none'}} />
            <a href="https://sugar.health/jobs" target="_blank" rel="noopener noreferrer" className="font-mono text-black text-xl md:text-3xl tracking-wider mt-2" style={{textDecoration: 'underline', textUnderlineOffset: '6px', textDecorationThickness: '3px', letterSpacing: '0.08em'}}>JOBS AT SUGAR</a>
          </div>
        </div>
        <div className="fixed top-1/2 right-0 z-40 -translate-y-1/2 flex flex-col items-center space-y-4 md:space-y-8 pr-2">
          <div className="flex flex-col items-center">
            <img src="/double-head.jpg" alt="Funny About" className="w-36 h-36 md:w-44 md:h-44 object-contain mb-2 bg-transparent" style={{background: 'transparent', boxShadow: 'none', border: 'none'}} />
            <a href="https://sugar.health/about-us" target="_blank" rel="noopener noreferrer" className="font-mono text-black text-xl md:text-3xl tracking-wider mt-2" style={{textDecoration: 'underline', textUnderlineOffset: '6px', textDecorationThickness: '3px', letterSpacing: '0.08em'}}>WTF IS SUGAR</a>
          </div>
        </div>

        {/* Hero Section: Centered Logo with Glow */}
        <div className="absolute top-0 left-0 w-full flex flex-col items-center z-10 pt-0">
          <div className="relative flex flex-col items-center">
            {image && (
              <div className="mb-2 w-56 h-56 flex items-center justify-center z-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Upload Preview" className="rounded-2xl object-cover w-full h-full border-4 border-black bg-white" />
              </div>
            )}
            <Image src="/image-Photoroom.jpg" alt="Sugar Hero" width={220} height={220} className="rounded-2xl object-cover mb-4 shadow-xl border-4 border-white" />
            <div className="rounded-[40px] bg-gradient-to-br from-[#e9e6f7] to-[#f7e9e9] shadow-2xl flex items-center justify-center w-[340px] h-[340px] md:w-[420px] md:h-[420px] mx-auto" style={{boxShadow: '0 0 120px 60px #7b8cff44'}}>
              <Image src="/file.svg" alt="Sugar Logo" width={260} height={260} className="rounded-[32px] object-contain" />
              <span className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-xl text-4xl font-sans font-bold shadow-lg border-2 border-black rotate-[-6deg] z-20" style={{fontFamily: 'serif'}}>Sugar</span>
            </div>
          </div>
        </div>

        {/* Confession Card Section */}
        <div className="relative z-20 w-full max-w-2xl mx-auto mt-[120px] md:mt-[180px] mb-8 p-8 bg-white rounded-3xl shadow-2xl border-2 border-gray-200 backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-center mb-2 font-sans text-black">Sweet Confessions</h1>
          <p className="text-center text-gray-700 mb-6 font-mono">Share your fitness sins and guilty pleasures. No judgment, just joy!</p>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label htmlFor="confession" className="block text-black text-lg font-semibold mb-2 font-mono">Your Confession or Guilty Pleasure</label>
              <textarea id="confession" name="confession" value={form.confession} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-800 font-mono" placeholder="E.g. I eat chocolate after every workout..." rows={4} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-black font-semibold mb-1 font-mono">Name</label>
                <input type="text" id="name" name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-800 font-mono" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="age" className="block text-black font-semibold mb-1 font-mono">Age</label>
                <input type="number" id="age" name="age" value={form.age} onChange={handleChange} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-800 font-mono" placeholder="Your age" />
              </div>
              <div>
                <label htmlFor="city" className="block text-black font-semibold mb-1 font-mono">City</label>
                <input type="text" id="city" name="city" value={form.city} onChange={handleChange} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-800 font-mono" placeholder="Your city" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-black font-semibold mb-1 font-mono">Optional: Upload an image</label>
              <button type="button" onClick={() => inputImageRef.current && inputImageRef.current.click()} className="px-4 py-2 bg-black text-white font-mono rounded-lg shadow hover:bg-gray-900 transition">Bild hochladen</button>
              <input type="file" accept="image/*" ref={inputImageRef} onChange={handleImageChange} className="hidden" />
            </div>
            <button type="submit" className="w-full px-6 py-3 bg-black text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-gray-900 transition font-mono">Share My Confession 🍭</button>
            {message && <p className="mt-4 text-center text-green-600 text-lg font-semibold font-mono">{message}</p>}

            {/* Get Sugar for iOS Button - now below the confession button */}
            <div className="flex justify-center mt-6">
              <a
                href="https://apps.apple.com/de/app/sugar-do-stuff-together/id6468963352?l=en-GB"
                target="_blank"
                rel="noopener noreferrer"
                className="sugar-appstore-btn inline-flex items-center gap-3 text-lg px-8 py-4 font-mono"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.564 13.233c-.024-2.568 2.1-3.792 2.19-3.849-1.194-1.74-3.05-1.98-3.705-2.004-1.578-.162-3.084.927-3.885.927-.798 0-2.016-.903-3.318-.879-1.71.024-3.294.99-4.176 2.511-1.788 3.099-.456 7.687 1.278 10.207.846 1.215 1.854 2.577 3.174 2.527 1.278-.048 1.755-.819 3.294-.819 1.536 0 1.962.819 3.318.795 1.38-.024 2.244-1.239 3.084-2.454.978-1.416 1.38-2.793 1.404-2.862-.03-.012-2.682-1.029-2.706-4.003zm-3.09-7.29c.705-.855 1.185-2.049 1.053-3.243-1.02.042-2.25.678-2.985 1.533-.654.75-1.23 1.962-1.014 3.12 1.14.09 2.322-.582 2.946-1.41z"/></svg>
                <span>Get Sugar for iOS</span>
              </a>
            </div>
          </form>

          {/* Image Preview Section - moved below form, clickable */}
          {image && (
            <div className="flex justify-center mb-6">
              <a href={image} target="_blank" rel="noopener noreferrer" title="View full size">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Upload Preview"
                  className="rounded-2xl object-cover w-56 h-56 border-4 border-pink-400 bg-white shadow-lg transition-transform hover:scale-105 hover:border-pink-600 cursor-pointer"
                  style={{ maxHeight: '220px', maxWidth: '220px' }}
                />
              </a>
            </div>
          )}

          <div className="flex justify-center gap-4 mb-6">
            <button onClick={() => setFilter('newest')} className={`px-5 py-2 rounded-full text-lg font-semibold shadow font-mono border-2 border-black ${filter === 'newest' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'}`}>Newest</button>
            <button onClick={() => setFilter('most-liked')} className={`px-5 py-2 rounded-full text-lg font-semibold shadow font-mono border-2 border-black ${filter === 'most-liked' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'}`}>Most Liked</button>
          </div>
          <h2 className="text-2xl font-bold text-black mb-4 text-center font-sans">Recent Confessions</h2>
          {loading ? <p className="text-center text-blue-400 text-lg font-mono">Loading the sweetness...</p> : null}
          {sortedConfessions.length === 0 && !loading && <p className="text-blue-400 text-center font-mono">No confessions yet. Be the first to sweeten the feed!</p>}
          <ul className="space-y-6 max-h-96 overflow-y-auto">
            {sortedConfessions.map((c, idx) => (
              <li key={c.id || idx} className="bg-white p-5 rounded-2xl shadow-xl border-2 border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-black font-mono">{c.name || 'Anonymous'}, {c.age}, {c.city}</span>
                  <span className="text-xs text-gray-400 font-mono">{c.date ? new Date(c.date).toLocaleDateString() : ''}</span>
                </div>
                <p className="text-gray-800 text-lg mb-2 italic font-mono">“{c.confession}”</p>
                <button onClick={() => handleLike(c.id)} disabled={likedIds.includes(c.id)} className={`text-blue-500 hover:text-blue-700 font-bold text-xl flex items-center gap-1 font-mono ${likedIds.includes(c.id) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <span role="img" aria-label="like">❤️</span> 0
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
