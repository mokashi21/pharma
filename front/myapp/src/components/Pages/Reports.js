import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import axios from 'axios';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'; // Icons from react-icons
import { FlagIcon } from "@heroicons/react/outline";

import Doctor from '../Pages/Doctor';

const Reports = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]); // Track selected doctors
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem("data");
      try {
        const response = await axios.get('http://localhost:3002/all-doctors', {
          headers: {
            'auth-token': token,
          }
        });
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search
// Filter doctors based on search, ensuring undefined values are handled
const filteredDoctors = doctors.filter(doctor => {
    const doctorName = doctor?.prefix + ' ' + doctor?.doctorName;
    const speciality = doctor?.speciality || ''; 
    const visitType = doctor?.visitType || ''; 
  
    return (
      doctorName.toLowerCase().includes(search.toLowerCase()) ||
      speciality.toLowerCase().includes(search.toLowerCase()) ||
      visitType.toLowerCase().includes(search.toLowerCase())
    );
  });
  
  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  
  // Handle checkbox selection
  const handleDoctorSelect = (doctor) => {
    const isSelected = selectedDoctors.includes(doctor._id);
    if (isSelected) {
      setSelectedDoctors(selectedDoctors.filter(id => id !== doctor._id)); // Unselect
    } else {
      setSelectedDoctors([...selectedDoctors, doctor._id]); // Select
    }
  };

  // Send selected doctors to server
  const reportDoctors = async () => {
    const token = localStorage.getItem("data");
    console.log("token",token)
    try {
      await axios.post(
        'http://localhost:3002/report-doctors',
        { doctorIds: selectedDoctors },
        { headers: { 'auth-token': token } }
      );
      alert('Reported successfully');
    } catch (error) {
      console.error('Error reporting doctors:', error);
      alert('Failed to report');
    }
  };

  // Download as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("List of Doctors", 20, 10);
    filteredDoctors.forEach((doctor, index) => {
      doc.text(`${index + 1}. ${doctor.prefix} ${doctor.doctorName}, ${doctor.speciality}, ${doctor.visitType}`, 10, 20 + index * 10);
    });
    doc.save("doctors.pdf");
  };
  
  // Download as XLSX
  const downloadXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredDoctors.map(doctor => ({
      ...doctor,
      name: `${doctor.prefix} ${doctor.doctorName}`, // Combine prefix and name for XLSX
      visitType: doctor.visitType // Include visitType in XLSX
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doctors");
    XLSX.writeFile(workbook, "doctors.xlsx");
  };

  // Calculate totals
  const totalDoctors = doctors.length;

  return (
    <div>
      <Doctor />
      <div className="max-w-6xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">List of Doctors</h2>
        
        {/* Statistics */}
        <div className="mb-6 flex justify-around ">
          <p className="text-lg text-gray-700">Total Doctors: {totalDoctors}</p>
 
          <Link
  to="/reported-doctors"
  className="text-lg font-medium text-blue-800 hover:text-blue-600 transition duration-300"
>
  <FlagIcon className="h-6 w-6 inline-block" /> Reported Doctors
</Link>

        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by doctor name, speciality, or visit type"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mb-6">
          <button 
            onClick={downloadPDF}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Download PDF
          </button>
          <button 
            onClick={downloadXLSX}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Download XLSX
          </button>
          <button 
            onClick={reportDoctors}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Report Selected Doctors
          </button>
        </div>

        {/* Doctor List */}
        {currentDoctors.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {currentDoctors.map((doctor, index) => (
              <li 
                key={doctor._id} 
                className="py-4 hover:bg-gray-200 p-4 rounded-lg transition"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedDoctors.includes(doctor._id)}
                    onChange={() => handleDoctorSelect(doctor)}
                    className="mr-4"
                  />
                  <div>
                    <p className="font-semibold text-xl">{indexOfFirstDoctor + index + 1}. {doctor.prefix} {doctor.doctorName}</p>
                    <p className="text-gray-600">{doctor.speciality}</p>
                    <p className="text-gray-600">{doctor.visitType}</p> {/* Display visitType */}
                    <div className="flex items-center mt-2">
                      <FiPhone className="mr-2" />
                      <p>{doctor.mobileNumber}</p>
                    </div>
                    <div className="flex items-center mt-2">
                      <FiMail className="mr-2" />
                      <p>{doctor.email}</p>
                    </div>
                    <div className="flex items-center mt-2">
                      <FiMapPin className="mr-2" />
                      <p>{doctor.address}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No doctors added yet.</p>
        )}

        {/* Pagination */}
        {filteredDoctors.length > doctorsPerPage && (
          <div className="mt-6 flex justify-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-4 py-2 rounded-lg border border-gray-300 ${currentPage === index + 1 ? 'bg-indigo-500 text-white' : 'bg-white'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
