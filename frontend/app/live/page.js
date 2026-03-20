"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function WallpaperViewer() {
  const [mediaList, setMediaList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // Always true for auto-play
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const autoRotateRef = useRef(null);
  const videoRef = useRef(null);

  // Load media files from public folder
  useEffect(() => {
    const loadMedia = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/wallpapers");
        const data = await response.json();
        console.log("Loaded wallpapers:", data.wallpapers?.length || 0);
        setMediaList(data.wallpapers || []);
        setError(null);
        if (data.wallpapers && data.wallpapers.length > 0) {
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Failed to load wallpapers:", err);
        setError("Failed to load wallpapers.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMedia();
  }, []);

  // Auto-play video when media changes or loads
  useEffect(() => {
    if (!isLoading && mediaList.length > 0) {
      const currentMedia = mediaList[currentIndex];

      if (currentMedia?.type === "video" && videoRef.current) {
        console.log("Video loaded:", currentMedia.name);

        const playVideo = async () => {
          try {
            console.log("🎬 Starting auto-play...");
            // Ensure video is muted for auto-play
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

        // Small delay to ensure DOM is ready
        const timer = setTimeout(playVideo, 300);
        return () => clearTimeout(timer);
      } else if (currentMedia?.type === "image") {
        console.log("🖼️ Image loaded:", currentMedia.name);
      }
    }
  }, [currentIndex, isLoading, mediaList]);

  // Auto-rotate every 30 minutes
  useEffect(() => {
    if (!autoRotateEnabled || mediaList.length === 0) {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
      return;
    }

    const handleAutoRotate = () => {
      console.log("⏰ Auto-rotating...");
      setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    };

    // 30 minutes = 1800000 ms
    autoRotateRef.current = setInterval(handleAutoRotate, 30 * 60 * 1000);

    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [autoRotateEnabled, mediaList.length]);

  // Define handlers BEFORE keyboard effect
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

  const handleMute = useCallback(() => {
    console.log("🔊 Mute toggled");
    setIsMuted((prev) => !prev);
  }, []);

  // Keyboard shortcuts - with dependencies
  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log("⌨️  Key pressed:", e.key);

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
        case "m":
        case "M":
          e.preventDefault();
          handleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    console.log("✅ Keyboard listener attached");

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, handlePrevious, handleShuffle, handleMute]);

  const currentMedia = mediaList[currentIndex];
  const isVideo = currentMedia?.type === "video";

  // Loading state - completely black
  if (isLoading) {
    return <div className="w-full h-screen bg-black" />;
  }

  // Error state - completely black
  if (error) {
    console.error("❌ Error state:", error);
    return <div className="w-full h-screen bg-black" />;
  }

  // No media state - completely black
  if (mediaList.length === 0) {
    console.warn("⚠️ No media found");
    return <div className="w-full h-screen bg-black" />;
  }

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      {/* Media Display - Full Screen Only */}
      <div className="w-full h-full">
        {isVideo ? (
          <video
            ref={videoRef}
            key={currentMedia.src}
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
          />
        )}
      </div>
    </div>
  );
}
