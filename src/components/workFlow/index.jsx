"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import DashboardLayout from "../../components/shared-components/layouts/DashboardLayout";
import WorkFlowTable from "../../components/shared-components/table/WorkFlow";
import WorkflowModal from "../../components/shared-components/modals/WorkFlowModal";
import { AxiosGet } from "../../services/http-service";

const WorkFlowPage = () => {
  const tableHeadings = ["Document ID", "Type", "Description","Created By", "Created Date"];
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchWorkflows = async () => {
    try {
      const res = await AxiosGet(`${API_BASE_URL}/api/WFlow/GetWF`);
      if (res?.data?.StatusCode === 200) {
        const data = Array.isArray(res.data.Data) ? res.data.Data : [];
        setWorkflows(data);
      } else {
        toast.error(res?.data?.StatusMessage || "Failed to load workflows.");
      }
    } catch (error) {
      toast.error("Error fetching workflows.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const totalPages = Math.ceil(workflows.length / itemsPerPage);
  const paginatedData = workflows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteWorkflow = async (id) => {
    try {
      const res = await AxiosGet(`${API_BASE_URL}/api/WFlow/DeleteWF/${id}`);
      if (res?.data?.StatusCode === 200) {
        toast.success("Workflow deleted.");
        fetchWorkflows();
      } else {
        toast.error(res?.data?.StatusMessage || "Delete failed.");
      }
    } catch (error) {
      toast.error("Failed to delete workflow.");
    }
  };

  const handleEditWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setIsModalOpen(true);
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

        <WorkFlowTable
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


















