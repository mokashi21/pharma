import React from 'react';
import logo from "../../Images/logo.png";
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../../Images/background.jpg"; // Import the background image

const Home = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="flex flex-col items-center justify-between min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }} // Inline background image style
    >
      {/* Logo and Buttons Section */}
      <div className="flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="my-14">
          <img
            src={logo}
            alt="Company Logo"
            className="w-32 h-32 md:w-48 md:h-48 object-contain"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 w-48"
            onClick={handleRegister}
          >
            Register
          </button>
          <button
            className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 w-48"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full text-center mt-12 px-4">
        {/* Horizontal Line */}
        <hr className="border-gray-300 w-full my-6" />

        {/* Footer Text */}
        <p className="text-gray-500 text-xs">
          &copy; 2024 Pharma Company. All rights reserved.
        </p>
        <p className="text-gray-500 text-xs">
          Pharma Company | 1234 Medical Street, Health City, Country
        </p>
      </div>
    </div>
  );
};

export default Home;
