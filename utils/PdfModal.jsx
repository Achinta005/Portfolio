import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const PdfModal = ({ pdfUrl, onClose, header }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const extractGoogleDriveFileId = (url) => {
    if (!url) return null;
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const getGoogleDrivePreviewUrl = (url) => {
    const fileId = extractGoogleDriveFileId(url);
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
  };

  const getGoogleDocsViewerUrl = (url) => {
    const fileId = extractGoogleDriveFileId(url);
    const cleanUrl = fileId ? `https://drive.google.com/uc?id=${fileId}` : url;
    return `https://docs.google.com/gview?url=${encodeURIComponent(cleanUrl)}&embedded=true`;
  };

  const getViewerUrl = () => {
    const isGoogleDrive = pdfUrl?.includes("drive.google.com");
    if (useFallback)
      return isGoogleDrive ? getGoogleDocsViewerUrl(pdfUrl) : pdfUrl;
    if (isGoogleDrive) return getGoogleDrivePreviewUrl(pdfUrl) || pdfUrl;
    return pdfUrl;
  };

  useEffect(() => {
    if (pdfUrl) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [pdfUrl]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleDownload = () => {
    try {
      const fileId = extractGoogleDriveFileId(pdfUrl);
      if (fileId) {
        window.open(
          `https://drive.google.com/uc?export=download&id=${fileId}`,
          "_blank",
        );
      } else {
        window.open(pdfUrl, "_blank");
      }
    } catch (err) {
      console.error("Error downloading:", err);
    }
  };

  const handleIframeError = () => {
    setUseFallback(true);
    setIsLoading(false);
  };

  if (!pdfUrl || !mounted) return null;

  const modal = (
    <div
      style={{ zIndex: 99999, height: "100dvh", width: "100vw" }}
      className={`fixed inset-0 flex items-center justify-center bg-black/85 backdrop-blur-xl transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      onClick={handleClose}
    >
      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Modal container */}
      <div
        className={`relative transition-all duration-500 ${isVisible ? "scale-100 rotate-0" : "scale-90 -rotate-3"
          }`}
        style={{
          width: "min(700px, 92vw)",
          height: "min(90vh, 1000px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-lg opacity-80 animate-pulse" />

        {/* Modal body */}
        <div className="relative bg-slate-900 rounded-2xl overflow-hidden h-full flex flex-col border border-slate-700/50">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-600/40 flex-shrink-0">
            {/* Traffic lights */}
            <div className="flex items-center gap-2 z-10">
              <button
                onClick={handleClose}
                aria-label="Close"
                className="group relative w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-md hover:from-red-300 hover:to-red-500 transition-all duration-200"
              >
                <svg
                  className="w-2 h-2 absolute inset-0 m-auto text-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M10.7 1.3c-.4-.4-1-.4-1.4 0L6 4.6 2.7 1.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4L4.6 6 1.3 9.3c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0L6 7.4l3.3 3.3c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L7.4 6l3.3-3.3c.4-.4.4-1 0-1.4z" />
                </svg>
              </button>
              <button
                aria-label="Minimize"
                className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-md hover:from-yellow-300 hover:to-yellow-500 transition-all duration-200"
              />
              <button
                aria-label="Maximize"
                className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-md hover:from-green-300 hover:to-green-500 transition-all duration-200"
              />
            </div>

            {/* Centered title */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 max-w-xs">
              <svg
                className="w-4 h-4 text-purple-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {header ? (
                <span className="text-sm font-semibold text-gray-200 tracking-wide truncate">
                  {header}
                </span>
              ) : (
                <span className="text-sm font-semibold text-gray-200 tracking-wide truncate">
                  Achinta Hazra Resume.pdf
                </span>
              )}
            </div>

            {/* Close X button */}
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="group z-10 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-600/50 transition-all duration-200"
            >
              <svg
                className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Iframe area */}
          <div className="flex-1 p-2 bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-blue-500/15 min-h-0">
            <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-transparent rounded-br-full pointer-events-none z-10" />
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-tr-full pointer-events-none z-10" />
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-full pointer-events-none z-10" />

              {/* Loading spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 z-20">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 w-14 h-14 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <div
                      className="absolute inset-0 w-14 h-14 border-4 border-transparent border-r-pink-500 rounded-full animate-spin"
                      style={{ animationDelay: "0.15s" }}
                    />
                  </div>
                  <p className="text-purple-400 text-sm font-medium mt-4 animate-pulse">
                    Loading Resume...
                  </p>
                </div>
              )}

              {/* Iframe */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <iframe
                  key={`viewer-${useFallback}`}
                  src={getViewerUrl()}
                  title="Resume Viewer"
                  style={{
                    width: "calc(100% + 20px)",
                    height: "calc(100% + 20px)",
                    border: "none",
                    marginRight: "-20px",
                    marginBottom: "-20px",
                  }}
                  onLoad={() => setIsLoading(false)}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>

              {useFallback && (
                <div className="absolute top-3 left-3 z-20 bg-yellow-500/20 border border-yellow-400/30 text-yellow-200 px-3 py-1 rounded-full text-xs">
                  Using fallback viewer
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-4 py-2 flex items-center justify-between border-t border-slate-600/40 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                style={{ boxShadow: "0 0 6px #22c55e" }}
              />
              <span className="text-xs text-gray-400">Secure View</span>
            </div>
            <button
              onClick={handleDownload}
              title="Download"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-600/50 transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default PdfModal;
