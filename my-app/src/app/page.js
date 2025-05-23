"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to My App</h1>
        <p className="text-gray-600 mt-4">This is a simple React frontend built with Next.js and Tailwind CSS.</p>
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setShowLogin(!showLogin)}
        >
          {showLogin ? "Close Login/Register" : "Login/Register"}
        </button>
      </header>
      {showLogin && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-semibold text-gray-700">Login</h2>
          <form onSubmit={handleLogin} className="mt-4">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <h2 className="text-2xl font-semibold text-gray-700 mt-6">Register</h2>
          <form onSubmit={handleRegister} className="mt-4">
            <div className="mb-4">
              <label htmlFor="register-email" className="block text-gray-600 mb-2">Email</label>
              <input
                type="email"
                id="register-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="register-password" className="block text-gray-600 mb-2">Password</label>
              <input
                type="password"
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Register
            </button>
          </form>
          {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
        </div>
      )}
      <section className="flex flex-wrap justify-center gap-6 mt-10">
        <div className="p-6 bg-white rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-semibold text-gray-700">Feature 1</h2>
          <p className="text-gray-500 mt-2">Description of the first feature of the app.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-semibold text-gray-700">Feature 2</h2>
          <p className="text-gray-500 mt-2">Description of the second feature of the app.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-semibold text-gray-700">Feature 3</h2>
          <p className="text-gray-500 mt-2">Description of the third feature of the app.</p>
        </div>
      </section>
      <footer className="text-center py-6 mt-10 border-t w-full">
        <p className="text-gray-500">&copy; 2025 My App. All rights reserved.</p>
      </footer>
    </main>
  );
}
