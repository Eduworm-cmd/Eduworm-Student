import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #000 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #000 2px, transparent 2px)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* Subtle mouse follower */}
      <div
        className="fixed w-64 h-64 pointer-events-none z-10 opacity-3"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 0, 0, 0.02) 0%, transparent 70%)',
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
          transition: 'all 0.2s ease-out',
        }}
      />

      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-light text-gray-800 mb-4 tracking-tight">
              404
            </h1>
            <div className="w-24 h-0.5 bg-gray-800 mx-auto"></div>
          </div>

          {/* Error Message */}
          <div className="mb-12 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-gray-700 leading-tight">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed max-w-md mx-auto">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="group px-8 py-3 bg-gray-900 text-white rounded-sm font-medium transition-all duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
              <div className="flex items-center" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </div>
            </button>

            <button className="group px-8 py-3 border border-gray-300 text-gray-700 rounded-sm font-medium transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
              <div className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" onClick={() => navigate(-1)}/>
                Go Back
              </div>
            </button>

            <button className="group px-8 py-3 text-gray-600 rounded-sm font-medium transition-all duration-200 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
              <div className="flex items-center">
                <Search className="w-4 h-4 mr-2" />
                Search Site
              </div>
            </button>
          </div>

          {/* Help Links */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500 mb-4">
              You might find these helpful:
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Contact Support
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Site Map
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200 underline-offset-4 hover:underline"
              >
                FAQ
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Documentation
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Error Code: 404 | Page Not Found
            </p>
          </div>
        </div>
      </div>

      {/* Minimal decorative element */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
    </div>
  );
}
