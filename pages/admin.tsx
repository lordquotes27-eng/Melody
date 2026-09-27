import React, { useState } from 'react';

export default function AdminDashboard() {
  const [songData, setSongData] = useState({
    title: '',
    artist: '',
    album: '',
    url: '',
    cover: '',
    genre: ''
  });
  const [status, setStatus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSongData({ ...songData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Uploading...');
    try {
      const res = await fetch('http://localhost:5000/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(songData),
      });

      if (res.ok) {
        setStatus('✅ Song uploaded successfully!');
        setSongData({ title: '', artist: '', album: '', url: '', cover: '', genre: '' });
      } else {
        setStatus('❌ Upload failed.');
      }
    } catch (err) {
      setStatus('❌ Error connecting to server.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-green-500">Admin Music Manager</h1>

        <form onSubmit={handleUpload} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400 uppercase">Song Title</label>
              <input name="title" value={songData.title} onChange={handleInputChange} className="bg-zinc-800 p-2 rounded border border-zinc-700 outline-none focus:border-green-500" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400 uppercase">Artist</label>
              <input name="artist" value={songData.artist} onChange={handleInputChange} className="bg-zinc-800 p-2 rounded border border-zinc-700 outline-none focus:border-green-500" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400 uppercase">Album</label>
              <input name="album" value={songData.album} onChange={handleInputChange} className="bg-zinc-800 p-2 rounded border border-zinc-700 outline-none focus:border-green-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400 uppercase">Genre</label>
              <input name="genre" value={songData.genre} onChange={handleInputChange} className="bg-zinc-800 p-2 rounded border border-zinc-700 outline-none focus:border-green-500" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-400 uppercase">Audio URL (.mp3)</label>
            <input name="url" value={songData.url} onChange={handleInputChange} placeholder="https://..." className="bg-zinc-800 p-2 rounded border border-zinc-700 outline-none focus:border-green-500" required />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-400 uppercase">Cover Image URL</label>
            <input name="cover" value={songData.cover} onChange={handleInputChange} placeholder="https://..." className="bg-zinc-800 p-2 rounded border border-zinc-700 outline-none focus:border-green-500" />
          </div>

          <button type="submit" className="bg-green-500 text-black font-bold p-3 rounded-full hover:bg-green-400 transition mt-4">
            Add to Library
          </button>
          {status && <p className="text-center text-sm mt-2">{status}</p>}
        </form>

        <a href="/" className="block text-center mt-8 text-zinc-500 hover:text-white transition">← Back to App</a>
      </div>
    </div>
  );
}

export default AdminDashboard;
