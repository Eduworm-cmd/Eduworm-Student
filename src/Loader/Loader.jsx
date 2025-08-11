import React from 'react';

const Loader = ({ variant = 'spinner', message = 'Loading' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Shared Spinner Logo */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-spin-slow"></div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin-reverse"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">Edu</span>
          </div>
        </div>
      </div>

      {variant === 'spinner' ? (
        <div className="flex items-center space-x-1">
          <p className="text-lg font-semibold text-blue-600">{message}</p>
          <div className="flex space-x-1 mt-3">
            <div
              className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-blue-700 tracking-wide">
            Eduworm
          </h1>
          <p className="text-sm text-gray-500 mt-1">Learning Made Simple</p>

          {/* Message + Dots */}
          <div className="flex items-center space-x-2 mt-4">
            <p className="text-sm text-gray-600">{message}</p>
            <div className="flex space-x-1">
              <div
                className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              ></div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 1.4s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.4s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-reverse {
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
