"use client";
import { easeOut, motion } from "framer-motion";
import { PinContainer } from "@/components/ui/3dpin";
import { X, Download, ExternalLink, ZoomIn, ZoomOut, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

// Certificate Popup Component
const CertificatePopup = ({ cert, isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [loadError, setLoadError] = useState(false);
  const [useViewer, setUseViewer] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadError(false);
      setUseViewer(false);
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  if (!isOpen || !cert) return null;

  // Function to get proper Google Drive preview URL
  const getGoogleDrivePreviewUrl = (url) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    return url;
  };

  // Function to get Google Drive download URL
  const getGoogleDriveDownloadUrl = (url) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
    }
    return url;
  };

  // Function to get document URL for display
  const getDocumentUrl = (path) => {
    if (path.includes('drive.google.com')) {
      return getGoogleDrivePreviewUrl(path);
    }
    return path;
  };

  // Fallback to Google Docs Viewer
  const getViewerUrl = (originalUrl) => {
    let cleanUrl = originalUrl;
    
    // If it's a Google Drive link, get the direct download URL for viewer
    if (originalUrl.includes('drive.google.com')) {
      const fileIdMatch = originalUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        cleanUrl = `https://drive.google.com/uc?id=${fileIdMatch[1]}`;
      }
    }
    
    return `https://docs.google.com/gview?url=${encodeURIComponent(cleanUrl)}&embedded=true`;
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));

  const handleMouseDown = (e) => {
    if (!useViewer) return; // Only allow dragging for images
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging && useViewer) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const downloadCert = () => {
    if (cert.path.includes('drive.google.com')) {
      const downloadUrl = getGoogleDriveDownloadUrl(cert.path);
      window.open(downloadUrl, '_blank');
      return;
    }
    
    // For direct URLs
    const link = document.createElement("a");
    link.href = cert.path;
    link.download = `${cert.name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openInNewTab = () => {
    if (cert.path.includes('drive.google.com')) {
      const fileIdMatch = cert.path.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        window.open(`https://drive.google.com/file/d/${fileIdMatch[1]}/view`, "_blank");
        return;
      }
    }
    window.open(cert.path, "_blank", "noopener,noreferrer");
  };

  const handleIframeError = () => {
    console.log("Primary iframe failed, switching to viewer");
    setLoadError(true);
    setUseViewer(true);
  };

  const documentUrl = getDocumentUrl(cert.path);
  const viewerUrl = getViewerUrl(cert.path);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Container */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-5xl max-h-[95vh] w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <img
              src={cert.icon}
              alt={cert.name}
              className="w-8 h-8 rounded object-contain"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Im0xMiAxNS41IDQtNEw5LjUgOGwtMi00IiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==';
              }}
            />
            <div>
              <h3 className="font-bold text-lg text-gray-900">{cert.name}</h3>
              <p className="text-sm text-gray-600">
                {cert.issuer} • {cert.year}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-sm text-gray-600 min-w-[4rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={resetView}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={downloadCert}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Download Certificate"
            >
              <Download size={16} />
            </button>
            <button
              onClick={openInNewTab}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink size={16} />
            </button>
            {loadError && (
              <button
                onClick={() => {
                  setLoadError(false);
                  setUseViewer(!useViewer);
                }}
                className="p-2 hover:bg-yellow-200 text-yellow-600 rounded-lg transition-colors"
                title="Switch Viewer"
              >
                <AlertCircle size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div
          className="relative overflow-hidden bg-gray-100"
          style={{ height: "75vh" }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Status indicator */}
          {loadError && (
            <div className="absolute top-4 left-4 z-10 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={14} />
              Using fallback viewer
            </div>
          )}

          {/* Document Display */}
          <div className="w-full h-full flex items-center justify-center">
            {cert.path.toLowerCase().includes('.pdf') || cert.path.includes('drive.google.com') ? (
              !useViewer ? (
                <iframe
                  key={`primary-${documentUrl}`}
                  src={documentUrl}
                  className="w-full h-full border-0"
                  title={cert.name}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "center center",
                  }}
                  onLoad={() => setLoadError(false)}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              ) : (
                <iframe
                  key={`fallback-${viewerUrl}`}
                  src={viewerUrl}
                  className="w-full h-full border-0"
                  title={`${cert.name} (Viewer)`}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "center center",
                  }}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              )
            ) : (
              // For image certificates
              <img
                src={cert.path}
                alt={cert.name}
                className={`max-w-none transition-transform ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  transformOrigin: "center center",
                }}
                onMouseDown={handleMouseDown}
                onError={(e) => {
                  console.error("Image failed to load:", cert.path);
                  setLoadError(true);
                }}
                draggable={false}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t">
          <p className="text-xs text-gray-500 text-center">
            {cert.path.includes('.pdf') || cert.path.includes('drive.google.com') 
              ? "PDF Document • Use zoom controls • Click download or open in new tab"
              : "Use mouse wheel to zoom • Click and drag to pan • Press ESC to close"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default function CertificationSection() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Updated certifications with proper cloud URLs
  const certifications = [
    {
      name:"Summer Internship Program 2025 organized by the IEEE Computational Intelligence Society, Kolkata Chapter",
      issuer:"IEEE Computational Intelligence Society",
      year:"2025",
      icon:"https://res.cloudinary.com/dc1fkirb4/image/upload/v1756121821/IEEE_CIS_logo_o9m6uj.jpg",
      path:"https://drive.google.com/file/d/1ha0jzG0Ga_C4o0QSEvn9z0TdIMzMHalD/view?usp=drive_link"
    },
    {
      name: "Full Stack Web Development",
      issuer: "Teachnook",
      year: "2023",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346694/1630662755102_c5fstb.jpg",
      path: "https://drive.google.com/file/d/1_J7kK8ZRz6hcsvHXbyihoHYFpKwkXb5c/view?usp=drive_link",
    },
    {
      name: "Internship Training Program on ADVANCE JAVA",
      issuer: "AUTODESK CADEASY",
      year: "2024",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/cadeasy_naooon.png",
      path: "https://drive.google.com/file/d/1PyD8l2orxHMfyA4skCp5lMOjSqljyi-M/view?usp=drive_link",
    },
    {
      name: "Internship Training Program on CORE JAVA",
      issuer: "AUTODESK CADEASY",
      year: "2024",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/cadeasy_naooon.png",
      path: "https://drive.google.com/file/d/1Q0k9n4u05-dcvaUFaC2Yx7RQyPyR4BQD/view?usp=drive_link",
    },
    {
      name: "FULL STACK DATA SCIENCE USING PYTHON",
      issuer: "AUTODESK CADEASY",
      year: "2024",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/cadeasy_naooon.png",
      path: "https://drive.google.com/file/d/1Q8oM_bPdpNhX9C5gUHrntjk9xV8fonJg/view?usp=drive_link",
    },
    {
      name: "MACHINE LEARNING USING PYTHON",
      issuer: "AUTODESK CADEASY",
      year: "2024",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/cadeasy_naooon.png",
      path: "https://drive.google.com/file/d/1Q9M3fCFhzDryyMVUq-ISFTg2tWj-s7Eo/view?usp=drive_link",
    },
    {
      name: "IEEE Student Chapter",
      issuer: "The Institution Of Engineer",
      year: "2023",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346757/Institution_of_Engineers__India__Logo_lv3eix.svg",
      path: "https://drive.google.com/file/d/1Pm-mWpZ-Wr6Nekp7mm1Cpa1i9Y817Dyz/view?usp=drive_link",
    },
    {
      name: "IEEE Seminar",
      issuer: "DIATM",
      year: "2023",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346757/Institution_of_Engineers__India__Logo_lv3eix.svg",
      path: "https://drive.google.com/file/d/1IGBuoQxdc1xItYWnoLzfBsgSD7bz5DJH/view?usp=drive_link",
    },
  ];

  const openCertificatePopup = (cert) => {
    console.log("Opening certificate:", cert.name, cert.path);
    setSelectedCert(cert);
    setIsPopupOpen(true);
  };

  const closeCertificatePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => setSelectedCert(null), 300); // Delay to allow animation
  };

  // Handle ESC key to close popup
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isPopupOpen) {
        closeCertificatePopup();
      }
    };
    
    if (isPopupOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Prevent background scroll
      
      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "unset";
      };
    }
  }, [isPopupOpen]);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <h2 className="text-4xl font-bold text-yellow-100 mb-4">
              Certifications
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -150 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <p className="text-xl text-gray-300 max-w-3xl mx-auto dark:text-gray-300">
              Professional certifications that validate my expertise and
              commitment to continuous learning.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOut, delay: index * 0.1 }}
            >
              <PinContainer
                title="VIEW CERTIFICATE"
                onClick={() => openCertificatePopup(cert)}
              >
                <div className="flex items-center mb-4">
                  <div className="w-[5vw] h-[12vh] flex items-center justify-center bg-blue-100 rounded-lg flex-shrink-0">
                    <img
                      src={cert.icon}
                      alt={cert.name}
                      className="w-fit h-fit rounded-lg object-contain"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Im0xMiAxNS41IDQtNEw5LjUgOGwtMi00IiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-left text-blue-600 text-sm leading-tight hover:text-blue-700 ml-10">
                      {cert.name}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-100 font-medium text-sm mb-1 dark:text-gray-400">
                  {cert.issuer}
                </p>
                <p className="text-gray-300 text-xs dark:text-gray-600">
                  {cert.year}
                </p>
              </PinContainer>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certificate Popup */}
      <CertificatePopup
        cert={selectedCert}
        isOpen={isPopupOpen}
        onClose={closeCertificatePopup}
      />
    </section>
  );
}