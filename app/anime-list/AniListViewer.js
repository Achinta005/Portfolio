"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  WifiSync,
  WifiOff,
  Eye,
  Trash2,
  Plus,
  X,
  Search,
  Save,
  Download,
  Star,
  Calendar,
  Tv,
  Film,
  Clock,
  ArrowLeft,
  Edit3,
  ChevronDown,
  ChevronUp,
  Minus,
  List,
  Filter,
} from "lucide-react";

const getApiUrl = (path) => {
  if (process.env.NODE_ENV === "development") {
    return `/api/python${path}`;
  }
  return `${process.env.NEXT_PUBLIC_PYTHON_API_URL}${path}`;
};

export default function AniListViewer() {
  const [username, setUsername] = useState("achinta");
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [exporting, setExporting] = useState(false);
  const [gridSize, setGridSize] = useState(2);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showAnimeModal, setShowAnimeModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [modifyForm, setModifyForm] = useState({
    status: "",
    progress: "",
    score: "",
  });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code || !state) return;

    const storedState = localStorage.getItem("anilist_oauth_state");
    if (state !== storedState) {
      console.error("State mismatch!");
      setError("Authentication failed - state mismatch");
      return;
    }

    (async () => {
      try {
        const res = await fetch(getApiUrl("/Anilist-exchange"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
          credentials: "include",
        });

        if (!res.ok) throw new Error("Token exchange failed");

        const data = await res.json();
        setIsAuthenticated(true);
        setUsername(data.username);
        localStorage.removeItem("anilist_oauth_state");

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        await fetchAnimeList(data.username);
      } catch (err) {
        console.error("OAuth error:", err);
        setError(err.message);
        setIsAuthenticated(false);
      }
    })();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthChecking(true);
        const res = await fetch(getApiUrl("/anilist/auth/check"), {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.authenticated);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  const statusLabels = {
    CURRENT: "Watching",
    COMPLETED: "Completed",
    PLANNING: "Plan to Watch",
    PAUSED: "On Hold",
    DROPPED: "Dropped",
    ALL: "All Anime",
  };

  const statusColors = {
    CURRENT: "from-blue-500 to-cyan-500",
    COMPLETED: "from-green-500 to-emerald-500",
    PLANNING: "from-purple-500 to-pink-500",
    PAUSED: "from-yellow-500 to-orange-500",
    DROPPED: "from-red-500 to-rose-500",
    ALL: "from-indigo-500 to-blue-500",
  };

  const gridConfigs = [
    { name: "Horizontal", cols: "flex flex-col gap-3" },
    {
      name: "Compact",
      cols: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3",
    },
    {
      name: "Normal",
      cols: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
    },
    {
      name: "Detailed",
      cols: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6",
    },
  ];

  const fetchAnimeList = async (user = username) => {
    if (!user?.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(getApiUrl("/anilist/BaseFunction/fetch"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: user }),
      });

      if (!res.ok) {
        console.log(error);
        throw new Error("Failed to fetch anime list");
      }
      const data = await res.json();
      setAnimeList(data.animeList || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnime = async (mediaId) => {
    if (!isAuthenticated) {
      setError("You must be authenticated to delete anime");
      return;
    }

    if (!confirm("Are you sure you want to delete this anime?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(getApiUrl("/anilist/modify"), {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId: mediaId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }

      await fetchAnimeList();
      setShowAnimeModal(false);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const modifyAnime = async (mediaId) => {
    if (!isAuthenticated) {
      setError("You must be authenticated");
      return;
    }

    setIsModifying(true);
    try {
      const { status, progress, score } = modifyForm;
      const variables = { animeId: mediaId };

      if (status) variables.status = status;
      if (progress) variables.progress = parseInt(progress, 10);
      if (score) variables.score = parseFloat(score);

      const res = await fetch(getApiUrl("/anilist/modify"), {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to modify");
      }

      await fetchAnimeList();
      setShowAnimeModal(false);
      setModifyForm({ status: "", progress: "", score: "" });
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsModifying(false);
    }
  };

  const searchAnime = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(getApiUrl("/anilist/modify"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "search", query: searchQuery.trim() }),
      });

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const addAnimeToList = async (mediaId, status = "PLANNING") => {
    if (!isAuthenticated) {
      setError("You must be authenticated");
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch(getApiUrl("/anilist/modify"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", animeId: mediaId, status }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add");
      }

      await fetchAnimeList();
      setShowAddModal(false);
      setSearchQuery("");
      setSearchResults([]);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const exportList = async (format) => {
    if (!username) {
      setError("No username found");
      return;
    }

    setExporting(true);
    try {
      const res = await fetch(getApiUrl("/anilist/BaseFunction/export"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, format, filter: activeFilter }),
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
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

  const handleConnect = () => {
    const state = crypto.randomUUID();
    localStorage.setItem("anilist_oauth_state", state);
    window.location.href = getApiUrl(`/Anilist-auth?state=${state}`);
  };

  const viewAnimeDetails = (anime) => {
    setSelectedAnime(anime);
    setShowFullDescription(false);
    setModifyForm({
      status: anime.status || "",
      progress: anime.progress?.toString() || "",
      score: anime.score?.toString() || "",
    });
    setShowAnimeModal(true);
  };

  const incrementProgress = () => {
    const current = parseInt(modifyForm.progress || 0);
    const max = selectedAnime?.episodes || 999;
    if (current < max) {
      setModifyForm({ ...modifyForm, progress: (current + 1).toString() });
    }
  };

  const decrementProgress = () => {
    const current = parseInt(modifyForm.progress || 0);
    if (current > 0) {
      setModifyForm({ ...modifyForm, progress: (current - 1).toString() });
    }
  };

  const truncateText = (text, maxLength = 300) => {
    if (!text) return "";
    const stripped = text.replace(/<[^>]*>/g, "");
    return stripped.length > maxLength
      ? stripped.substring(0, maxLength) + "..."
      : stripped;
  };

  const filteredAnime =
    activeFilter === "ALL"
      ? animeList
      : animeList.filter((anime) => anime.status === activeFilter);

  const statusCounts = {
    ALL: animeList.length,
    CURRENT: animeList.filter((a) => a.status === "CURRENT").length,
    COMPLETED: animeList.filter((a) => a.status === "COMPLETED").length,
    PLANNING: animeList.filter((a) => a.status === "PLANNING").length,
    PAUSED: animeList.filter((a) => a.status === "PAUSED").length,
    DROPPED: animeList.filter((a) => a.status === "DROPPED").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-1/2 -right-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen">
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/admin")}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all duration-300"
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline">Back</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Ani
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  List
                </span>
              </h1>

              <div className="flex items-center gap-2">
                {authChecking ? (
                  <div className="px-3 py-2 bg-white/10 rounded-xl">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                ) : isAuthenticated ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                    <WifiSync size={18} className="text-green-400" />
                    <span className="text-green-400 text-sm font-medium hidden sm:inline">
                      Connected
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleConnect}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white text-sm font-medium transition-all"
                  >
                    <WifiOff size={18} />
                    <span className="hidden sm:inline">Connect</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && fetchAnimeList()}
                  placeholder="Enter AniList username..."
                  className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => fetchAnimeList()}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        <Search size={20} />
                        Fetch List
                      </span>
                    )}
                  </button>

                  {isAuthenticated && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg"
                    >
                      <Plus size={20} />
                    </button>
                  )}

                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((size) => (
                      <button
                        key={size}
                        onClick={() => setGridSize(size)}
                        className={`px-4 py-3 rounded-xl font-bold transition-all ${
                          gridSize === size
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        {size === 0 ? (
                          <List size={20} />
                        ) : size === 1 ? (
                          "S"
                        ) : size === 2 ? (
                          "M"
                        ) : (
                          "L"
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {animeList.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <button
                      key={status}
                      onClick={() => setActiveFilter(status)}
                      className={`px-4 py-2.5 rounded-xl font-bold transition-all ${
                        activeFilter === status
                          ? `text-white bg-gradient-to-r ${statusColors[status]}`
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {statusLabels[status]} ({count})
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  {[
                    { format: "json", label: "JSON" },
                    { format: "xml", label: "XML" },
                  ].map(({ format, label }) => (
                    <button
                      key={format}
                      onClick={() => exportList(format)}
                      disabled={exporting}
                      className={`flex items-center gap-2 px-4 py-2.5
                 bg-gradient-to-r from-green-600 to-emerald-600
                 hover:from-green-700 hover:to-emerald-700
                 text-white font-semibold rounded-xl
                 transition-all shadow-lg disabled:opacity-50`}
                    >
                      <Download size={18} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg">Loading anime list...</p>
            </div>
          )}

          {filteredAnime.length > 0 && (
            <div
              className={
                gridSize === 0
                  ? gridConfigs[0].cols
                  : `grid ${gridConfigs[gridSize].cols}`
              }
            >
              {filteredAnime.map((anime) => (
                <div
                  key={anime.id}
                  className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all cursor-pointer"
                  onClick={() => viewAnimeDetails(anime)}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={anime.cover_image_large || anime.cover_image_medium}
                      alt={anime.title_english || anime.title_romaji}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                    <div
                      className={`absolute top-3 left-3 px-3 py-1.5 rounded-full font-bold text-xs bg-gradient-to-r ${
                        statusColors[anime.status]
                      }`}
                    >
                      {statusLabels[anime.status]}
                    </div>

                    {anime.average_score && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1.5 rounded-full flex items-center gap-1">
                        <Star size={14} className="text-white fill-white" />
                        <span className="text-white font-bold text-sm">
                          {anime.average_score}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-white font-bold text-base line-clamp-2 mb-2">
                      {anime.title_english || anime.title_romaji}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Tv size={14} />
                        {anime.progress}/{anime.episodes || "?"}
                      </span>
                      {anime.score > 0 && (
                        <span className="text-purple-400 font-bold">
                          ★ {anime.score}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAnimeModal && selectedAnime && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto"
          onClick={() => setShowAnimeModal(false)}
        >
          <div
            className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl sm:rounded-3xl max-w-5xl w-full my-4 sm:my-8 border border-white/20 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-32 sm:h-48 md:h-64 lg:h-72 w-full">
              <div className="absolute inset-0">
                <img
                  src={
                    selectedAnime.banner_image ||
                    selectedAnime.cover_image_large ||
                    "/placeholder-image.jpg"
                  }
                  alt={
                    selectedAnime.title_english ||
                    selectedAnime.title_romaji ||
                    "Anime Banner"
                  }
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
              </div>

              <button
                onClick={() => setShowAnimeModal(false)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 p-1.5 sm:p-2 md:p-3 bg-black/70 hover:bg-black/90 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90 z-10"
              >
                <X
                  size={18}
                  className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                />
              </button>

              <div className="absolute bottom-0 left-3 sm:left-4 md:left-6 lg:left-8 transform translate-y-1/4 sm:translate-y-1/3 md:translate-y-1/2 z-10">
                <div className="relative group">
                  <img
                    src={
                      selectedAnime.cover_image_large ||
                      "/placeholder-image.jpg"
                    }
                    alt={
                      selectedAnime.title_english ||
                      selectedAnime.title_romaji ||
                      "Anime Cover"
                    }
                    className="w-20 h-30 sm:w-24 sm:h-36 md:w-32 md:h-48 lg:w-40 lg:h-60 object-cover object-center rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border-2 sm:border-3 md:border-4 border-slate-900 transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-lg sm:rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6 lg:p-8 pt-16 sm:pt-20 md:pt-28 lg:pt-36">
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-1 sm:mb-2">
                  {selectedAnime.title_english || selectedAnime.title_romaji}
                </h2>
                {selectedAnime.title_romaji && selectedAnime.title_english && (
                  <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 md:mb-4">
                    {selectedAnime.title_romaji}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <div
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-md sm:rounded-lg md:rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg bg-gradient-to-r ${
                      statusColors[selectedAnime.status]
                    }`}
                  >
                    {statusLabels[selectedAnime.status]}
                  </div>
                  <div className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-md sm:rounded-lg md:rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg flex items-center gap-1 sm:gap-1.5 md:gap-2">
                    <Star
                      size={12}
                      className="sm:w-[14px] sm:h-[14px] md:w-[18px] md:h-[18px] fill-white"
                    />
                    {selectedAnime.average_score || "N/A"}/100
                  </div>
                  <div className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-md sm:rounded-lg md:rounded-xl text-xs sm:text-sm font-bold bg-white/10 text-white">
                    {selectedAnime.format}
                  </div>
                  {selectedAnime.score > 0 && (
                    <div className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-md sm:rounded-lg md:rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg flex items-center gap-1 sm:gap-1.5 md:gap-2">
                      <TrendingUp
                        size={12}
                        className="sm:w-[14px] sm:h-[14px] md:w-[18px] md:h-[18px]"
                      />
                      Your Score: {selectedAnime.score}/10
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                <div className="bg-white/5 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/10">
                  <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2">
                    <Tv
                      size={16}
                      className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5"
                    />
                    Details
                  </h3>
                  <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                    <div className="flex justify-between text-xs sm:text-sm md:text-base">
                      <span className="text-gray-400">Episodes</span>
                      <span className="text-white font-bold">
                        {selectedAnime.episodes || "Ongoing"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm md:text-base">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-bold">
                        {selectedAnime.progress}/{selectedAnime.episodes || "?"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm md:text-base">
                      <span className="text-gray-400">Season</span>
                      <span className="text-white font-bold">
                        {selectedAnime.season || "N/A"}{" "}
                        {selectedAnime.season_year || ""}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm md:text-base">
                      <span className="text-gray-400">Source</span>
                      <span className="text-white font-bold">
                        {selectedAnime.source || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/10">
                  <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2">
                    <Filter
                      size={16}
                      className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5"
                    />
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedAnime.genres?.map((genre, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md sm:rounded-lg md:rounded-xl text-xs sm:text-sm font-medium shadow-lg"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {selectedAnime.description && (
                <div className="bg-white/5 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/10 mb-3 sm:mb-4 md:mb-6">
                  <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4">
                    Synopsis
                  </h3>
                  <div className="relative">
                    <p
                      className={`text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed ${
                        !showFullDescription ? "line-clamp-4" : ""
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: showFullDescription
                          ? selectedAnime.description
                          : truncateText(selectedAnime.description, 300),
                      }}
                    ></p>
                    {selectedAnime.description &&
                      selectedAnime.description.replace(/<[^>]*>/g, "").length >
                        300 && (
                        <button
                          onClick={() =>
                            setShowFullDescription(!showFullDescription)
                          }
                          className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-purple-400 hover:text-purple-300 text-xs sm:text-sm md:text-base font-semibold transition-colors duration-300"
                        >
                          {showFullDescription ? (
                            <>
                              <ChevronUp
                                size={14}
                                className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
                              />
                              See Less
                            </>
                          ) : (
                            <>
                              <ChevronDown
                                size={14}
                                className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
                              />
                              See More
                            </>
                          )}
                        </button>
                      )}
                  </div>
                </div>
              )}

              {isAuthenticated && (
                <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-500/30">
                  <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2">
                    <Edit3
                      size={18}
                      className="sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]"
                    />
                    Modify Anime
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
                    <div>
                      <label className="block text-gray-300 text-xs sm:text-sm md:text-base font-medium mb-1.5 sm:mb-2">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          value={modifyForm.status}
                          onChange={(e) =>
                            setModifyForm({
                              ...modifyForm,
                              status: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base bg-black/30 border border-white/20 rounded-md sm:rounded-lg md:rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 cursor-pointer"
                        >
                          <option value="" className="bg-slate-900">
                            Select Status
                          </option>
                          <option value="CURRENT" className="bg-slate-900">
                            Watching
                          </option>
                          <option value="COMPLETED" className="bg-slate-900">
                            Completed
                          </option>
                          <option value="PLANNING" className="bg-slate-900">
                            Plan to Watch
                          </option>
                          <option value="PAUSED" className="bg-slate-900">
                            On Hold
                          </option>
                          <option value="DROPPED" className="bg-slate-900">
                            Dropped
                          </option>
                        </select>
                        <ChevronDown
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          size={16}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-xs sm:text-sm md:text-base font-medium mb-1.5 sm:mb-2">
                        Progress
                      </label>
                      <div className="flex gap-1.5 sm:gap-2 items-center">
                        <button
                          onClick={decrementProgress}
                          className="px-1 py-1 sm:px-1.5 sm:py-1.5 md:px-2 md:py-2 h-fit bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-md sm:rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <Minus
                            size={14}
                            className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
                          />
                        </button>
                        <input
                          type="number"
                          value={modifyForm.progress}
                          onChange={(e) =>
                            setModifyForm({
                              ...modifyForm,
                              progress: e.target.value,
                            })
                          }
                          placeholder="Episodes"
                          className="flex-1 px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base bg-black/30 border border-white/20 rounded-md sm:rounded-lg md:rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                          min="0"
                          max={selectedAnime.episodes || 999}
                        />
                        <button
                          onClick={incrementProgress}
                          className="px-1 py-1 sm:px-1.5 sm:py-1.5 md:px-2 md:py-2 h-fit bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-md sm:rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <Plus
                            size={14}
                            className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-xs sm:text-sm md:text-base font-medium mb-1.5 sm:mb-2">
                        Your Score
                      </label>
                      <input
                        type="number"
                        value={modifyForm.score}
                        onChange={(e) =>
                          setModifyForm({
                            ...modifyForm,
                            score: e.target.value,
                          })
                        }
                        placeholder="0-10"
                        className="w-full px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base bg-black/30 border border-white/20 rounded-md sm:rounded-lg md:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        min="0"
                        max="10"
                        step="0.5"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => modifyAnime(selectedAnime.media_id)}
                      disabled={isModifying}
                      className="flex-1 px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-4 text-xs sm:text-sm md:text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-md sm:rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/50 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isModifying ? (
                        <>
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save
                            size={16}
                            className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5"
                          />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => deleteAnime(selectedAnime.media_id)}
                      disabled={isDeleting}
                      className="flex-1 sm:flex-none px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-4 text-xs sm:text-sm md:text-base bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-md sm:rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2
                            size={16}
                            className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5"
                          />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl max-w-4xl w-full my-8 border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <Plus size={28} />
                  Add Anime to List
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchAnime()}
                    placeholder="Search anime by title..."
                    className="w-full pl-12 pr-4 py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  />
                </div>
                <button
                  onClick={searchAnime}
                  disabled={searching}
                  className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-lg shadow-purple-500/50 flex items-center gap-2"
                >
                  {searching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      Search
                    </>
                  )}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {searchResults.map((anime) => (
                    <div
                      key={anime.id}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 flex gap-4"
                    >
                      <img
                        src={
                          anime.coverImage?.large || anime.coverImage?.medium
                        }
                        alt={anime.title?.english || anime.title?.romaji}
                        className="w-24 h-36 object-cover rounded-xl shadow-lg flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                          {anime.title?.english || anime.title?.romaji}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-lg text-sm font-medium">
                            {anime.format}
                          </span>
                          {anime.episodes && (
                            <span className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-lg text-sm font-medium flex items-center gap-1">
                              <Tv size={14} />
                              {anime.episodes} eps
                            </span>
                          )}
                          {anime.averageScore && (
                            <span className="px-3 py-1 bg-yellow-600/30 text-yellow-300 rounded-lg text-sm font-medium flex items-center gap-1">
                              <Star size={14} className="fill-yellow-300" />
                              {anime.averageScore}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {anime.genres?.slice(0, 4).map((genre, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-white/10 text-gray-300 rounded-lg text-xs font-medium"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <div className="relative">
                          <select
                            id={`status-${anime.id}`}
                            className="px-3 py-2 bg-black/30 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-8"
                          >
                            <option value="PLANNING" className="bg-slate-900">
                              Plan to Watch
                            </option>
                            <option value="CURRENT" className="bg-slate-900">
                              Watching
                            </option>
                            <option value="COMPLETED" className="bg-slate-900">
                              Completed
                            </option>
                            <option value="PAUSED" className="bg-slate-900">
                              On Hold
                            </option>
                            <option value="DROPPED" className="bg-slate-900">
                              Dropped
                            </option>
                          </select>
                          <ChevronDown
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={16}
                          />
                        </div>
                        <button
                          onClick={() => {
                            const status = document.getElementById(
                              `status-${anime.id}`
                            ).value;
                            addAnimeToList(anime.id, status);
                          }}
                          disabled={isAdding}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAdding ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus size={16} />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.length === 0 && !searching && searchQuery && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={40} className="text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">No results found</p>
                  <p className="text-gray-500 text-sm">
                    Try a different search term
                  </p>
                </div>
              )}

              {searchResults.length === 0 && !searching && !searchQuery && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={40} className="text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">
                    Search for anime to add
                  </p>
                  <p className="text-gray-500 text-sm">
                    Enter a title in the search box above
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
}
