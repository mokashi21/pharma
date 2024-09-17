import React, { useEffect, useState } from "react";
import axios from "axios";
import doctorlogo from "../../Images/doctor.png";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Reported = () => {
  const [reportedDoctors, setReportedDoctors] = useState([]);
  const [missedDoctors, setMissedDoctors] = useState([]);
  const [reportedPage, setReportedPage] = useState(1);
  const [missedPage, setMissedPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("data");
        const response = await axios.get("http://localhost:3002/reported-doctors", {
          headers: {
            "auth-token": token,
          },
        });
        setReportedDoctors(response.data.reportedDoctors);
        setMissedDoctors(response.data.missedDoctors);
      } catch (error) {
        console.error("Error fetching reported doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleExportPDF = (doctors, title) => {
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Name', 'Speciality', 'Visit Type']],
      body: doctors.map(doc => [doc.doctorName, doc.speciality, doc.visitType]),
    });
    doc.save(`${title}.pdf`);
  };

  const handleExportXLSX = (doctors, title) => {
    const csvData = [
      ['Name', 'Speciality', 'Visit Type'],
      ...doctors.map(doc => [doc.doctorName, doc.speciality, doc.visitType])
    ];

    return (
      <CSVLink
        data={csvData}
        filename={`${title}.xlsx`}
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Export as XLSX
      </CSVLink>
    );
  };

  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = (data) => Math.ceil(data.length / itemsPerPage);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Reported Doctors</h1>
      
      <div className="flex justify-between mb-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          onClick={() => handleExportPDF(getPaginatedData(reportedDoctors, reportedPage), "Reported Doctors")}
        >
          Export Reported as PDF
        </button>
        
        {handleExportXLSX(getPaginatedData(reportedDoctors, reportedPage), "Reported Doctors")}
        {handleExportXLSX(getPaginatedData(missedDoctors, missedPage), "Missed Doctors")}
        
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          onClick={() => handleExportPDF(getPaginatedData(missedDoctors, missedPage), "Missed Doctors")}
        >
          Export Missed as PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Reported</h2>
          <ul className="space-y-4">
            {getPaginatedData(reportedDoctors, reportedPage).map((doctor, index) => (
              <li
                key={index}
                className="flex items-center space-x-4 p-2 bg-blue-100 rounded-lg shadow-sm"
              >
                <img
                  src={doctorlogo}
                  alt={doctor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-blue-900 font-semibold">{doctor.doctorName}</p>
                  <p className="text-blue-600">{doctor.speciality}</p>
                  <p className="text-amber-600 font-light">{doctor.visitType}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center mt-4">
            <div className="flex space-x-2 mb-2">
              {Array.from({ length: totalPages(reportedDoctors) }, (_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded ${reportedPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-blue-200 text-blue-800'} hover:bg-blue-400 transition duration-300`}
                  onClick={() => setReportedPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex justify-center w-full">
              <button
                className=" text-black px-4 py-2 rounded hover:bg-blue-600 transition duration-300 disabled:opacity-100"
                disabled={reportedPage === 1}
                onClick={() => setReportedPage(reportedPage - 1)}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <button
                className=" text-black px-4 py-2 rounded hover:bg-blue-600 transition duration-300 disabled:opacity-100"
                disabled={reportedPage === totalPages(reportedDoctors)}
                onClick={() => setReportedPage(reportedPage + 1)}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Missed</h2>
          <ul className="space-y-4">
            {getPaginatedData(missedDoctors, missedPage).map((doctor, index) => (
              <li
                key={index}
                className="flex items-center space-x-4 p-2 bg-red-100 rounded-lg shadow-sm"
              >
                <img
                  src={doctorlogo}
                  alt={doctor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-red-900 font-semibold">{doctor.doctorName}</p>
                  <p className="text-red-600">{doctor.speciality}</p>
                  <p className="text-amber-600 font-light">{doctor.visitType}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center mt-4">
            <div className="flex space-x-2 mb-2">
              {Array.from({ length: totalPages(missedDoctors) }, (_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded ${missedPage === index + 1 ? 'bg-red-500 text-white' : 'bg-red-200 text-red-800'} hover:bg-red-400 transition duration-300`}
                  onClick={() => setMissedPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex justify-center w-full">
              <button
                className= "text-black px-4 py-2 rounded transition duration-300 disabled:opacity-100"
                disabled={missedPage === 1}
                onClick={() => setMissedPage(missedPage - 1)}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <button
                className=" text-black px-4 py-2 rounded transition duration-300 disabled:opacity-100"
                disabled={missedPage === totalPages(missedDoctors)}
                onClick={() => setMissedPage(missedPage + 1)}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reported;
