import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../Images/registerlogin.png"; // Same background image
import icons from "../../Images/icon.png"; // Same icon

const Login = () => {
  const [role, setRole] = useState("medical_rep");
  const [empId, setEmpId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = { role, empId, password };

    if (role === "admin") {
      loginData.email = email;
    }

    try {
      const response = await axios.post("http://localhost:3002/login", loginData); 
      console.log("response saved", response)
      const { token, empId} = response.data;
      localStorage.setItem("data", token); 
      localStorage.setItem("empId", empId); 

      toast.success("Login successful!");

      if (role === "admin") {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
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
          Login to Your Account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
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
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="medical_rep">Medical Rep</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Employee ID */}
          <div>
            <label
              htmlFor="empId"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Employee ID
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="empId"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter Employee ID"
              />
            </div>
          </div>

          {/* Email (Only for Admin) */}
          {role === "admin" && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter Email"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter Password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="flex items-center w-full justify-center gap-2 rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
