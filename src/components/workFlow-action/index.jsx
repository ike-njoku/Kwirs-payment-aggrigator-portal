"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import EditWorkFlowActivityModal from "../shared-components/modals/WorkFlowActivityModal";
import WorkFlowActionTable from "../shared-components/table/WorkFlowAction";
import WorkflowActionModal from "../shared-components/modals/WorkFlowActionModal";
import { AxiosGet } from "../../services/http-service";

const WorkFlowActionPage = () => {
  const [workflowActions, setWorkflowActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [roles, setRoles] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Fetch workflow actions
  const fetchWorkflowActions = async () => {
    setLoading(true);
    try {
      const res = await AxiosGet(`${API_BASE_URL}/api/WFlow/GetWFActions`);
      if (res?.data?.StatusCode === 200) {
        setWorkflowActions(res.data.Data);
      } else {
        toast.error("Failed to fetch workflow actions.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching workflow actions.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await AxiosGet(`${API_BASE_URL}/api/Role/GetAllRoles`);
      if (res?.data?.StatusCode === 200) {
        setRoles(res.data.Data);
      }
    } catch (error) {
      toast.error("Failed to fetch roles.");
    }
  };

  const handleDeleteAction = async (id) => {
    // const confirm = window.confirm("Are you sure you want to delete this workflow action?");
    // if (!confirm) return;

    try {
      const res = await AxiosGet(`${API_BASE_URL}/api/WFlow/DeleteWFAction/${id}`);
      if (res?.data?.StatusCode === 200) {
        toast.success("Workflow action deleted successfully!");
        fetchWorkflowActions();
      } else {
        toast.error(res?.data?.StatusMessage || "Failed to delete the action.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the workflow action.");
    }
  };

  const handleEditAction = (action) => {
    setSelectedAction(action);
    setOpenEditModal(true);
  };

  const tableHeadings = ["Role", "Type", "Stage", "Step"];
  const totalItems = workflowActions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedActions = workflowActions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchWorkflowActions();
    fetchRoles();
  }, []);

  return (
    <DashboardLayout page="Work Flow Actions">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="mt-4 flex gap-4 justify-between items-center">
            <button
              onClick={() => {
                setSelectedAction(null);
                setOpenModal(true);
              }}
              className="text-pumpkin border border-pumpkin px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium"
              disabled={loading}
            >
              {loading ? "Loading..." : "Create Work Flow Action"} <FaPlus />
            </button>
          </div>
        </div>

        <WorkFlowActionTable
          tableHeadings={tableHeadings}
          tableData={paginatedActions}
          onEdit={handleEditAction}
          onDelete={handleDeleteAction}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className={`px-4 py-2 rounded border ${currentPage === 1 ? "bg-gray-300" : "bg-pumpkin text-white"}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-lg font-medium">Page {currentPage} of {totalPages}</span>
            <button
              className={`px-4 py-2 rounded border ${currentPage === totalPages ? "bg-gray-300" : "bg-pumpkin text-white"}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {openEditModal && (
          <EditWorkFlowActivityModal
            isOpen={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedAction(null);
            }}
            selectedActivity={selectedAction}
            onUpdate={fetchWorkflowActions}
          />
        )}

      {/* Create Modal */}
{openModal && (
  <WorkflowActionModal
    isOpen={openModal}
    onClose={() => {
      setOpenModal(false);
      setSelectedAction(null);
    }}
    refreshWorkflows={fetchWorkflowActions} // ✅ renamed to match expected prop
  />
)}

      </section>
    </DashboardLayout>
  );
};

export default WorkFlowActionPage;
