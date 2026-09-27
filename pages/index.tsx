import React, { useState, useEffect } from 'react';
import Player from '../components/Player';
import AuthPage from '../components/AuthPage';

async function fetchSongs() {
  const res = await fetch('http://localhost:5000/api/songs');
  return await res.json();
}

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [songs, setSongs] = useState([]);
  const [recs, setRecs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('spotify_user');
    const storedToken = localStorage.getItem('spotify_token');
    if (storedUser) setUser(storedUser);
    if (storedToken) setToken(storedToken);

    async function loadData() {
      try {
        const [songsData, recsData] = await Promise.all([
          fetchSongs(),
          token ? fetch('http://localhost:5000/api/recommendations', {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          }).then(res => res.json()).catch(() => []) : Promise.resolve([])
        ]);
        setSongs(songsData);
        setRecs(recsData);
        if (songsData.length > 0) setCurrentSong(songsData[0]);
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  const toggleLike = async (songId: string) => {
    if (!token) return alert('Please login to like songs');
    try {
      const res = await fetch('http://localhost:5000/api/favorites/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ songId }),
      });
      const data = await res.json();
      if (data.liked) {
        setFavorites([...favorites, songs.find((s: any) => s._id === songId)]);
      } else {
        setFavorites(favorites.filter((s: any) => s._id !== songId));
      }
    } catch (e) {
      console.error("Like error", e);
    }
  };

  const filteredSongs = songs.filter((song: any) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return <AuthPage onAuthSuccess={(username) => {
      setUser(username);
      setToken(localStorage.getItem('spotify_token'));
    }} />;
  }

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="w-64 bg-black p-6 flex flex-col gap-4 border-r border-zinc-900">
        <div className="text-2xl font-bold mb-8 flex items-center gap-2">
          <span className="text-green-500 text-3xl">🎧</span> SpotifyClone
        </div>
        <nav className="flex flex-col gap-3 text-zinc-400 font-medium">
          <div className="text-white cursor-pointer hover:text-white transition">🏠 Home</div>
          <div className="cursor-pointer hover:text-white transition">📚 Your Library</div>
          <a href="/admin" className="cursor-pointer hover:text-white transition text-xs text-zinc-600">🛠 Admin Panel</a>
        </nav>
        <div className="mt-auto p-4 bg-zinc-900 rounded-lg text-xs flex justify-between items-center">
          <span>👤 {user}</span>
          <button onClick={() => { localStorage.clear(); setUser(null); setToken(null); }} className="text-zinc-500 hover:text-white">Logout</button>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-b from-zinc-800 to-black p-8 overflow-y-auto pb-32">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome, {user}!</h1>
          <input
            type="text"
            placeholder="Search songs..."
            className="bg-zinc-800 p-2 px-4 rounded-full border border-zinc-700 outline-none focus:border-green-500 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Recommendations Section */}
        {recs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-zinc-400">Recommended for you</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recs.map((song: any) => (
                <div key={song._id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className="bg-zinc-900 p-4 rounded-lg hover:bg-zinc-800 transition cursor-pointer group">
                  <img src={song.cover} className="w-full aspect-square object-cover rounded-md mb-3 shadow-lg" />
                  <div className="font-bold truncate">{song.title}</div>
                  <div className="text-sm text-zinc-400 truncate">{song.artist}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4 text-zinc-400">All Music</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSongs.map((song: any) => (
            <div key={song._id} onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className="flex items-center bg-zinc-900/50 hover:bg-zinc-800 p-2 rounded transition cursor-pointer group">
              <img src={song.cover} className="w-16 h-16 rounded mr-4 shadow-lg" />
              <div className="flex-1">
                <div className="font-bold truncate">{song.title}</div>
                <div className="text-sm text-zinc-400 truncate">{song.artist}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleLike(song._id); }} className={`mr-4 transition ${favorites.find((f: any) => f._id === song._id) ? 'text-green-500' : 'text-zinc-500 hover:text-white'}`}>❤️</button>
              <button className="bg-green-500 text-black rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-xl">▶️</button>
            </div>
          ))}
        </div>
      </div>

      {currentSong && <Player currentSong={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}
    </div>
  );
}
