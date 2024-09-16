import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faList } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const AddDoctorForm = () => {
  const [formData, setFormData] = useState({
    doctorName: "",
    gender: "",
    address: "",
    mobileNumber: "",
    email: "",
    speciality: "",
    visitType: "", // New field
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleClick = async () => {
    if (
      !formData.doctorName ||
      !formData.gender ||
      !formData.address ||
      !formData.mobileNumber ||
      !formData.email ||
      !formData.speciality ||
      !formData.visitType // Check new field
    ) {
      alert("Please fill out all fields");
      return;
    }

    const token = localStorage.getItem("data");
    const empId = localStorage.getItem("empId");

    try {
      const response = await axios.post(
        "http://localhost:3002/admin-dashboard-add-doctors",
        { ...formData, empId },
        {
          headers: {
            "auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      // Clear form
      setFormData({
        doctorName: "",
        gender: "",
        address: "",
        mobileNumber: "",
        email: "",
        speciality: "",
        visitType: "", // Clear new field
      });

      alert("Doctor added successfully!");
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("Failed to add doctor");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <Link to="/dashboard">
          <FontAwesomeIcon
            icon={faHome}
            className="text-2xl text-blue-600 hover:text-blue-800"
          />
        </Link>
        <Link to="/admin-dashboard-all-doctors">
          <FontAwesomeIcon
            icon={faList}
            className="text-2xl text-blue-600 hover:text-blue-800"
          />
        </Link>
        <h2 className="text-2xl font-semibold text-gray-800">Add Doctor</h2>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prefix */}
        <div className="col-span-1">
          <label
            htmlFor="prefix"
            className="block text-sm font-medium text-gray-700"
          >
            Prefix
          </label>
          <select
            id="prefix"
            value={formData.prefix}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
          >
            <option value="">Select prefix</option>
            <option value="Dr.">Dr.</option>
          </select>
        </div>

        {/* Doctor Name */}
        <div className="col-span-1">
          <label
            htmlFor="doctorName"
            className="block text-sm font-medium text-gray-700"
          >
            Doctor Name
          </label>
          <input
            type="text"
            id="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            placeholder="Enter doctor name"
          />
        </div>

        {/* Gender */}
        <div className="col-span-1">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Address */}
        <div className="col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            placeholder="Enter address"
          />
        </div>

        {/* Mobile Number */}
        <div className="col-span-1">
          <label
            htmlFor="mobileNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            placeholder="Enter mobile number"
          />
        </div>

        {/* Email */}
        <div className="col-span-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            placeholder="Enter email"
          />
        </div>

        {/* Speciality */}
        <div className="col-span-2">
          <label
            htmlFor="speciality"
            className="block text-sm font-medium text-gray-700"
          >
            Speciality
          </label>
          <select
            id="speciality"
            value={formData.speciality}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
          >
            <option value="">Select Speciality</option>
            <option value="cardiologist">Cardiologist</option>
            <option value="dermatologist">Dermatologist</option>
            <option value="neurologist">Neurologist</option>
            <option value="pediatrician">Pediatrician</option>
            <option value="surgeon">Surgeon</option>
          </select>
        </div>

        {/* Visit Type */}
        <div className="col-span-2">
          <label
            htmlFor="visitType"
            className="block text-sm font-medium text-gray-700"
          >
            Visit Type
          </label>
          <select
            id="visitType"
            value={formData.visitType}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
          >
            <option value="">Select Visit Type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="col-span-2 flex justify-end">
          <button
            type="button"
            onClick={handleClick}
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctorForm;
