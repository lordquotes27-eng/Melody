import React, { useState } from 'react';

interface AuthPageProps {
  onAuthSuccess: (username: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/login' : '/register';
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const res = await fetch(`http://localhost:5000/api/users${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      if (isLogin) {
        localStorage.setItem('spotify_token', data.token);
        localStorage.setItem('spotify_user', data.username);
        onAuthSuccess(data.username);
      } else {
        alert('Account created! Please log in.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-zinc-900 p-8 rounded-lg w-full max-w-md shadow-2xl border border-zinc-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Log in to Spotify' : 'Sign up for Spotify'}</h2>
          <p className="text-zinc-400">{isLogin ? 'Enjoy your favorite music' : 'Start your musical journey'}</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="What should we call you?"
              className="bg-zinc-800 p-3 rounded border border-zinc-700 focus:border-green-500 outline-none transition"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            className="bg-zinc-800 p-3 rounded border border-zinc-700 focus:border-green-500 outline-none transition"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-zinc-800 p-3 rounded border border-zinc-700 focus:border-green-500 outline-none transition"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button className="bg-green-500 text-black font-bold p-3 rounded-full hover:scale-105 transition-transform mt-4">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-zinc-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white underline hover:text-green-500 transition"
          >
            {isLogin ? 'Sign up for free' : 'Log in here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
