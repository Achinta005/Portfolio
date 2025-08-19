"use client";
import { easeOut, motion } from "framer-motion";
import { PinContainer } from "@/components/ui/3dpin";
import { X, Download, ExternalLink, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useEffect } from "react";

// Certificate Popup Component
const CertificatePopup = ({ cert, isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  if (!isOpen || !cert) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
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
    const link = document.createElement("a");
    link.href = cert.path;
    link.download = `${cert.name}.pdf`;
    link.click();
  };

  const openInNewTab = () => {
    window.open(cert.path, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Container */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <img
              src={cert.icon}
              alt={cert.name}
              className="w-8 h-8 rounded object-contain"
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
              title="Download"
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
          style={{ height: "70vh" }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Certificate Display */}
          <div className="w-full h-full flex items-center justify-center">
            {cert.path.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={cert.path}
                className="w-full h-full border-0"
                title={cert.name}
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  transformOrigin: "center center",
                }}
              />
            ) : (
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
                draggable={false}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t">
          <p className="text-xs text-gray-500 text-center">
            Use mouse wheel to zoom • Click and drag to pan • Press ESC to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default function CertificationSection() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const certifications = [
    {
      name: "Full Stack Web Devolopment",
      issuer: "Teachnook",
      year: "2023",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346694/1630662755102_c5fstb.jpg",
      path: "/Teachnook COURSE Completion Certificate _ Achinta Hazra.pdf",
    },
    {
      name: "Internship Training Program on ADVANCE JAVA",
      issuer: "AUTODESK CADEASY",
      year: "2024",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/cadeasy_naooon.png",
      path: "/Advance Java.pdf",
    },
    {
      name: "Internship Training Program on CORE JAVA",
      issuer: "AUTODESK CADEASY",
      year: "2024",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/cadeasy_naooon.png",
      path: "/Full Stack Data Science using Python.pdf",
    },
    {
      name: "FULL STACK DATA SCIENCE USING PYTHON",
      issuer: "AUTODESK CADEASY",
      year: "2024",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/cadeasy_naooon.png",
      path: "/ML using Python.pdf",
    },
    {
      name: "MACHINE LEARNING USING PYTHON",
      issuer: "AUTODESK CADEASY",
      year: "2024",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/cadeasy_naooon.png",
      path: "/Advance Java.pdf",
    },
    {
      name: "IEEE Student Chapter",
      issuer: "The Institution Of Engineer",
      year: "2023",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346757/Institution_of_Engineers__India__Logo_lv3eix.svg",
      path: "/IEEE.pdf",
    },
    {
      name: "IEEE Seminar",
      issuer: "DIATM",
      year: "2023",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346757/Institution_of_Engineers__India__Logo_lv3eix.svg",
      path: "/IEI Seminar.pdf",
    },
  ];

  const openCertificatePopup = (cert) => {
    setSelectedCert(cert);
    setIsPopupOpen(true);
  };

  const closeCertificatePopup = () => {
    setIsPopupOpen(false);
    setSelectedCert(null);
  };

  // Handle ESC key to close popup
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeCertificatePopup();
    };
    if (isPopupOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isPopupOpen]);

  return (
    <section className="py-20 ">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-36">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <PinContainer
                title="CHECK CERTIFICATE"
                onClick={() => openCertificatePopup(cert)}
              >
                <div className="flex items-center mb-4">
                  <div className="w-[5vw] h-[12vh] flex items-center justify-center bg-blue-100 rounded-lg flex-shrink-0">
                    <img
                      src={cert.icon}
                      alt={cert.name}
                      className="w-fit h-fit rounded-lg object-contain"
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
