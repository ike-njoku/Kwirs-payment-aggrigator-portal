"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import RolePermissionTable from "../shared-components/table/RolePermissionTable";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { toast } from "react-toastify";
import { AxiosGet } from "../../services/http-service";
import { FaPlus } from "react-icons/fa";
import RolePermissionModal from "../shared-components/modals/RolePermissionModal";

const RolePermissionPage = () => {
  const tableHeadings = ["Permission", "Description", "Resource Name", "Actions"];
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [openPermissionModal, setOpenPermissionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [resources, setResources] = useState([]);
  const [permissionCode, setPermissionCode] = useState("");
  const [description, setDescription] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  if (!API_BASE_URL) {
    toast.error("API Base URL is not defined!");
  }

  // Fetch Resources
  const fetchResources = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Resources/GetAllResource`);
      if (response?.data?.StatusCode === 200) {
        setResources(response.data.Data || []);
      } else {
        toast.error("Could not fetch resources");
      }
    } catch (error) {
      toast.error("Error fetching resources");
    }
  };

  // Fetch Permissions
  const fetchPermissions = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Permissions/GetAllPermissions`);
      if (response?.data?.StatusCode === 200) {
        setPermissions(response.data.Data || []);
      } else {
        toast.error("Could not fetch permissions");
      }
    } catch (error) {
      toast.error("Error fetching permissions");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResources().then(fetchPermissions);
  }, []);

  // Handle Permission Assignment
  const handleAddRolePermission = async () => {
    if (!API_BASE_URL) {
      toast.error("API base URL is missing.");
      return;
    }

    try {
      const selectedResource = resources.find((res) => res.ResourceId == selectedResourceId);
      if (!selectedResource) {
        toast.error("Invalid Resource Name. Please select a valid resource.");
        return;
      }

      console.log("Selected Resource:", selectedResource);

      const payload = {
        permissionCode,
        description,
        ResourceId: parseInt(selectedResourceId, 10),
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/Permissions/Create`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.StatusCode === 200) {
        toast.success("Permission created successfully!");
        await fetchPermissions();

        setTimeout(() => {
          setSelectedResourceId("");
          setPermissionCode("");
          setDescription("");
          setOpenPermissionModal(false);
        }, 2000);
      } else {
        toast.error(response.data.StatusMessage || "Failed to create permission.");
      }
    } catch (error) {
      toast.error(error.response?.data?.StatusMessage || "Error creating permission.");
    }
  };

  // Filter and Paginate Permissions
  const filteredPermissions = permissions
    .filter((perm) => perm.resourceId == selectedResourceId || selectedResourceId === "")
    .map((perm) => {
      const resource = resources.find((res) => res.ResourceId == perm.resourceId);
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
        const response = await AxiosGet(`${API_BASE_URL}/api/Permissions/Delete/${permissionId}`);
        if (response.data?.StatusCode === 200) {
          toast.success("Permission deleted successfully!");
          fetchPermissions(); // ✅ Refresh table after deletion
        } else {
          toast.error(response.data?.StatusMessage || "Failed to delete permission.");
        }
      } catch (error) {
        console.error("Delete error:", error.response || error.message);
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
        const response = await axios.get(`/api/Permissions/${permission.Permissionid}`);
    
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
    <DashboardLayout page="Role Permission">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            <div className="mt-4 flex gap-4 justify-between items-center">
              
              {/* Assign Permission Button */}
              <button
                onClick={() => setOpenPermissionModal(true)}
                className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2"
                disabled={loading}
              >
                {loading ? "Processing..." : "Assign Permission"} <FaPlus />
              </button>

              {/* Resource Filter Dropdown */}
              <div className="relative">
                <select
                  className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin"
                  onChange={(e) => setSelectedResourceId(e.target.value)}
                  value={selectedResourceId}
                >
                  <option value="">Filter by Resource</option>
                  {resources.length > 0 ? (
                    resources.map((resource) => (
                      <option key={resource.ResourceId} value={resource.ResourceId}>
                        {resource.ResourceName}
                      </option>
                    ))
                  ) : (
                    <option disabled>No Resources Found</option>
                  )}
                </select>
              </div>
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

        {/* Role Permission Modal */}
        {openPermissionModal && (
          <RolePermissionModal
            isOpen={openPermissionModal}
            onClose={() => setOpenPermissionModal(false)}
            refreshPermissions={fetchPermissions}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default RolePermissionPage;

