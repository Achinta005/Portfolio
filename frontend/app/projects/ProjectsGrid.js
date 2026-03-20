"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";

const AnimatedTestimonials = dynamic(
  () =>
    import("@/components/ui/animatedProjects").then((mod) => ({
      default: mod.AnimatedTestimonials,
    })),
  {
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-2 border-transparent border-t-violet-500 border-r-cyan-400 rounded-full animate-spin" />
          <div
            className="absolute inset-3 border-2 border-transparent border-t-cyan-400 border-r-violet-500 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "0.7s" }}
          />
        </div>
      </div>
    ),
    ssr: false,
  },
);

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function ProjectsGrid({ projectsData }) {
  const [shuffled, setShuffled] = useState([]);
  const [category, setCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const SLIDE_DURATION = 6000;
  const categories = ["All", "Web Development", "Machine Learning"];

  useEffect(() => {
    if (projectsData?.length) {
      setShuffled(shuffleArray(projectsData));
      setIsLoading(false);
    }
    console.log("project dara0",projectsData)
  }, [projectsData]);

  const filtered = useMemo(
    () =>
      category === "All"
        ? shuffled
        : projectsData.filter((p) => p.category === category),
    [category, shuffled, projectsData],
  );

  const totalPages = Math.ceil((filtered.length || 1) / 2);

  const goTo = useCallback(
    (idx) => {
      setPageIndex(((idx % totalPages) + totalPages) % totalPages);
    },
    [totalPages],
  );

  const goNext = useCallback(() => goTo(pageIndex + 1), [pageIndex, goTo]);
  const goPrev = useCallback(() => goTo(pageIndex - 1), [pageIndex, goTo]);

  useEffect(() => {
    setPageIndex(0);
  }, [category]);

  useEffect(() => {
    if (isPaused || filtered.length <= 2) return;
    const t = setInterval(goNext, SLIDE_DURATION);
    return () => clearInterval(t);
  }, [isPaused, goNext, filtered.length]);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [goNext, goPrev]);

  const testimonials = useMemo(
    () =>
      filtered.map((p) => {
        let techList = "";
        try {
          techList = Array.isArray(p.technologies)
            ? p.technologies.join(", ")
            : JSON.parse(p.technologies).join(", ");
        } catch {
          techList = p.technologies || "";
        }

        const isML = p.category === "Machine Learning";
        return {
          quote: p.description || "",
          name: p.title || "Untitled",
          media: p.media || [
            {
              type: "image",
              src: p.image || "/placeholder-image.jpg",
              label: p.title,
            },
          ],
          githubUrl: p.github_url || p.githubUrl,
          liveUrl: p.live_url || p.liveUrl,
          designation: techList,
          category: p.category,
          isLocal: p.isLocal,
          accuracy: isML ? p.modelAccuracy : undefined,
          features: isML ? p.modelFeatures : undefined,
          showAllButtons: isML,
        };
      }),
    [filtered],
  );

  return (
    <section className="relative py-6 sm:py-10 lg:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Outer shell ── */}
        <div
          className="relative rounded-2xl lg:rounded-3xl overflow-hidden -top-24"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, rgba(139,92,246,0.04) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.06)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Ambient glow top-right */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-600/8 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-5 sm:p-6 lg:p-8">
            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between mb-6">
              {/* Window dots */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full shadow-sm shadow-red-500/50" />
                <span className="w-3 h-3 bg-yellow-400 rounded-full shadow-sm shadow-yellow-400/50" />
                <span className="w-3 h-3 bg-green-500 rounded-full shadow-sm shadow-green-500/50" />
              </div>

              {/* Category filters */}
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 cursor-pointer ${
                      category === cat
                        ? "bg-gradient-to-r from-violet-600/40 to-cyan-600/30 border-violet-400/50 text-white scale-105 shadow-lg shadow-violet-500/10"
                        : "bg-white/[0.04] border-white/10 text-gray-400 hover:bg-white/[0.08] hover:text-gray-200 hover:border-white/20"
                    }`}
                  >
                    {cat}
                    <span
                      className={`ml-1.5 text-[10px] ${category === cat ? "text-white/60" : "text-gray-600"}`}
                    >
                      {cat === "All"
                        ? projectsData?.length
                        : projectsData?.filter((p) => p.category === cat)
                            .length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Auto indicator */}
              <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-mono">
                {isPaused ? (
                  <>
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                    paused
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    auto
                  </>
                )}
              </div>
            </div>

            {/* ── Content ── */}
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-72">
                  <div className="text-center space-y-4">
                    <div className="relative w-14 h-14 mx-auto">
                      <div className="absolute inset-0 border-2 border-transparent border-t-violet-500 border-r-pink-500 rounded-full animate-spin" />
                      <div
                        className="absolute inset-3 border-2 border-transparent border-t-cyan-400 border-r-violet-500 rounded-full animate-spin"
                        style={{ animationDirection: "reverse" }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 font-mono tracking-wider">
                      loading projects
                    </p>
                  </div>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                    🔭
                  </div>
                  <p className="text-gray-400 text-sm font-medium">
                    No projects in this category
                  </p>
                  <p className="text-gray-600 text-xs">
                    Currently building something here...
                  </p>
                </div>
              ) : (
                <AnimatedTestimonials
                  testimonials={testimonials}
                  activeIndex={pageIndex}
                  onNext={goNext}
                  onPrev={goPrev}
                  onGoTo={goTo}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
