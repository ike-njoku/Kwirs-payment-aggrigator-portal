"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import WorkFlowActivityTable from "../shared-components/table/WorkFlowActivity";
import EditWorkFlowActivityModal from "../shared-components/modals/EditWorkFlowActivityModal";
import { AxiosGet, AxiosDelete } from "../../services/http-service";

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

  const fetchWorkflowActivities = async (tin) => {
    setLoading(true);
    try {
      const res = await AxiosGet(`${API_BASE_URL}/api/WFlow/GetWAFActivity/${tin}`);
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

  // const fetchRoles = async () => {
  //   try {
  //     const res = await AxiosGet(`${API_BASE_URL}/api/Role/GetAllRoles`);
  //     if (res?.data?.StatusCode === 200) {
  //       setRoles(res.data.Data);
  //     }
  //   } catch (error) {
  //     toast.error("Failed to fetch roles.");
  //   }
  // };

  // const handleDeleteAction = async (id) => {
  //   const confirm = window.confirm("Are you sure you want to delete this workflow activity?");
  //   if (!confirm) return;

  //   try {
  //     const res = await AxiosDelete(`${API_BASE_URL}/api/WFlow/DeleteWFAction/${id}`);
  //     if (res?.data?.StatusCode === 200) {
  //       toast.success("Workflow activity deleted!");
  //       fetchWorkflowActivities(userTIN);
  //     } else {
  //       toast.error(res?.data?.StatusMessage || "Failed to delete activity.");
  //     }
  //   } catch (error) {
  //     toast.error("Delete failed. Please try again.");
  //   }
  // };

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
    // fetchRoles();
  }, []);

  return (
    <DashboardLayout page="Work Flow Activities">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="mt-4 flex gap-4 justify-between items-center">
            {/* <button
              onClick={() => {
                setSelectedAction(null);
                setOpenModal(true);
              }}
              className="text-pumpkin border border-pumpkin px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium"
              disabled={loading}
            >
              {loading ? "Loading..." : "Create Work Flow Action"} <FaPlus />
            </button> */}
          </div>
        </div>

        <WorkFlowActivityTable
          tableData={paginatedActivities}
          onEdit={handleEditAction}
          // onDelete={handleDeleteAction}
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
                currentPage === totalPages ? "bg-gray-300" : "bg-pumpkin text-white"
              }`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {openModal && (
          <EditWorkFlowActivityModal
            isOpen={openModal}
            onClose={() => {
              setOpenModal(false);
              setSelectedAction(null);
            }}
            refreshWorkflows={() => fetchWorkflowActivities(userTIN)}
            selectedAction={selectedAction}
            roles={roles}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default WorkFlowActivityPage;





