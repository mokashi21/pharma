import React, { useEffect, useState } from "react";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon, MenuIcon, XIcon } from "@heroicons/react/solid";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import doctorlogo from "../../Images/doctor.png";

const Dashboard = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCheckInStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3002/check-in-status", {
          headers: {
            "auth-token": localStorage.getItem("data"),
          },
        });
        if (response.data.checkInTime) {
          setCheckInTime(new Date(response.data.checkInTime));
          setIsCheckedIn(true);
        }
      } catch (error) {
        console.error("Error fetching check-in status:", error);
      }
    };

    fetchCheckInStatus();
  }, []);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem("data");
      try {
        const response = await axios.get("http://localhost:3002/all-doctors", {
          headers: {
            "auth-token": token,
          },
        });
        setDoctors(response.data);
        setFilteredDoctors(response.data); // Initialize filteredDoctors with all doctors
        console.log("response", response);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search query
// Filter doctors based on search query
useEffect(() => {
  const filtered = doctors.filter((doctor) => {
    const doctorName = doctor.doctorName ? doctor.doctorName.toLowerCase() : '';
    const speciality = doctor.speciality ? doctor.speciality.toLowerCase() : '';
    const visitType = doctor.visitType ? doctor.visitType.toLowerCase() : '';

    return (
      doctorName.includes(search.toLowerCase()) ||
      speciality.includes(search.toLowerCase()) ||
      visitType.includes(search.toLowerCase())
    );
  });
  setFilteredDoctors(filtered);
}, [search, doctors]);


  const today = new Date();
  const todayDayIndex = today.getDay();
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .delete("http://localhost:3002/logout", {
        headers: {
          "auth-token": localStorage.getItem("data"),
        },
      })
      .then((response) => {
        console.log(response.data.message);
        localStorage.removeItem("data");
        localStorage.removeItem("empId");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const trackLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          await axios.post(
            "http://localhost:3002/track-location",
            { latitude, longitude },
            {
              headers: {
                "auth-token": localStorage.getItem("data"),
              },
            }
          );
        } catch (error) {
          console.log("Error", error);
        }
      },
      () => {
        setLocationError("Error getting Location");
      }
    );
  };

  const handleCheckIn = async () => {
    const empId = localStorage.getItem("empId");

    if (!empId) {
      return toast.error("Employee ID not found. Please log in again.");
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/check-in",
        { checkIn: new Date(), empId },
        {
          headers: {
            "auth-token": localStorage.getItem("data"),
          },
        }
      );
      const checkInDate = new Date(response.data.checkIn);
      setCheckInTime(checkInDate);
      setIsCheckedIn(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    trackLocation();
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-blue-50">
      <aside className="w-full md:w-72 bg-white shadow-lg p-3 h-screen sticky top-0 flex-shrink-0">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-blue-900 mb-2">Calendar</h3>
          <div className="overflow-x-auto whitespace-nowrap">
            <div className="flex space-x-2">
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    index === todayDayIndex
                      ? "bg-yellow-200 text-blue-900"
                      : "bg-blue-200 text-blue-900"
                  } font-semibold`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 text-center text-blue-700 text-lg font-medium">
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by doctor name, speciality, or visit type"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">Doctors</h3>
          <ul className="space-y-4">
            {filteredDoctors.map((doctor, index) => (
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
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-blue-800 hover:text-blue-600 transition duration-300"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-900 hover:text-blue-700 transition duration-300"
            >
              Profile
            </Link>
          </div>

          <nav className="hidden md:flex space-x-5">
            <Menu as="div" className="relative">
              <Menu.Button className="inline-flex items-center px-1 text-lg font-medium text-blue-800 hover:text-blue-600 transition duration-300">
                Planning
                <ChevronDownIcon className="ml-2 h-5 w-5" />
              </Menu.Button>
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/mtp"
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-blue-100 text-blue-900" : "text-blue-700"
                      }`}
                    >
                      MTP
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/ep"
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-blue-100 text-blue-900" : "text-blue-700"
                      }`}
                    >
                      EP
                    </Link>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
            <Link
              to="/reports"
              className="text-lg font-medium text-blue-800 hover:text-blue-600 transition duration-300"
            >
              Reports
            </Link>
            <Link
              to="/doctor"
              className="text-lg font-medium text-blue-800 hover:text-blue-600 transition duration-300"
            >
              Doctors
            </Link>
            <button
              onClick={handleLogout}
              className="text-lg font-medium text-blue-800 hover:text-blue-600 transition duration-300"
            >
              Logout
            </button>
          </nav>
        </header>

        <main className="flex-grow p-6 bg-blue-100">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-blue-900 mb-6">Dashboard</h1>
            {isCheckedIn ? (
              <div>
                <p className="text-lg text-blue-700">Check-in time: {checkInTime?.toLocaleTimeString()}</p>
              </div>
            ) : (
              <button
                onClick={handleCheckIn}
                className="bg-blue-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
              >
                Check In
              </button>
            )}
            {locationError && <p className="text-red-500">{locationError}</p>}
          </div>
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Dashboard;
