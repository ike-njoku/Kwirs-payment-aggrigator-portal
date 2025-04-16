"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

import { AxiosGet } from "../../services/http-service";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import RolePermissionTable from "../shared-components/table/PermissionTable";
import WorkflowModal from "../shared-components/modals/WorkFlowModal";

const WorkFlowPage = () => {
  const tableHeadings = ["Action"];
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchWorkflows = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/WFlow/GetWFActions`);
      const data = Array.isArray(response.data) ? response.data : [];
      setWorkflows(data);

      // Ensure currentPage is valid if data changes
      const newTotalPages = Math.ceil(data.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(1);
      }
    } catch (error) {
      toast.error("Failed to fetch workflow actions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const totalPages = Math.ceil(workflows.length / itemsPerPage);
  const paginatedData = workflows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteWorkflow = async (id) => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/WFlow/DeleteWFAction/${id}`);
      if (response?.data?.StatusCode === 200) {
        toast.success("Workflow action deleted!");
        fetchWorkflows();
      } else {
        toast.error(response?.data?.StatusMessage || "Failed to delete action.");
      }
    } catch (error) {
      toast.error("Delete failed. Please try again.");
    }
  };

  const handleEditWorkflow = async (workflow) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/WFlow/GetWFActions/${workflow.WF_ActionId}`);
      if (response?.status === 200 && response?.data) {
        setSelectedWorkflow(response.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      toast.error("Failed to load workflow details.");
    }
  };

  return (
    <DashboardLayout page="Work Flow">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2"
              disabled={loading}
            >
              {loading ? "Processing..." : "Create Work Flow"} <FaPlus />
            </button>
          </div>
        </div>

        <RolePermissionTable
          tableHeadings={tableHeadings}
          tableData={paginatedData}
          onDelete={handleDeleteWorkflow}
          onEdit={handleEditWorkflow}
        />

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className={`px-4 py-2 rounded border ${currentPage === 1 ? "bg-gray-300" : "bg-pumpkin text-white"}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-lg font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`px-4 py-2 rounded border ${currentPage === totalPages ? "bg-gray-300" : "bg-pumpkin text-white"}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {isModalOpen && (
          <WorkflowModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedWorkflow(null);
            }}
            selectedWorkflow={selectedWorkflow}
            refreshData={fetchWorkflows}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default WorkFlowPage;












