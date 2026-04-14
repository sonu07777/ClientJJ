import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        
        {/* Icon */}
        <div className="text-red-500 text-6xl mb-4">🚫</div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">403</h1>
        <h2 className="text-xl font-semibold mb-4">Access Denied</h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          You don’t have permission to access this page.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Go to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;