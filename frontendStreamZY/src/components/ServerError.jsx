import React from "react";
import { useNavigate } from "react-router-dom";

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-[#121212]">
      <div className="text-center p-8 bg-white/90 dark:bg-[#1e1e1e] rounded-2xl shadow-lg max-w-md w-full">
        
        <h1 className="text-6xl font-bold text-red-500">500</h1>
        
        <h2 className="mt-4 text-2xl font-semibold text-slate-800 dark:text-white">
          Internal Server Error
        </h2>

        <p className="mt-2 text-slate-500 dark:text-gray-400">
          Something went wrong on our server. We're working to fix it.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}