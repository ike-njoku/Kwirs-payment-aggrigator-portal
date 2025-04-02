"use client";

import { useState, useEffect } from "react";
import { AxiosGet, AxiosPost } from "../../../services/http-service";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";

const EditAgency = ({ isOpen, onClose, AgencyId, fetchAllAgencies }) => {
  const [agencyCode, setAgencyCode] = useState("");
  const [description, setDescription] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // ✅ Log AgencyId for debugging
  useEffect(() => {
    console.log("🟢 Inside EditAgency - Received AgencyId:", AgencyId);
  }, [AgencyId]);

  // ✅ Fetch TIN (UpdatedBy) from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("authDetails");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const loggedInTin = parsedUser?.tin;
          if (loggedInTin) {
            setUpdatedBy(loggedInTin);
          } else {
            toast.error("TIN not found. Please log in again.");
          }
        } else {
          toast.error("User data not found. Please log in again.");
        }
      } catch (error) {
        toast.error("Invalid user data.");
      }
    }
  }, []);

  // ✅ Fetch agency details when modal is open & AgencyId is valid
  useEffect(() => {
    if (!isOpen || !AgencyId) return;

    const agencyIdNumber = Number(AgencyId); // Convert to number
    if (!agencyIdNumber) {
      console.error("❌ Invalid AgencyId:", AgencyId);
      return;
    }

    console.log("🔄 Fetching agency details for AgencyId:", agencyIdNumber);
    setLoading(true);

    const fetchAgencyDetails = async () => {
      try {
        const response = await AxiosGet(
          `${API_BASE_URL}/api/Agencies/GetAllAgenciesPBYID/${agencyIdNumber}`
        );

        console.log("🔍 Full API Response Data:", response?.data);

        if (response?.data?.StatusCode === 200 && response?.data?.Data?.length > 0) {
          const agency = response.data?.Data[0]; // ✅ Extract first agency object
          console.log("🔍 Extracted Agency Object:", agency);

          if (agency) {
            setAgencyCode(agency?.agencyCode || "");
            setDescription(agency?.description || "");
            setIsActive(agency?.isActive ?? true);
          }
        } else {
          toast.error("No agency data found.");
        }
      } catch (error) {
        console.error("❌ Error fetching agency details:", error);
        toast.error("Error fetching agency details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgencyDetails();
  }, [isOpen, AgencyId]);

  // ✅ Handle update request
  const handleUpdateAgency = async (e) => {
    e.preventDefault();
    setLoading(true);

    const agencyIdNumber = Number(AgencyId);
    if (!agencyIdNumber) {
      toast.error("Invalid agency selected.");
      setLoading(false);
      return;
    }

    if (!updatedBy || !description || !agencyCode) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    const payload = {
      AgencyId: agencyIdNumber,
      UpdatedBY: updatedBy,
      AgencyCode: agencyCode,
      Dsecription: description, // ✅ Ensure correct spelling matches API
      isActive: isActive,
    };

    console.log("📤 Sending update request to:", `${API_BASE_URL}/api/Agencies/Update`);
    console.log("📤 Payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await AxiosPost(`${API_BASE_URL}/api/Agencies/Update`, payload);
      console.log("📩 Update Response:", response?.Data);

      if (response?.Status === 200 || response.StatusCode === 200) {
        toast.success(response.StatusMessage || "Agency updated successfully!");
        onClose(); // Close modal on success
        fetchAllAgencies();
      } else {
        toast.error(response.StatusMessage || "Update failed.");
      }
    } catch (error) {
      console.error("❌ Update error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Edit Agency
        </h3>

        <form className="w-full mt-4" onSubmit={handleUpdateAgency}>
          {/* ✅ Read-only field for UpdatedBy */}
          <div className="w-full mb-4">
            {/* <label className="text-base font-medium text-gray-700">
              Updated By (TIN)
            </label> */}
            <input
              type="hidden"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={updatedBy}
              readOnly
            />
          </div>

          {/* ✅ Agency Code Input */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">
              Agency Code
            </label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={agencyCode}
              onChange={(e) => setAgencyCode(e.target.value)}
              required
            />
          </div>

          {/* ✅ Description Input */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* ✅ IsActive Toggle Switch */}
          <div className="w-full mb-4 flex items-center justify-between">
            <span className="text-base font-medium text-gray-700">
              {isActive ? "Active" : "Inactive"}
            </span>
            <div
              className={`w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition ${
                isActive ? "bg-pumpkin" : "bg-gray-400"
              }`}
              onClick={() => setIsActive(!isActive)}
              aria-label="Toggle Active Status"
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
                  isActive ? "translate-x-7" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>

          {/* ✅ Update Button */}
          <button
            type="submit"
            className="w-full py-2 bg-pumpkin text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? "Processing..." : "Update Agency"}
          </button>
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditAgency;


















