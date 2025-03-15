"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "../shared-components/table/RoleResources";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";
import RolePermissionTable from "../shared-components/table/RolePermissions";
import PermissionAllocationModal from "../shared-components/modals/PermissionAllocationModal";
import EditRoleResourceModal from "../shared-components/modals/EditRoleResourceModal";
import { FaPlus } from "react-icons/fa";
import { MAIN_MENU, SUB_MENU } from "../../utils/constants";

const PermissionAllocationPage = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [roleResources, setRoleResources] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [openRoleResourceModal, setOpenRoleResourceModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRoleResource, setSelectedRoleResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchRoles();
    // fetchAllResources();
    fetchPermissions();
    fetchPermissionCode();
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      fetchRolePermissions(selectedRoleId);
      fetchRoleResources(selectedRoleId);
    } else {
      setTableData([]);
      setRoleResources([]);
    }
  }, [selectedRoleId]);


  /** Fetch all permissions */
const fetchPermissions = async () => {
  try {
    const response = await AxiosGet(`${API_BASE_URL}/api/Permissions/GetAllPermissions`);
    setPermissions(response?.data?.Data || []);
  } catch (error) {
    toast.error("Error fetching permissions.");
  }
};


  /** Fetch all roles */
  const fetchRoles = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Roles/GetAllRoles`);
      setRoles(response?.data?.Data || []);
    } catch (error) {
      setError("Error fetching roles.");
    }
  };

  const fetchPermissionCode = async (permissionId) => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Permissions/GetAllPermissions`);
      const permissions = response?.data?.Data || [];
  
      console.log("Searching for permissionId:", permissionId); 
      console.log("Available Permissions:", permissions); 
  
      const permission = permissions.find((p) => Number(p.permissionId) === Number(permissionId));
  
      console.log("Matched Permission:", permission); 
  
      return permission ? permission.permissionCode : "Unknown";
    } catch (error) {
      toast.error("Error fetching permissions.");
      return "Unknown";
    }
  };
  

  /** Fetch role resources */
  const fetchRoleResources = async (roleId) => {
    try {
      setLoading(true);
      const response = await AxiosGet(
        `${API_BASE_URL}/api/RoleResources/GetAllRoleResources/${roleId}`
      );
      setRoleResources(response?.data?.Data || []);
    } catch (error) {
      setError("Error fetching role resources.");
    } finally {
      setLoading(false);
    }
  };

  /** Fetch all resources */
  const fetchRolePermissions = async (roleId) => {
    try {
      setLoading(true);
  
      // Fetch role permissions
      const response = await AxiosGet(
        `${API_BASE_URL}/api/RolePermission/GetAllRolePermission/${roleId}`
      );
      const rolePermissions = response?.data?.Data || [];
  
      // Fetch all roles
      const rolesResponse = await AxiosGet(`${API_BASE_URL}/api/Roles/GetAllRoles`);
      const roles = rolesResponse?.data?.Data || [];
  
      // Format the data
      const formattedData = rolePermissions.map((item) => {
        const role = roles.find((r) => Number(r.Id) === Number(item.roleId));
      
        return {
          rolePermissionId: item.rolePermissionId, // ✅ Ensure this exists
          roleName: role ? role.Name : "Unknown",
          description: item.description,
        };
      });
      
      // console.log("Final Formatted Data:", formattedData);
      // setTableData(formattedData);
      

      console.log("Final Formatted Data:", formattedData); // Log before setting state
      setTableData(formattedData);
    } catch (error) {
      console.error("Error fetching role permissions:", error);
    } finally {
      setLoading(false);
    }
  };
  
  


  /** Delete permission */
  const handleDeletePermission = async (rolePermissionId) => {
    if (!rolePermissionId || isNaN(rolePermissionId)) {
      toast.error("Invalid role permission ID.");
      console.error("Invalid role permission ID:", rolePermissionId);
      return;
    }
  
    try {
      console.log(`Deleting permission with rolePermissionId: ${rolePermissionId}`);
  
      const deleteResponse = await AxiosGet(
        `${API_BASE_URL}/api/RolePermission/RemovePermissionFromRole/${rolePermissionId}`
      );
  
      if (deleteResponse?.data?.StatusCode === 200) {
        toast.success("Permission deleted successfully!");
        fetchRolePermissions(selectedRoleId); // Refresh the table
      } else {
        toast.error(deleteResponse.data?.StatusMessage || "Failed to delete permission.");
      }
    } catch (error) {
      console.error("Error deleting permission:", error);
      toast.error("Error deleting permission. Kindly contact the Admin.");
    }
  };
  
  
  
  
  

  /** Handle role selection */
  const handleSetSelectedRole = (e) => {
    setSelectedRoleId(e.target.value);
  };

  return (
    <DashboardLayout page="Permission Allocation">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="mt-4 flex gap-4 justify-between items-center">
            <button
              onClick={() => setOpenRoleResourceModal(true)}
              className="text-pumpkin border border-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center gap-2"
              disabled={loading}
            >
              {loading ? "Processing..." : "Assign Permission to Role"}
              <FaPlus />
            </button>

            <div className="relative">
              <select
                className="border border-pumpkin font-medium rounded-lg text-sm px-5 py-2.5"
                onChange={handleSetSelectedRole}
                value={selectedRoleId || ""}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.Id} value={role.Id}>
                    {role.Name}
                  </option>
                ))}
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
            <RolePermissionTable
              tableHeadings={[ "Role", "Permission Description", "Actions"]}
              tableData={tableData}
              onDelete={handleDeletePermission}
            />
          )}
        </div>

        {openRoleResourceModal && (
          <PermissionAllocationModal
            isOpen={openRoleResourceModal}
            onClose={() => setOpenRoleResourceModal(false)}
          />
        )}

        {openEditModal && selectedRoleResource && (
          <EditRoleResourceModal
            isOpen={openEditModal}
            onClose={() => setOpenEditModal(false)}
            selectedRoleResource={selectedRoleResource}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default PermissionAllocationPage;
