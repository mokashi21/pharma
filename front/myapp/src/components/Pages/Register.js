import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../Images/registerlogin.png";
import icons from "../../Images/icon.png";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCapsules } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    empId: "",
    email: "",
    password: "",
    role: "medical_rep",  // Default role
  });
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate form data
  const validateForm = () => {
    const { name, empId, email, password, role } = formData;
    
    if (!name || !empId || !password || !role) {
      toast.error("Name, Employee ID, Password, and Role are required!");
      return false;
    }

    if (role === "admin" && !email) {
      toast.error("Email is required for Admin role!");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (role === "admin" && !emailRegex.test(email)) {
      toast.error("Please enter a valid email address for Admin!");
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:3002/register", formData);
        console.log("Backend response:", response.data);
        toast.success("Registration successful!");

        // Reset form
        setFormData({
          name: "",
          empId: "",
          email: "",
          password: "",
          role: "medical_rep", // Reset to default
        });
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Registration failed! Please try again.");
        }
        console.error("Error:", error.response ? error.response.data : error.message);
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Your Company" src={icons} className="mx-auto h-14 w-auto" />
        <h2 className="mt-3 text-center text-4xl font-sans font-light leading-9 tracking-wider text-green-900">
          Register an Account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* EmpID */}
          <div>
            <label
              htmlFor="empId"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Employee ID
            </label>
            <div className="mt-2">
              <input
                id="empId"
                name="empId"
                type="text"
                placeholder="Enter EMP Id"
                value={formData.empId}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Email */}
          <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                placeholder="Enter Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showPassword ? (
                  <EyeOffIcon
                    className="h-5 w-5 text-gray-500 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <EyeIcon
                    className="h-5 w-5 text-gray-500 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Role
            </label>
            <div className="mt-2">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="medical_rep">Medical Representative</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="flex items-center w-full justify-center gap-2 rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <FontAwesomeIcon icon={faCapsules} className="h-5 w-5" />
              Register
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
