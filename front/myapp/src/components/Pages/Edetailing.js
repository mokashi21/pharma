import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    BriefcaseIcon,
    ArrowLeftIcon,
    AcademicCapIcon,
    HeartIcon,
    UserIcon,
    BeakerIcon,
    XCircleIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    HandIcon,
    SearchCircleIcon,
    ShieldExclamationIcon,
} from '@heroicons/react/solid';

import backgroundImage from "../../Images/green.jpg"

const specialties = [
    { name: "Cardiologist", icon: <HeartIcon className="w-8 h-8 text-blue-500" />, path : "/e-detailing-cardio" },
    { name: "Neurologist", icon: <AcademicCapIcon className="w-8 h-8 text-green-500" /> }, // Using AcademicCapIcon as an alternative
    { name: "Orthopedic", icon: <HandIcon className="w-8 h-8 text-red-500" /> },
    { name: "Oncologist", icon: <BeakerIcon className="w-8 h-8 text-yellow-500" /> },
    { name: "Pediatrician", icon: <UserIcon className="w-8 h-8 text-purple-500" /> },
    { name: "Dermatologist", icon: <ShieldCheckIcon className="w-8 h-8 text-gray-500" /> },
    { name: "Radiologist", icon: <XCircleIcon className="w-8 h-8 text-indigo-500" /> },
    { name: "Endocrinologist", icon: <AcademicCapIcon className="w-8 h-8 text-orange-500" /> },
    { name: "Gastroenterologist", icon: <GlobeAltIcon className="w-8 h-8 text-teal-500" /> },
    { name: "Hematologist", icon: <SearchCircleIcon className="w-8 h-8 text-brown-500" /> },
    { name: "Nephrologist", icon: <BriefcaseIcon className="w-8 h-8 text-blue-600" /> },
    { name: "Rheumatologist", icon: <ShieldExclamationIcon className="w-8 h-8 text-gray-600" /> },
    { name: "Urologist", icon: <HeartIcon className="w-8 h-8 text-red-600" /> },
];

const Edetailing = () => {
    const navigate = useNavigate(); // Initialize the navigate function

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };
    
  
  return (
    <div className="bg-cover bg-center min-h-screen overflow-auto"     style={{ backgroundImage: `url(${backgroundImage})` }}   >
     <button
        className="fixed top-4 left-4 p-2 bg-white rounded-full shadow-lg text-gray-800 hover:bg-gray-100 focus:outline-none"
        aria-label="Go Back"
        onClick={handleBackClick}
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
      <div className="p-4 md:p-8 lg:p-12 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 md:mb-8 lg:mb-12 font-sans">E- Detailing</h1>
        <div className="flex flex-wrap justify-between">

        {specialties.map((specialty, index) => (
            <Link
              key={index}
              to={specialty.path} // Set the path for navigation
              className="border border-gray-300 bg-white shadow-lg rounded-lg px-14 py-2 m-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-center transition-transform transform hover:scale-105 hover:border-blue-500 hover:shadow-xl"
            >
              <div className="mb-4 flex justify-center">
                {specialty.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">{specialty.name}</h3>
            </Link>
          ))}

        </div>
      </div>


      <div className="w-full text-center mt-8 px-4">
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

export default Edetailing;
