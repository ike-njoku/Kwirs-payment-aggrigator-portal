"use client";

import React, { useState, useEffect } from "react";
import { AxiosPost, AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const AuthorizationModal = ({ isOpen, onClose, refreshPermissions }) => {
  const [authorizationCode, setAuthorizationCode] = useState("");
  const [TIN, setTIN] = useState(""); // Manually inputted
  const [taxpayerName, setTaxpayerName] = useState(""); // Manually inputted
  const [selectedAgencyId, setSelectedAgencyId] = useState(""); // Agency selection
  const [createdBy, setCreatedBy] = useState(""); // Auto-populated from logged-in user
  const [agencies, setAgencies] = useState([]);
  const [selectedAgencyDetails, setSelectedAgencyDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // ✅ Fetch logged-in user's TIN for `createdBy`
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("authDetails");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const loggedInUserTIN = parsedUser?.tin;

          if (loggedInUserTIN) {
            setCreatedBy(loggedInUserTIN);
          } else {
            toast.error("User TIN not found. Please log in again.");
          }
        } else {
          toast.error("User data not found. Please log in again.");
        }
      } catch (error) {
        toast.error("Invalid user data. Please log in again.");
      }
    }
  }, []);

  // ✅ Fetch all agencies
  const fetchAgencies = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Agencies/GetAllAgencies`);
      if (response?.data?.StatusCode === 200) {
        setAgencies(response.data.Data || []);
      } else {
        setAgencies([]);
        toast.error("Could not fetch agencies.");
      }
    } catch (error) {
      console.error("❌ Error fetching agencies:", error);
      toast.error("Error fetching agencies.");
    }
  };

  // ✅ Fetch agency details by ID
  const fetchAgencyById = async (agencyId) => {
    if (!agencyId) {
      setSelectedAgencyDetails(null);
      return;
    }

    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Agencies/GetAllAgenciesPBYID/${agencyId}`);

      if (response?.data?.StatusCode === 200) {
        setSelectedAgencyDetails(response.data.Data);
      } else {
        setSelectedAgencyDetails(null);
        toast.error(response?.data?.StatusMessage || "Agency not found.");
      }
    } catch (error) {
      console.error("❌ Error fetching agency:", error);
      setSelectedAgencyDetails(null);
      toast.error("Error fetching agency.");
    }
  };

  // ✅ Fetch data when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAgencies();
    }
  }, [isOpen]);

  // ✅ Fetch agency details when `selectedAgencyId` changes
  useEffect(() => {
    if (selectedAgencyId) {
      fetchAgencyById(selectedAgencyId);
    }
  }, [selectedAgencyId]);

  // ✅ Handle Authorization Creation
  const handleCreateAuthorization = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!createdBy) {
      toast.error("Invalid user details. Please log in again.");
      setLoading(false);
      return;
    }

    if (!authorizationCode || !TIN || !taxpayerName || !selectedAgencyId) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    const authorizationData = {
      authorizationCode,
      TIN,
      taxpayername: taxpayerName,
      agencyId: selectedAgencyId ? parseInt(selectedAgencyId, 10) : null, // Ensure a valid number
      createdBy,
    };

    console.log("🚀 Sending API request with:", authorizationData);

    try {
      const response = await AxiosPost(`${API_BASE_URL}/api/DLAuthorization/Create`, authorizationData);
      console.log("✅ Full API Response:", response);

      if (!response || response.StatusCode !== 200) {
        toast.error(response?.StatusMessage || "Failed to create authorization.");
        return;
      }

      toast.success(response.StatusMessage || "Authorization created successfully!");

      // ✅ Refresh data
      refreshPermissions();

      // ✅ Reset fields
      setAuthorizationCode("");
      setTIN("");
      setTaxpayerName("");
      setSelectedAgencyId("");
      setSelectedAgencyDetails(null);

      // ✅ Close modal if `onClose` exists
      if (typeof onClose === "function") {
        onClose();
      }
    } catch (error) {
      console.error("❌ Error creating authorization:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Create Authorization
        </h3>

        <form className="w-full mt-4" onSubmit={handleCreateAuthorization}>
          {/* Authorization Code */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Authorization Code</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
              value={authorizationCode}
              onChange={(e) => setAuthorizationCode(e.target.value)}
              placeholder="Enter Authorization Code"
              required
            />
          </div>

          {/* Manually Inputted TIN */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Taxpayer Identification Number (TIN)</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
              value={TIN}
              onChange={(e) => setTIN(e.target.value)}
              placeholder="Enter TIN"
              required
            />
          </div>

          {/* Manually Inputted Taxpayer Name */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Taxpayer Name</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
              value={taxpayerName}
              onChange={(e) => setTaxpayerName(e.target.value)}
              placeholder="Enter Taxpayer Name"
              required
            />
          </div>

          {/* Select Agency Dropdown */}
          <div className="w-full mb-4">
  <label className="text-base font-medium text-gray-700">Agency</label>
  <select
    className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
    value={selectedAgencyId}
    onChange={(e) => setSelectedAgencyId(e.target.value)}
    required
  >
    <option value="">Select Agency</option>
    {agencies.map((agency) => (
      <option key={agency.AgencyId} value={agency.AgencyId}>
        {agency.description}
      </option>
    ))}
  </select>
</div>


          {/* Submit Button */}
          <AuthButtons label={loading ? "Creating..." : "Create Authorization"} textColor="text-white" isLoading={loading} disabled={!authorizationCode || !TIN || !taxpayerName || !selectedAgencyId} />
        </form>
      </div>
    </ModalLayout>
  );
};

export default AuthorizationModal;















