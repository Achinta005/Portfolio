'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function AniListViewer() {
  const [username, setUsername] = useState('achinta');
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [exporting, setExporting] = useState(false);
  const router = useRouter();

  const handleClick = () => router.push('/admin');

  const statusLabels = {
    'CURRENT': 'Watching',
    'COMPLETED': 'Completed',
    'PLANNING': 'Plan to Watch',
    'PAUSED': 'On Hold',
    'DROPPED': 'Dropped',
    'ALL': 'All'
  };

  const fetchAnimeList = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    setAnimeList([]);

    try {
      const response = await fetch('/api/anilist/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch anime list');
      setAnimeList(data.animeList || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => e.key === 'Enter' && fetchAnimeList();

  const filteredAnime = activeFilter === 'ALL'
    ? animeList
    : animeList.filter(anime => anime.status === activeFilter);

  const statusCounts = {
    ALL: animeList.length,
    CURRENT: animeList.filter(a => a.status === 'CURRENT').length,
    COMPLETED: animeList.filter(a => a.status === 'COMPLETED').length,
    PLANNING: animeList.filter(a => a.status === 'PLANNING').length,
    PAUSED: animeList.filter(a => a.status === 'PAUSED').length,
    DROPPED: animeList.filter(a => a.status === 'DROPPED').length,
  };

  const exportList = async (format) => {
    if (!username) {
      setError('No username found');
      return;
    }

    setExporting(true);
    try {
      const response = await fetch('/api/anilist/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), format, filter: activeFilter }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to export');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${username}_anime_list.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-x-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-80 sm:w-96 h-80 sm:h-96 bg-purple-500/10 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-80 sm:w-96 h-80 sm:h-96 bg-blue-500/10 rounded-full blur-3xl top-1/2 right-0 animate-pulse delay-1000"></div>
        <div className="absolute w-80 sm:w-96 h-80 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl bottom-0 left-1/2 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Dashboard Button */}
        <button
          className="mb-8 bg-white/20 backdrop-blur-3xl px-4 py-2 rounded-xl text-amber-50 text-sm sm:text-base cursor-pointer hover:text-green-400 transition-all"
          onClick={handleClick}
        >
          ← Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
            Ani<span className="text-blue-400">List</span> Viewer
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">
            Track and explore your anime collection
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-xl sm:max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20">
            <label className="block text-white text-sm font-medium mb-3">
              AniList Username
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter username..."
                className="flex-1 px-5 py-3 sm:px-6 sm:py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <button
                onClick={fetchAnimeList}
                disabled={loading}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition-all transform hover:scale-105 active:scale-95"
              >
                {loading ? 'Loading...' : 'Fetch List'}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm sm:text-base">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Filters & Export */}
        {animeList.length > 0 && (
          <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-4 sm:mb-6">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all transform hover:scale-105 ${
                    activeFilter === status
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {statusLabels[status] || status} ({count})
                </button>
              ))}
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {['json', 'xml'].map((format) => (
                <button
                  key={format}
                  onClick={() => exportList(format)}
                  disabled={exporting}
                  className={`px-5 py-2 sm:px-6 sm:py-3 ${
                    format === 'json'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                  } text-white font-medium rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {exporting ? 'Exporting...' : `Export ${format.toUpperCase()}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Anime Grid */}
        {filteredAnime.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {filteredAnime.map((anime) => (
                <div
                  key={anime.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl border border-white/20 hover:border-blue-400/50 transition-all transform hover:scale-[1.02] hover:-translate-y-2"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={anime.cover_image_large || anime.cover_image_medium}
                      alt={anime.title_english || anime.title_romaji}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 px-3 py-1 rounded-full text-xs font-semibold text-white">
                      ⭐ {anime.score || 'N/A'}
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-white font-bold text-base sm:text-lg mb-2 line-clamp-2">
                      {anime.title_english || anime.title_romaji}
                    </h3>
                    <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm mb-3">
                      <span className="text-gray-300">
                        {anime.progress}/{anime.episodes || '?'} eps
                      </span>
                      <span className={`px-2 py-1 sm:px-3 rounded-full font-medium ${
                        anime.status === 'COMPLETED' ? 'bg-green-500/20 text-green-300' :
                        anime.status === 'CURRENT' ? 'bg-blue-500/20 text-blue-300' :
                        anime.status === 'PLANNING' ? 'bg-purple-500/20 text-purple-300' :
                        anime.status === 'PAUSED' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {statusLabels[anime.status] || anime.status}
                      </span>
                    </div>
                    {anime.genres?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {anime.genres.slice(0, 3).map((genre, idx) => (
                          <span key={idx} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && animeList.length === 0 && !error && (
          <div className="text-center text-gray-400 py-16 sm:py-20">
            <svg className="w-20 sm:w-24 h-20 sm:h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-lg sm:text-xl">Enter a username to view their anime list</p>
          </div>
        )}
      </div>
    </div>
  );
}
