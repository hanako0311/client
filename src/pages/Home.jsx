import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 dark:bg-gray-900 bg-white">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl">
        {/* Left Section with Title and Button */}
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
            Welcome to <span className="text-red-500">FindNest</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            The reliable platform for managing lost and found items efficiently.
          </p>
          <Link to="/report-form" className="inline-block mt-8">
            <button className="bg-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-red-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring focus:ring-red-300">
              Report Lost Item
            </button>
          </Link>
        </div>

        {/* Right Section with Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/lf.png"
            alt="FindNest Illustration"
            className="w-4/5 h-auto object-cover rounded-lg shadow-lg transform transition duration-500 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
