import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMapMarkerAlt, FaFilePdf, FaFileExcel } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const token = localStorage.getItem("data");
        const response = await axios.get(
          "http://localhost:3002/admin/medical-reps",
          {
            headers: {
              "auth-token": token,
            },
          }
        );
        setCheckIns(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    };

    fetchCheckIns();
  }, []);

  const handleMapClick = (coordinates) => {
    const url = `https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`;
    window.open(url, "_blank");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Check-Ins List", 14, 16);

    const tableColumn = ["Employee ID", "Email", "Check-In Time", "Location"];
    const tableRows = checkIns.map((checkIn) => [
      checkIn.empId,
      checkIn.email,
      new Date(checkIn.checkInTime).toLocaleString(),
      `Point (${checkIn.location.coordinates[0]}, ${checkIn.location.coordinates[1]})`,
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("check-ins.pdf");
  };

  const downloadXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(
      checkIns.map((checkIn) => ({
        "Employee ID": checkIn.empId,
        Email: checkIn.email,
        "Check-In Time": new Date(checkIn.checkInTime).toLocaleString(),
        Location: `Point (${checkIn.location.coordinates[0]}, ${checkIn.location.coordinates[1]})`,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Check-Ins");
    XLSX.writeFile(wb, "check-ins.xlsx");
  };

  const isTodayCheckIn = (checkInTime) => {
    const today = new Date();
    const checkInDate = new Date(checkInTime);
    return (
      checkInDate.getDate() === today.getDate() &&
      checkInDate.getMonth() === today.getMonth() &&
      checkInDate.getFullYear() === today.getFullYear()
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("data");
    toast.success("Logout successful. Redirecting...", {
      onClose: () => {
        setTimeout(() => {
          navigate("/"); // Redirect after 3 seconds
        }, 3000);
      },
    });
  };

  const openModal = (checkIn) => {
    setSelectedCheckIn(checkIn);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCheckIn(null);
  };

  // 
  const handleAdd = () => {
    navigate("/admin-dashboard-add-doctors")
  }

  return (
    <div className="admin-container p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-amber-800 text-center">
        Check-Ins
      </h1>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleLogout}
          className="p-2 px-8 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors duration-300"
        >
          Logout
        </button>
      </div>

      {/* Date Picker */}
      <div className="mb-4 flex justify-start">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="p-2 border border-gray-300 rounded-lg"
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className="mb-4 flex justify-start space-x-2">
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
      <hr className="my-4 border-gray-300" />

      {loading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300">
              <th className="py-3 px-4 text-left text-gray-600">Employee ID</th>
              <th className="py-3 px-4 text-left text-gray-600">Email</th>
              <th className="py-3 px-4 text-left text-gray-600">
                Check-In Time
              </th>
              <th className="py-3 px-4 text-left text-gray-600">Location</th>
            </tr>
          </thead>
          <tbody>
            {checkIns.length > 0 ? (
              checkIns
                .filter((checkIn) => {
                  const checkInDate = new Date(checkIn.checkInTime);
                  return (
                    checkInDate.getDate() === selectedDate.getDate() &&
                    checkInDate.getMonth() === selectedDate.getMonth() &&
                    checkInDate.getFullYear() === selectedDate.getFullYear()
                  );
                })
                .map((checkIn, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 transition-colors duration-300 ${
                      isTodayCheckIn(checkIn.checkInTime) ? "bg-green-100" : ""
                    }`}
                    onClick={() => openModal(checkIn)}
                  >
                    <td className="py-3 px-4 border-b text-gray-700">
                      {checkIn.empId}
                    </td>
                    <td className="py-3 px-4 border-b text-gray-700">
                      {checkIn.email}
                    </td>
                    <td className="py-3 px-4 border-b text-gray-700">
                      {new Date(checkIn.checkInTime).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 border-b text-gray-700 flex items-center">
                      {`Point (${checkIn.location.coordinates[0]}, ${checkIn.location.coordinates[1]})`}
                      <button
                        onClick={() =>
                          handleMapClick(checkIn.location.coordinates)
                        }
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
                <td
                  colSpan="4"
                  className="py-3 px-4 border-b text-center text-gray-600"
                >
                  No check-ins available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-screen w-full p-6">
            <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Check-In Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            {selectedCheckIn && (
              <div className=" flex justify-around ">
                <p>
                  <strong>Employee ID:</strong> {selectedCheckIn.empId}
                </p>
                <p>
                  <strong>Email:</strong> {selectedCheckIn.email}
                </p>
                <p>
                  <strong>Check-In Time:</strong>{" "}
                  {new Date(selectedCheckIn.checkInTime).toLocaleString()}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {`Point (${selectedCheckIn.location.coordinates[0]}, ${selectedCheckIn.location.coordinates[1]})`}
                </p>
              </div>
            )}
           
            <div className="flex justify-around py-8" onClick={handleAdd} >
              <div className="bg-white rounded-lg shadow-lg  w-52 max-h-24  p-2 border border-solid ">
                <div className="flex justify-center items-center mb-4">
                  <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Add Doctors
                  </h3>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg w-52 max-h-24  p-2  border border-solid">
                <div className="flex justify-center items-center mb-4">
                  <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582a1 1 0 01.894.553L7.618 12h8.764l2.142-3.447A1 1 0 0119.418 8H20V4m-8 16v-5h-.582a1 1 0 01-.894-.553L8.382 12H.618l-2.142 3.447A1 1 0 01.418 16H0v4"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Update Doctors
                  </h3>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg w-52 max-h-24 p-2  border border-solid">
                <div className="flex justify-center items-center mb-2">
                  <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Doctors
                  </h3>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg w-52 max-h-24 p-2  border border-solid">
                <div className="flex justify-center items-center mb-2">
                  <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Doctors List
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Admin;
