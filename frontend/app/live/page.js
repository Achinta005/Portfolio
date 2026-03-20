"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function WallpaperViewer() {
  const [mediaList, setMediaList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const autoRotateRef = useRef(null);
  const videoRef = useRef(null);

  // Load wallpapers from API route (server-side, no CORS issues)
  useEffect(() => {
    const loadWallpapers = async () => {
      try {
        setIsLoading(true);
        console.log("🌩️ Fetching from Cloudinary via API...");

        const response = await fetch("/api/wallpapers");
        const data = await response.json();

        if (data.success) {
          setMediaList(data.wallpapers);
          setError(null);
          console.log(`✅ Loaded ${data.wallpapers.length} wallpapers`);
        } else {
          setError(data.error || "Failed to load wallpapers");
          console.error("❌ Error:", data.error);
        }
      } catch (err) {
        console.error("Failed to load wallpapers:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadWallpapers();
  }, []);

  // Auto-play video when media changes
  useEffect(() => {
    if (!isLoading && mediaList.length > 0) {
      const currentMedia = mediaList[currentIndex];

      if (currentMedia?.type === "video" && videoRef.current) {
        console.log("🎬 Playing:", currentMedia.name);

        const playVideo = async () => {
          try {
            videoRef.current.muted = true;
            videoRef.current.volume = 0.5;

            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              await playPromise;
              console.log("✅ Auto-play successful");
            }
          } catch (err) {
            console.log("⚠️ Auto-play error:", err.message);
          }
        };

        const timer = setTimeout(playVideo, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, isLoading, mediaList]);

  // Auto-rotate every 30 minutes
  useEffect(() => {
    if (mediaList.length === 0) return;

    const handleAutoRotate = () => {
      console.log("⏰ Auto-rotating...");
      setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    };

    autoRotateRef.current = setInterval(handleAutoRotate, 30 * 60 * 1000);

    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [mediaList.length]);

  // Keyboard controls
  const handleNext = useCallback(() => {
    if (mediaList.length === 0) return;
    const nextIndex = (currentIndex + 1) % mediaList.length;
    console.log(`➡️  Next: ${currentIndex} → ${nextIndex}`);
    setCurrentIndex(nextIndex);
  }, [mediaList.length, currentIndex]);

  const handlePrevious = useCallback(() => {
    if (mediaList.length === 0) return;
    const prevIndex = (currentIndex - 1 + mediaList.length) % mediaList.length;
    console.log(`⬅️  Previous: ${currentIndex} → ${prevIndex}`);
    setCurrentIndex(prevIndex);
  }, [mediaList.length, currentIndex]);

  const handleShuffle = useCallback(() => {
    if (mediaList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * mediaList.length);
    console.log(`🔀 Shuffle: ${currentIndex} → ${randomIndex}`);
    setCurrentIndex(randomIndex);
  }, [mediaList.length, currentIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handlePrevious();
          break;
        case "s":
        case "S":
          e.preventDefault();
          handleShuffle();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious, handleShuffle]);

  const currentMedia = mediaList[currentIndex];
  const isVideo = currentMedia?.type === "video";

  // Loading state
  if (isLoading) {
    return <div className="w-full h-screen bg-black" />;
  }

  // Error state
  if (error) {
    console.error("❌ Error:", error);
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-red-400 font-bold mb-2">
            Error Loading Wallpapers
          </h2>
          <p className="text-red-300 text-sm">{error}</p>
          <p className="text-red-200 text-xs mt-4">
            Make sure CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are set in
            .env.local
          </p>
        </div>
      </div>
    );
  }

  // No media state
  if (mediaList.length === 0) {
    console.warn("⚠️ No wallpapers found");
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-6 max-w-md">
          <h2 className="text-yellow-400 font-bold mb-2">
            No Wallpapers Found
          </h2>
          <p className="text-yellow-300 text-sm">
            Upload videos/images to the "wallpapers" folder in your Cloudinary
            account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      {/* Full Screen Media Display */}
      <div className="w-full h-full">
        {isVideo ? (
          <video
            ref={videoRef}
            key={currentMedia.publicId}
            src={currentMedia.src}
            muted={true}
            loop
            autoPlay
            playsInline
            controls={false}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={currentMedia.src}
            alt="wallpaper"
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}
      </div>
    </div>
  );
}
