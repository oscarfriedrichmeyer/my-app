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
        {/* Hero Section: Centered Logo with Glow */}
        <div className="absolute top-0 left-0 w-full flex flex-col items-center z-10 pt-16">
          <div className="relative flex flex-col items-center">
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
          <p className="text-center text-gray-700 mb-6 font-mono">Share your fitness confessions and guilty pleasures. No judgment, just joy!</p>
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
              {image && (
                <div className="mt-2 w-32 h-32 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Upload Preview" className="rounded-xl object-contain w-full h-full border-2 border-black" />
                </div>
              )}
            </div>
            <button type="submit" className="w-full px-6 py-3 bg-black text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-gray-900 transition font-mono">Share My Confession 🍭</button>
            {message && <p className="mt-4 text-center text-green-600 text-lg font-semibold font-mono">{message}</p>}
          </form>
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
                  <span className="text-xs text-gray-400 font-mono">{c.date}</span>
                </div>
                <p className="text-gray-800 text-lg mb-2 italic font-mono">“{c.confession}”</p>
                <button onClick={() => handleLike(c.id)} disabled={likedIds.includes(c.id)} className={`text-blue-500 hover:text-blue-700 font-bold text-xl flex items-center gap-1 font-mono ${likedIds.includes(c.id) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <span role="img" aria-label="like">❤️</span> {c.likes || 0}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
