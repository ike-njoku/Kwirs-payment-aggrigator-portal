"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import WorkFlowActivityTable from "../shared-components/table/WorkFlowActivity";
import WorkFlowActivityModal from "../shared-components/modals/WorkFlowActivityModal";
import { AxiosGet } from "../../services/http-service";

const WorkFlowActivityPage = () => {
  const [workflowActivities, setWorkflowActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userTIN, setUserTIN] = useState(null);
  const itemsPerPage = 10;

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchUserDetailsAndWFData = async () => {
    try {
      const authDetails = JSON.parse(localStorage.getItem("authDetails"));
      console.log("🚀 ~ authDetails from localStorage:", authDetails);

      if (authDetails?.tin) {
        setUserTIN(authDetails.tin);
        await fetchWorkflowActivities(authDetails.tin);
      } else {
        toast.error("User not found or TIN is missing.");
      }
    } catch (error) {
      console.error("Error reading authDetails from localStorage:", error);
      toast.error("Failed to load user information.");
    }
  };

  const closeModal = () => {
    setSelectedAction(null);
    setOpenModal(false);
  };

  const fetchWorkflowActivities = async (tin) => {
    setLoading(true);
    try {
      const res = await AxiosGet(
        `${API_BASE_URL}/api/WFlow/GetWAFActivity/${tin}`
      );
      if (res?.data?.StatusCode === 200) {
        console.log("✅ Workflow Activities:", res.data.Data);
        setWorkflowActivities(res.data.Data);
      } else {
        toast.error("Failed to fetch workflow activities.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching workflow activities.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAction = (action) => {
    setSelectedAction(action);
    setOpenModal(true);
  };

  const totalItems = workflowActivities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedActivities = workflowActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchUserDetailsAndWFData();
  }, []);

  return (
    <DashboardLayout page="Work Flow Activity">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="mt-4 flex gap-4 justify-between items-center"></div>
        </div>

        <WorkFlowActivityTable
          tableData={paginatedActivities}
          onEdit={handleEditAction}
        />

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className={`px-4 py-2 rounded border ${
                currentPage === 1 ? "bg-gray-300" : "bg-pumpkin text-white"
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-lg font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`px-4 py-2 rounded border ${
                currentPage === totalPages
                  ? "bg-gray-300"
                  : "bg-pumpkin text-white"
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {openModal && (
          <WorkFlowActivityModal
            onClose={() => closeModal()}
            refreshWorkflows={() => fetchWorkflowActivities(userTIN)}
            selectedActivity={selectedAction} // ✅ Updated prop name
            roles={roles}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default WorkFlowActivityPage;
