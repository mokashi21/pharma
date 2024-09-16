import React from 'react';
import { useNavigate } from 'react-router-dom';

const Doctor = () => {
  const navigate = useNavigate();

  return (
    <div className="py-8 flex justify-around">
      {/* Add Doctors Button */}
      <div className="bg-white rounded-lg shadow-lg w-52 max-h-28 p-4 border border-solid">
        <div className="flex justify-center items-center mb-4">
          <button
            onClick={() => navigate('/admin-dashboard-add-doctors')}
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Add Doctors</h3>
        </div>
      </div>

      {/* Update Doctors Button */}
      <div className="bg-white rounded-lg shadow-lg w-52 max-h-28 p-4 border border-solid">
        <div className="flex justify-center items-center mb-4">
          <button
            onClick={() => navigate('/update-doctor')}
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582a1 1 0 01.894.553L7.618 12h8.764l2.142-3.447A1 1 0 0119.418 8H20V4M12 20v-5h-.582a1 1 0 01-.894-.553L8.382 12H.618l-2.142 3.447A1 1 0 01.418 16H0v4"
              />
            </svg>
          </button>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Update Doctors</h3>
        </div>
      </div>

      {/* Delete Doctors Button */}
      <div className="bg-white rounded-lg shadow-lg w-52 max-h-28 p-4 border border-solid">
        <div className="flex justify-center items-center mb-4">
          <button
            onClick={() => navigate('/delete-doctor')}
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Delete Doctors</h3>
        </div>
      </div>

      {/* Doctors List Button */}
      <div className="bg-white rounded-lg shadow-lg w-52 max-h-28 p-4 border border-solid">
        <div className="flex justify-center items-center mb-4">
          <button
            onClick={() => navigate('/admin-dashboard-all-doctors')}
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Doctors List</h3>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
