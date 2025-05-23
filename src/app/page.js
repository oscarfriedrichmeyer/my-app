"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [confessions, setConfessions] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', city: '', confession: '' });
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfessions();
  }, []);

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
    const res = await fetch('/api/confession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage('Thank you for your confession!');
      setForm({ name: '', age: '', city: '', confession: '' });
      fetchConfessions();
    } else {
      setMessage('Failed to submit confession.');
    }
  };

  const handleLike = async (id) => {
    await fetch(`/api/confession?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ like: true }),
    });
    fetchConfessions();
  };

  const sortedConfessions = [...confessions].sort((a, b) => {
    if (filter === 'most-liked') {
      return (b.likes || 0) - (a.likes || 0);
    }
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <>
      <header className="bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 text-white text-center py-8 shadow-lg">
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg mb-2 font-sans">Sugar Confessions</h1>
        <p className="text-xl font-medium italic drop-shadow-sm mb-1">“Sweeten your soul, lighten your load.”</p>
        <p className="text-lg font-light">Share your fitness cravings, guilty pleasures, and wellness wins. No judgment, just joy!</p>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-pink-50 to-red-100">
        <section className="text-center py-10">
          <h2 className="text-4xl font-bold text-pink-600 mb-2 font-sans">Confess, Connect, Celebrate!</h2>
          <p className="text-gray-700 mt-2 text-lg max-w-xl mx-auto">Welcome to the most uplifting corner of the internet. Here, your fitness secrets and sweet temptations are celebrated. Let’s make wellness fun, honest, and a little bit cheeky—just like sugar!</p>
        </section>
        <form onSubmit={handleSubmit} className="bg-white/90 p-10 rounded-3xl shadow-2xl w-full max-w-lg mb-12 border-2 border-pink-200">
          <div className="mb-6">
            <label htmlFor="confession" className="block text-pink-700 text-lg font-semibold mb-2">Your Sweetest Confession</label>
            <textarea id="confession" name="confession" value={form.confession} onChange={handleChange} className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50 text-gray-800" placeholder="E.g. I eat chocolate after every workout..." rows={4} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-pink-700 font-semibold mb-1">Name</label>
              <input type="text" id="name" name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50 text-gray-800" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="age" className="block text-pink-700 font-semibold mb-1">Age</label>
              <input type="number" id="age" name="age" value={form.age} onChange={handleChange} className="w-full px-3 py-2 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50 text-gray-800" placeholder="Your age" />
            </div>
            <div>
              <label htmlFor="city" className="block text-pink-700 font-semibold mb-1">City</label>
              <input type="text" id="city" name="city" value={form.city} onChange={handleChange} className="w-full px-3 py-2 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50 text-gray-800" placeholder="Your city" />
            </div>
          </div>
          <button type="submit" className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 text-white text-xl font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform">Share My Confession 🍭</button>
          {message && <p className="mt-6 text-center text-green-600 text-lg font-semibold">{message}</p>}
        </form>
        <section className="w-full max-w-2xl">
          <div className="flex justify-center gap-4 mb-8">
            <button onClick={() => setFilter('newest')} className={`px-5 py-2 rounded-full text-lg font-semibold shadow ${filter === 'newest' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}>Newest</button>
            <button onClick={() => setFilter('most-liked')} className={`px-5 py-2 rounded-full text-lg font-semibold shadow ${filter === 'most-liked' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}>Most Liked</button>
          </div>
          <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center font-sans">🍬 Recent Sugar Confessions 🍬</h2>
          {loading ? <p className="text-center text-pink-400 text-lg">Loading the sweetness...</p> : null}
          {sortedConfessions.length === 0 && !loading && <p className="text-pink-400 text-center">No confessions yet. Be the first to sweeten the feed!</p>}
          <ul className="space-y-8">
            {sortedConfessions.map((c, idx) => (
              <li key={c.id || idx} className="bg-white/80 p-7 rounded-2xl shadow-xl border-2 border-pink-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-pink-600">{c.name || 'Anonymous'}, {c.age}, {c.city}</span>
                  <span className="text-xs text-pink-400">{c.date}</span>
                </div>
                <p className="text-gray-800 text-lg mb-3 italic">“{c.confession}”</p>
                <button onClick={() => handleLike(c.id)} className="text-pink-500 hover:text-pink-700 font-bold text-xl flex items-center gap-1">
                  <span role="img" aria-label="like">❤️</span> {c.likes || 0}
                </button>
              </li>
            ))}
          </ul>
        </section>
        <footer className="text-center py-8 mt-16 border-t-2 border-pink-200 w-full bg-gradient-to-r from-yellow-100 via-pink-100 to-red-100">
          <p className="text-pink-600 text-lg font-semibold">&copy; 2025 Sugar Confessions. Powered by sweet honesty and healthy fun.</p>
          <p className="text-pink-400 mt-2 italic">“Confess, connect, and celebrate your sweet side!”</p>
        </footer>
      </main>
    </>
  );
}
