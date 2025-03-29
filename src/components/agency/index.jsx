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
  const tableHeadings = ["Created By", "Description", "Action"];
  const [loading, setLoading] = useState(false);
  const [selectedAgencyId, setSelectedAgencyId] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [openAgencyModal, setOpenAgencyModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [error, setError] = useState("");
  const [activeAgencies, setActiveAgencies] = useState([]);
  const [pbyidAgencies, setPbyidAgencies] = useState([]);



  useEffect(() => {
    const fetchAllAgencies = async () => {
      try {
        setLoading(true);
        const response = await AxiosGet(`${API_BASE_URL}/api/Agencies/GetAllAgencies`);
  
        console.log("API Response:", response.data); // ✅ Log full response
  
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
  
    fetchAllAgencies();
  }, []);
  

  // Fetch active agencies and filter them
  const fetchActiveAgencies = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Agencies/GetActiveAgencies`);
      
      console.log("Full API Response:", response); // Debugging step
  
      if (response?.status === 200 && response.data?.StatusCode === 200) {
        const agencies = response.data?.Data ?? []; // Safely access Data array
  
        // ✅ Filter active agencies
        const filteredAgencies = agencies.filter((agency) => agency.isActive);
  
        console.log("Filtered Active Agencies:", filteredAgencies); // Debugging step
  
        setActiveAgencies(filteredAgencies);
      } else {
        console.error("Unexpected response format:", response);
        toast.error("Failed to fetch active agencies.");
      }
    } catch (error) {
      console.error("Error fetching active agencies:", error);
      toast.error("Error fetching active agencies.");
    }
  };


  const fetchPBYIDAgencies = async (agencyId) => {
    if (!agencyId) {
      console.log("No AgencyId selected. Skipping API call.");
      return;
    }
  
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Agencies/GetAllAgenciesPBYID/${agencyId}`);
      console.log("API Response for PBYID Agencies:", response);
  
      if (response?.status === 200 && response.data?.StatusCode === 200) {
        const agencies = response.data?.Data ?? [];
        console.log("Fetched PBYID Agencies:", agencies);
        setPbyidAgencies(agencies);
      } else {
        console.error("Unexpected API response format:", response);
        toast.error("Failed to fetch PBYID agencies.");
      }
    } catch (error) {
      console.error("Error fetching PBYID agencies:", error);
      toast.error("Error fetching PBYID agencies.");
    }
  };
  
  
  
  // Fetch when agency is selected
  useEffect(() => {
    if (selectedAgencyId) {
      fetchPBYIDAgencies(selectedAgencyId);
    }
  }, [selectedAgencyId]);
  
   

  useEffect(() => {
    fetchActiveAgencies();
  }, []);

  const handleDelete = async (agencyId) => {
    if (!agencyId) {
      toast.error("Invalid agency selected.");
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this agency?")) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Session expired. Please log in again.");
          return;
        }
  
        // ✅ Using GET request for deletion
        const response = await AxiosGet(`${API_BASE_URL}/api/Agencies/Delete/${agencyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // ✅ Handle API response
        if (response?.data?.StatusCode === 200) {
          toast.success(response?.data?.StatusMessage || "Agency deleted successfully!");
          
          // ✅ Remove deleted agency from UI without refresh
          setAgencies((prev) => prev.filter((item) => item.AgencyId !== agencyId));
        } else {
          toast.error(response?.data?.StatusMessage || "Delete failed.");
        }
      } catch (error) {
        toast.error("Error deleting agency. Please try again.");
      }
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

            {/* Active Agencies Dropdown (Displaying Description Name) */}
            <div className="relative">
  <select
    className="text-gray focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
    onChange={(e) => setSelectedAgencyId(e.target.value)}
    value={selectedAgencyId || ""}
  >
    <option value="">Active Agencies</option>
    {activeAgencies.length > 0 ? (
      activeAgencies.map((agency) => (
        <option key={agency.AgencyId} value={agency.AgencyId}>
          {agency.description}
        </option>
      ))
    ) : (
      <option disabled>Loading agencies...</option>
    )}
  </select>
</div>

{/* <div className="relative">
  <select
    className="text-gray focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
    onChange={(e) => setSelectedAgencyId(e.target.value)}
    value={selectedAgencyId || ""}
  >
    <option value="">PBYID Agencies</option>
    {pbyidAgencies.length > 0 ? (
      pbyidAgencies.map((agency) => (
        <option key={agency.AgencyId} value={agency.AgencyId}>
          {agency.description}
        </option>
      ))
    ) : (
      <option disabled>No agencies found</option>
    )}
  </select>
</div> */}



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
  setSelectedAgency(AgencyId);
  setOpenEditModal(true);
}}

handleDelete={handleDelete} // ✅ Correctly passing the function

              loading={loading}
              error={error}
            />
          )}
        </div>

        {openAgencyModal && (
          <AgencyModal
            isOpen={openAgencyModal}
            onClose={() => setOpenAgencyModal(false)}
          />
        )}

{openEditModal && selectedAgency && (
  <EditAgency
    isOpen={openEditModal}
    onClose={() => setOpenEditModal(false)}
    selectedAgencyId={selectedAgency?.id} 
  />
)}

      </section>
    </DashboardLayout>
  );
};

export default AgenciesPage;



