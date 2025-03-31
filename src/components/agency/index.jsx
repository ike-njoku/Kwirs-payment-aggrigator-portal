"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "../shared-components/table/Agencies";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";
import AgencyModal from "../shared-components/modals/AgencyModal";
import EditAgency from "../shared-components/modals/EditAgency";
import { FaPlus } from "react-icons/fa";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const AgenciesPage = ({ user }) => {
  const tableHeadings = ["Agency Code", "Description", "Action"];
  const [loading, setLoading] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [openAgencyModal, setOpenAgencyModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [error, setError] = useState("");
  const [activeAgencies, setActiveAgencies] = useState([]);

  const fetchAllAgencies = async () => {
    try {
      setLoading(true);
      const response = await AxiosGet(`${API_BASE_URL}/api/Agencies/GetAllAgencies`);

      console.log("✅ API Response (All Agencies):", response.data);

      if (response?.status === 200 && response.data?.StatusCode === 200) {
        setAgencies(response.data?.Data ?? []);
      } else {
        toast.error("Failed to fetch agencies.");
      }
    } catch (error) {
      toast.error("Error fetching agencies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAgencies();
  }, []);

  useEffect(() => {
    const fetchActiveAgencies = async () => {
      try {
        const response = await AxiosGet(`${API_BASE_URL}/api/Agencies/GetActiveAgencies`);
        console.log("✅ API Response (Active Agencies):", response);

        if (response?.status === 200 && response.data?.StatusCode === 200) {
          setActiveAgencies(response.data?.Data ?? []);
        } else {
          toast.error("Failed to fetch active agencies.");
        }
      } catch (error) {
        toast.error("Error fetching active agencies.");
      }
    };

    fetchActiveAgencies();
  }, []);

  // Handle Delete Click
  const handleDelete = async (agencyId) => {
    if (!agencyId) {
      toast.error("Invalid agency selected.");
      return;
    }

    try {
      console.log(`🚀 Sending DELETE request for AgencyId: ${agencyId}`);

      const response = await AxiosGet(`${API_BASE_URL}/api/Agencies/Delete/${agencyId}`);
      console.log("✅ Full API Response:", response);

      if (response?.data?.StatusCode === 200) {
        toast.success(response.data.StatusMessage || "Agency deleted successfully!");
        setAgencies((prev) => prev.filter((item) => item.AgencyId !== agencyId));
      } else {
        toast.error(response.data.StatusMessage || "Delete failed.");
      }
    } catch (error) {
      console.error("❌ Error deleting agency:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <DashboardLayout page="Agencies">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="mt-4 flex gap-4 justify-between items-center">
            <button
              onClick={() => setOpenAgencyModal(true)}
              className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
              disabled={loading}
            >
              {loading ? "Processing..." : "Create an Agency"}
              <FaPlus />
            </button>

            {/* Active Agencies Dropdown */}
            <div className="relative">
  <select
    className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin"
    onChange={(e) => {
      const agencyId = Number(e.target.value);
      const agency = agencies.find((a) => a.AgencyId === agencyId);
      setSelectedAgency(agency);
    }}
    value={selectedAgency?.AgencyId || ""}
  >
    <option value="">Active Agencies</option>
    {activeAgencies.length > 0 ? (
      activeAgencies.map((agency) => (
        <option key={agency.AgencyId} value={agency.AgencyId}>
          {agency.description}
        </option>
      ))
    ) : (
      <option disabled>No Agencies Found</option>
    )}
  </select>
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
              tableData={agencies}
              handleEdit={(AgencyId) => {
                const agency = agencies.find((a) => a.AgencyId === AgencyId);
                console.log("🟢 Selected Agency for Editing:", agency);
                setSelectedAgency(agency);
                setOpenEditModal(true);
              }}
              handleDelete={handleDelete} // Ensure delete works
              loading={loading}
              error={error}
            />
          )}
        </div>

        {openAgencyModal && (
          <AgencyModal isOpen={openAgencyModal} 
          onClose={() => setOpenAgencyModal(false)} 
          fetchAllAgencies={ fetchAllAgencies }
          />
        )}

        {openEditModal && selectedAgency && (
          <EditAgency
            isOpen={openEditModal}
            onClose={() => setOpenEditModal(false)}
            fetchAllAgencies={ fetchAllAgencies }
            AgencyId={selectedAgency?.AgencyId} // ✅ Fixed prop name
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default AgenciesPage;






