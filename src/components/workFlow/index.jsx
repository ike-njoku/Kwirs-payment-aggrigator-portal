"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import RolePermissionTable from "../shared-components/table/PermissionTable";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { toast } from "react-toastify";
import { AxiosGet } from "../../services/http-service";
import { FaPlus } from "react-icons/fa";
import WorkflowModal from "../shared-components/modals/WorkFlowModal";

const WorkFlowPage = () => {
  const tableHeadings = ["Action"];
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [openWorkflowModal, setOpenWorkflowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  if (!API_BASE_URL) {
    toast.error("API Base URL is not defined!");
  }

  // Fetch Permissions and Resources
  const fetchPermissions = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Permissions`);
      setPermissions(response.data || []);
    } catch (error) {
      toast.error("Error fetching permissions.");
    }
  };

  const fetchResources = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Resources`);
      setResources(response.data || []);
    } catch (error) {
      toast.error("Error fetching resources.");
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchPermissions();
      await fetchResources();
      setLoading(false);
    };
    init();
  }, []);

  // Filter and Paginate Permissions
  const filteredPermissions = permissions
    .filter((perm) => perm.resourceId === selectedResourceId || selectedResourceId === "")
    .map((perm) => {
      const resource = resources.find((res) => res.ResourceId === perm.resourceId);
      return {
        ...perm,
        resourceName: resource ? resource.ResourceName : "Unknown Resource",
      };
    });

  // Pagination Logic
  const totalItems = filteredPermissions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedPermissions = filteredPermissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeletePermission = async (permissionId) => {
    if (!permissionId) {
      toast.error("Invalid permission ID.");
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/Permissions/${permissionId}`);

      if (response.status === 200) {
        toast.success("Permission deleted successfully!");
        await fetchPermissions();
      } else {
        toast.error("Failed to delete permission.");
      }
    } catch (error) {
      toast.error(error.response?.data?.StatusMessage || "Error deleting permission. Kindly contact the Admin.");
    }
  };

  const handleEditPermission = async (permission) => {
    if (!permission || !permission.Permissionid) {
      console.error("Error: No permission ID found for editing");
      toast.error("Error: No permission ID selected");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/Permissions/${permission.Permissionid}`);

      if (response.status === 200 && response.data) {
        const updatedPermission = response.data;

        setSelectedPermission({
          permissionCode: updatedPermission.permissionCode || "",
          description: updatedPermission.description || "",
          resourceId: updatedPermission.ResourceId || "",
          permissionId: updatedPermission.Permissionid || "",
        });
        setIsModalOpen(true);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      toast.error("Failed to fetch permission details");
    }
  };

  return (
    <DashboardLayout page="Work Flow">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            <div className="mt-4 flex gap-4 justify-between items-center">
              {/* Create Permission Button */}
              <button
                onClick={() => setOpenWorkflowModal(true)}
                className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2"
                disabled={loading}
              >
                {loading ? "Processing..." : "Create Work Flow"} <FaPlus />
              </button>
            </div>
          </div>
        </div>

        {/* Role Permission Table */}
        <RolePermissionTable
          tableHeadings={tableHeadings}
          tableData={paginatedPermissions}
          onDelete={handleDeletePermission}
          onEdit={handleEditPermission}
        />

        {/* Pagination Controls */}
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

        {/* Role Permission Modal for Creating */}
        {openWorkflowModal && (
          <WorkflowModal
            isOpen={openWorkflowModal}
            onClose={() => setOpenWorkflowModal(false)}
            refreshPermissions={fetchPermissions}
          />
        )}

        {/* Role Permission Modal for Editing */}
        {isModalOpen && (
          <WorkflowModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedPermission(null);
            }}
            selectedPermission={selectedPermission}
            refreshPermissions={fetchPermissions}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default WorkFlowPage;









