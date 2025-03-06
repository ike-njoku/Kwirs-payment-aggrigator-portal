"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "../shared-components/table/RoleResources";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";
import RoleResourceModal from "../shared-components/modals/RoleResourceModal";
import EditRoleResourceModal from "../shared-components/modals/EditRoleResourceModal";
import { FaPlus, FaFilter } from "react-icons/fa";

const ResourcesAllocationPage = () => {
  const tableHeadings = ["Resource Name", "Actions"];
  const [roleResources, setRoleResources] = useState([]);
  const [roles, setRoles] = useState([]); 
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [openRoleResourceModal, setOpenRoleResourceModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRoleResource, setSelectedRoleResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchRoles = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Roles/GetAllRoles`);
      if (response?.data?.StatusCode === 200) {
        setRoles(response.data.Data || []);
      } else {
        setError("Could not fetch roles.");
      }
    } catch (error) {
      setError("Error fetching roles.");
    }
  };

 
  const fetchRoleResources = async () => {
    try {
      setLoading(true);

      if (!selectedRoleId) {
        setError("Please select a role.");
        setRoleResources([]);
        return;
      }

      const response = await AxiosGet(
        `${API_BASE_URL}/api/RoleResources/GetAllRoleResources/${selectedRoleId}`
      );

      if (response?.data?.StatusCode === 200) {
        setRoleResources(response.data.Data || []);
      } else {
        setError("Could not fetch role resources.");
      }
    } catch (error) {
      setError("Error fetching role resources.");
    } finally {
      setLoading(false);
    }
  };

   const fetchAllResources = async () => {
      const apiResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Resources/GetAllResource`
      );
  
      if (!apiResponse) {
        toast.error("Could not fetch resources");
        return;
      }
  
      const { data } = apiResponse;
      const tableData = data.Data || data.resources || [];
  
      if (!tableData.length) {
        toast.warn("No resources found");
        setTableData([]);
        return;
      }
  
      tableData.map((item) => (item.name = item.ResourceName));
      tableData.map((item) => (item.id = item.ResourceId));
  
      tableData.map((item) => (item.resourceType = item.ResourceTypeId));
      tableData.map(
        (item) =>
          (item.resourceType = item.ResourceTypeId == 1 ? MAIN_MENU : SUB_MENU)
      );
  
      tableData.map((item) => (item.resourceURL = item.URL));
  
      tableData.map(
        (item) =>
          (item.dateCreated = new Date(item.CreateDate)
            .toISOString()
            .split("T")[0])
      );
  
      setTableData(tableData);
    };

 
  const handleDeleteResource = async (permissionId) => {
    try {
      const deleteResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/RoleResources/RemoveResourcesFromRole/${permissionId}`
      );

      if (deleteResponse?.data?.StatusCode === 200) {
        toast.success("Delete Complete");

        setRoleResources((prevData) =>
          prevData.filter((item) => item.PermissionId !== permissionId)
        );
      } else {
        toast.error("Failed to delete resource");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the resource");
    }
  };


  const handleUpdateRoleResource = (resource) => {
    setSelectedRoleResource(resource);
    setOpenEditModal(true);
  };


  useEffect(() => {
    fetchRoles(); 
    fetchAllResources();
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      fetchRoleResources();
    } else {
      setRoleResources([]);
     }
  }, [selectedRoleId]);

  return (
    <DashboardLayout page="Resource Allocation">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="mt-4 flex gap-4 justify-between items-center">
      
            <button
              onClick={() => setOpenRoleResourceModal(true)}
              className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
              disabled={loading}
            >
              {loading ? "Processing..." : "Assign Resource to Role"}
              <FaPlus />
            </button>

                  <div className="relative">
              <select
                             className="text-gray focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                onChange={(e) => setSelectedRoleId(e.target.value)}
                value={selectedRoleId || ""}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.Id} value={role.Id}>
                    {role.Name}
                  </option>
                ))}
              </select>
              {/* <FaFilter className="absolute right-3 top-2 text-gray-500" /> */}
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
              tableData={roleResources}
              handleEdit={handleUpdateRoleResource}
              handleDelete={handleDeleteResource}
              loading={loading}
              error={error}
            />
          )}
        </div>

        {openRoleResourceModal && (
          <RoleResourceModal
            isOpen={openRoleResourceModal}
            onClose={() => setOpenRoleResourceModal(false)}
          />
        )}

        {openEditModal && selectedRoleResource && (
          <EditRoleResourceModal
            isOpen={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              fetchRoleResources();
            }}
            selectedRoleResource={selectedRoleResource}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default ResourcesAllocationPage;
