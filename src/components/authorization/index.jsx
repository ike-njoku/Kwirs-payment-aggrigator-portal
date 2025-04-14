"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../shared-components/table/AuthorizationTable";
import EditAuthorization from "../shared-components/modals/EditAuthorization";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { toast } from "react-toastify";
import { AxiosGet } from "../../services/http-service";
import { FaPlus } from "react-icons/fa";
import AuthorizationModal from "../shared-components/modals/AuthorizationModal";

const AuthorizationPage = () => {
  const tableHeadings = ["Tin", "Agency", " Tax yPayer", "Action"];
  const [selectedAgencyCode, setSelectedAgencyCode] = useState("");
  const [openPermissionModal, setOpenPermissionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAuthorization, setSelectedAuthorization] = useState(null);
  const [error, setError] = useState("");
  const [agencies, setAgencies] = useState([]);
  const [authorizations, setAuthorizations] = useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  if (!API_BASE_URL) {
    toast.error("API Base URL is not defined!");
  }

  // ✅ Fetch Agencies & Get AgencyCode
  const fetchAgencies = async () => {
    try {
      const response = await AxiosGet(
        `${API_BASE_URL}/api/Agencies/GetAllAgencies`
      );
      if (response?.data?.StatusCode === 200) {
        setAgencies(response.data.Data || []);
      } else {
        toast.error("Could not fetch agencies");
        setAgencies([]);
      }
    } catch (error) {
      toast.error("Error fetching agencies");
    }
  };

  // ✅ Fetch Authorizations
  const fetchAuthorizations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Get auth token

      if (!token) {
        toast.error("You are not authenticated. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await AxiosGet(
        `${API_BASE_URL}/api/DLAuthorization/GetAllAuthorization`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.StatusCode === 200) {
        setAuthorizations(response.data.Data || []);
      } else {
        setError("Failed to fetch authorizations.");
      }
    } catch (error) {
      setError("Could not fetch authorizations.");
    } finally {
      setLoading(false);
    }
  };

  const getAgencyById = async (agencyId) => {
    if (!agencyId) {
      return;
    }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Agencies/GetAllAgenciesPBYID/${agencyId}`
      );
      if (response?.data?.StatusCode === 200) {
        return response.data.Data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    fetchAgencies();
    fetchAuthorizations(); // Fetch all authorizations initially
  }, []);

  useEffect(() => {
    if (selectedAgencyCode) {
      handleSelectedAgencyCode({ target: { value: selectedAgencyCode } });
    }
  }, [selectedAgencyCode]);

  const handleSelectedAgencyCode = (e) => {
    const selectedAgency = e.target.value;
    setSelectedAgencyCode(selectedAgency);

    if (selectedAgency) {
      // Filter authorizations by selected agency
      const filteredAuthorizations = authorizations.filter(
        (auth) => auth.agencyId == selectedAgency
      );
      setAuthorizations(filteredAuthorizations);
    } else {
      // If no agency is selected, reset the authorizations list
      fetchAuthorizations();
    }
  };

  // ✅ Handle Edit Click (Fixing Modal Issue)
  const handleEditAuthorization = (authorizationId) => {
    if (!authorizationId) {
      return;
    }

    const authorization = authorizations.find(
      (auth) => auth.authorizationId === authorizationId
    );

    if (!authorization) {
      return;
    }

    // ✅ Ensure selectedAuthorization updates before opening modal
    setSelectedAuthorization(authorization);
    setTimeout(() => setOpenEditModal(true), 100); // Delay to ensure state is updated
  };

  // ✅ Delete Authorization
  const handleDeleteAuthorization = async (authorizationId) => {
    if (!authorizationId) {
      toast.error("Invalid authorization ID.");
      return;
    }

    try {
      const response = await AxiosGet(
        `${API_BASE_URL}/api/DLAuthorization/Delete/${authorizationId}`
      );
      if (response?.data?.StatusCode === 200) {
        toast.success("Authorization deleted successfully!");
        await fetchAuthorizations();
      } else {
        toast.error(
          response.data?.StatusMessage || "Failed to delete authorization."
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.StatusMessage ||
          "Error deleting authorization. Kindly contact the Admin."
      );
    }
  };

  return (
    <DashboardLayout page="Create Authorization">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            <div className="mt-4 flex gap-4 justify-between items-center">
              {/* Create Authorization Button */}
              <button
                onClick={() => setOpenPermissionModal(true)}
                className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2"
                disabled={loading}
              >
                {loading ? "Processing..." : "Create Authorization"} <FaPlus />
              </button>

              {/* ✅ Agency Code Filter Dropdown */}
              {/* <div className="relative">
                <select
                  className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin"
                  onChange={handleSelectedAgencyCode}
                  value={selectedAgencyCode}
                >
                  <option value="">Filter by Agency</option>
                  {agencies.map((agency) => (
                      <option key={agency.AgencyId} value={agency.AgencyId}>
                        {agency.description}
                      </option>
                    ))}
                </select>
              </div> */}
            </div>
          </div>
        </div>
        <div className="w-[90%] mx-auto mt-6">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <CustomTable
              tableHeadings={tableHeadings}
              tableData={authorizations}
              handleEdit={(authorizationId) => {
                handleEditAuthorization(authorizationId);
              }}
              handleDelete={handleDeleteAuthorization}
              loading={loading}
              error={error}
            />
          )}
        </div>

        {/* ✅ Authorization Modal */}
        {openPermissionModal && (
          <AuthorizationModal
            isOpen={openPermissionModal}
            onClose={() => setOpenPermissionModal(false)}
            refreshPermissions={fetchAuthorizations}
          />
        )}

        {openEditModal && selectedAuthorization && (
          <EditAuthorization
            isOpen={openEditModal}
            onClose={() => setOpenEditModal(false)}
            fetchAuthorizations={fetchAuthorizations}
            authorizationId={selectedAuthorization?.authorizationId} // ✅ Fixed prop name
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default AuthorizationPage;
