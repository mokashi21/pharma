import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMapMarkerAlt, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Admin = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const token = localStorage.getItem('data');
        const response = await axios.get('http://localhost:3002/admin/medical-reps', {
          headers: {
            'auth-token': token
          }
        });
        setCheckIns(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An unexpected error occurred');
        }
      }
    };

    fetchCheckIns();
  }, []);

  const handleMapClick = (coordinates) => {
    const url = `https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`;
    window.open(url, '_blank');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Check-Ins List', 14, 16);

    const tableColumn = ['Employee ID', 'Email', 'Check-In Time', 'Location'];
    const tableRows = checkIns.map(checkIn => [
      checkIn.empId,
      checkIn.email,
      new Date(checkIn.checkInTime).toLocaleString(),
      `Point (${checkIn.location.coordinates[0]}, ${checkIn.location.coordinates[1]})`
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save('check-ins.pdf');
  };

  const downloadXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(
      checkIns.map(checkIn => ({
        'Employee ID': checkIn.empId,
        Email: checkIn.email,
        'Check-In Time': new Date(checkIn.checkInTime).toLocaleString(),
        Location: `Point (${checkIn.location.coordinates[0]}, ${checkIn.location.coordinates[1]})`
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Check-Ins');
    XLSX.writeFile(wb, 'check-ins.xlsx');
  };

  return (
    <div className="admin-container p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-amber-800 text-center">Check-Ins</h1>

      <div className="mb-4 flex justify-end space-x-2">
        <button
          onClick={downloadPDF}
          className="p-2 bg-red-500 text-white rounded-lg flex items-center hover:bg-red-600 transition-colors duration-300"
          aria-label="Download as PDF"
        >
          <FaFilePdf size={20} className="mr-2" />
          PDF
        </button>
        <button
          onClick={downloadXLSX}
          className="p-2 bg-green-500 text-white rounded-lg flex items-center hover:bg-green-600 transition-colors duration-300"
          aria-label="Download as XLSX"
        >
          <FaFileExcel size={20} className="mr-2" />
          XLSX
        </button>
      </div>

      {loading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300">
              <th className="py-3 px-4 text-left text-gray-600">Employee ID</th>
              <th className="py-3 px-4 text-left text-gray-600">Email</th>
              <th className="py-3 px-4 text-left text-gray-600">Check-In Time</th>
              <th className="py-3 px-4 text-left text-gray-600">Location</th>
            </tr>
          </thead>
          <tbody>
            {checkIns.length > 0 ? (
              checkIns.map((checkIn, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-300">
                  <td className="py-3 px-4 border-b text-gray-700">{checkIn.empId}</td>
                  <td className="py-3 px-4 border-b text-gray-700">{checkIn.email}</td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {new Date(checkIn.checkInTime).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700 flex items-center">
                    {`Point (${checkIn.location.coordinates[0]}, ${checkIn.location.coordinates[1]})`}
                    <button
                      onClick={() => handleMapClick(checkIn.location.coordinates)}
                      className="ml-3 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                      aria-label="View on map"
                    >
                      <FaMapMarkerAlt size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-4 border-b text-center text-gray-600">
                  No check-ins available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <ToastContainer />
    </div>
  );
};

export default Admin;
