"use client";

import { useState, useEffect } from "react";
import { AxiosGet, AxiosPost } from "../../../services/http-service";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";

const EditAgency = ({ isOpen, onClose, selectedAgencyId }) => {
  const [agencyCode, setAgencyCode] = useState("");
  const [description, setDsecription] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  console.log("🟢 Received selectedAgencyId:", selectedAgencyId);

  // Auto-populate updatedBy from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("authDetails");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const loggedInUserId = parsedUser?.UserName || parsedUser?.tin || parsedUser?.email;
          if (loggedInUserId) {
            setUpdatedBy(loggedInUserId);
          } else {
            toast.error("User identifier not found.");
          }
        } else {
          toast.error("User data not found. Please log in again.");
        }
      } catch (error) {
        toast.error("Invalid user data.");
      }
    }
  }, []);

  // Fetch selected agency details when modal opens
  useEffect(() => {
    const fetchAgencyDetails = async () => {
      if (!selectedAgencyId) {
        console.warn("⚠️ No selectedAgencyId provided, skipping API call.");
        return;
      }

      setLoading(true);
      try {
        const response = await AxiosGet(`${API_BASE_URL}/api/Agencies/GetAgencyById/${selectedAgencyId}`);
        console.log("🔍 Agency Details Response:", response.data);

        if (response?.status === 200 && response.data?.StatusCode === 200) {
          const agency = response.data?.Data;
          if (agency) {
            setAgencyCode(agency.AgencyCode || "");
            setDsecription(agency.Dsecription || "");
            setIsActive(agency.isActive ?? true);
          } else {
            toast.error("Agency data is missing from the response.");
          }
        } else {
          toast.error(response.data?.StatusMessage || "Failed to fetch agency details.");
        }
      } catch (error) {
        toast.error("Error fetching agency details.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchAgencyDetails();
    }
  }, [isOpen, selectedAgencyId]);

  // Handle update request
  const handleUpdateAgency = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    if (!selectedAgencyId) {
      toast.error("Invalid agency selected.");
      setLoading(false);
      return;
    }

    if (!updatedBy || !description) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    const payload = {
      AgencyID: selectedAgencyId,
      UpdatedBy: updatedBy,
      Dsecription: description,
      isActive: isActive,
    };

    try {
      const response = await AxiosPost(`${API_BASE_URL}/api/Agencies/Update`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.StatusCode === 200) {
        toast.success(response.data.StatusMessage || "Agency updated successfully!");
        onClose();
      } else {
        toast.error(response?.data?.StatusMessage || "Update failed.");
      }
    } catch (error) {
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

          <input type="text" value={updatedBy} readOnly />

          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Description</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={description}
              onChange={(e) => setDsecription(e.target.value)}
              required
            />
          </div>

            {/* Is Active Toggle Switch */}
            <div className="w-full mb-4 flex items-center justify-between">
            <span className="text-base font-medium text-gray-700">
              {isActive ? "Active" : "Inactive"}
            </span>
            <div
              className={`w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition ${
                isActive ? "bg-pumpkin" : "bg-gray-400"
              }`}
              onClick={() => setIsActive(!isActive)}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
                  isActive ? "translate-x-7" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>

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











