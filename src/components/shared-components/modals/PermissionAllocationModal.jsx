"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AxiosGet } from "../../../services/http-service";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const PermissionAllocationModal = ({ isOpen, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [resources, setResources] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedPermissionId, setSelectedPermissionId] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("authDetails");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserEmail(parsedUser?.email || "");
        } else {
          toast.error("User data not found. Please log in again.");
        }
      } catch (error) {
        toast.error("Invalid user data. Please log in again.");
      }
    }
  }, []);

  // Fetch Roles
  const fetchRoles = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Roles/GetAllRoles`);
      if (response?.data?.StatusCode === 200) {
        setRoles(response.data.Data || []);
      } else {
        toast.error("Could not fetch roles");
      }
    } catch (error) {
      toast.error("Error fetching roles");
    }
  };

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
  };

  const fetchRolePermissionById = async (permissionId) => {
    try {
      const apiResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/RolePermission/GetRolePermissionById/${permissionId}`
      );
  
      if (!apiResponse) {
        toast.error("Could not fetch role permissions");
        return;
      }
  
      const { data } = apiResponse;
      const rolePermissions = data.Data || [];
  
      if (!rolePermissions.length) {
        toast.warn("No role permissions found for the given permission ID");
        return;
      }
  
      // Process and transform role permissions if needed
      const processedData = rolePermissions.map((item) => ({
        roleName: item.RoleName || "Unknown Role",
        permissionCode: item.PermissionCode || "Unknown Permission",
        resourceId: item.ResourceId || null,
        createdDate: new Date(item.CreateDate).toISOString().split("T")[0],
      }));
  
      console.log("Processed Role Permissions:", processedData);
  
      return processedData; // You can set this in state if needed
    } catch (error) {
      console.error("Error fetching role permission:", error);
      toast.error("Error fetching role permission");
    }
  };
  

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      fetchResources();
      fetchPermissions();
    }
  }, [isOpen]);

  // Debugging: Log Permissions Data
  useEffect(() => {
    console.log("Fetched Permissions:", permissions);
  }, [permissions]);

  const handleAddRoleResource = async () => {
    if (!API_BASE_URL) {
      toast.error("API base URL is missing.");
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("authDetails"));
      const createdBy = storedUser?.tin;

      if (!createdBy) {
        toast.error("User ID is required.");
        return;
      }

      if (!selectedRoleId || !selectedPermissionId) {
        toast.error("Please select a role and a permission before adding.");
        return;
      }

      // Fetch and validate roles and permissions
      const rolesResponse = await axios.get(`${API_BASE_URL}/api/Roles/GetAllRoles`);
      const permissionsResponse = await axios.get(`${API_BASE_URL}/api/Permissions/GetAllPermissions`);

      console.log("Roles Response:", rolesResponse.data.Data);
      console.log("Permissions Response:", permissionsResponse.data.Data);

      const roleExists = rolesResponse.data.Data?.some((role) => role.Id == selectedRoleId);
      const permissionExists = permissionsResponse.data.Data?.some(
        (perm) => perm.permissionId == selectedPermissionId || perm.Id == selectedPermissionId
      );

      if (!roleExists) {
        toast.error("Selected role does not exist.");
        return;
      }

      if (!permissionExists) {
        toast.error("Selected permission does not exist.");
        return;
      }

      // Prepare Payload
      const payload = {
        CreatedBy: createdBy,
        RoleId: parseInt(selectedRoleId, 10),
        permissionId: parseInt(selectedPermissionId, 10),
      };

      console.log("Payload being sent:", payload);

      const response = await axios.post(
        `${API_BASE_URL}/api/RolePermission/Create`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.StatusCode === 200) {
        toast.success("Role permission created successfully!");
        setTimeout(() => {
          setSelectedRoleId("");
          setSelectedResourceId("");
          onClose();
        }, 2000);
      } else {
        toast.error(response.data.StatusMessage || "Failed to create role permission.");
      }
    } catch (error) {
      console.error("Error creating role permission:", error.response?.data || error);
      toast.error(error.response?.data?.StatusMessage || "Error creating role permission.");
    }
  };

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Assign Permission to Role
        </h3>

        <form className="w-full mt-4" onSubmit={(e) => { e.preventDefault(); handleAddRoleResource(); }}>
          {/* Select Role */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Select Role</label>
            <div className="border-b-2 border-gray-300 h-[45px] w-full rounded-md my-2">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                required
              >
                <option value="">-- Select a Role --</option>
                {roles.map((role) => (
                  <option key={role.Id} value={role.Id}>{role.Name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Select Permission */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Select Permission</label>
            <div className="border-b-2 border-gray-300 h-[45px] w-full rounded-md my-2">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={selectedPermissionId}
                onChange={(e) => setSelectedPermissionId(e.target.value)}
                required
              >
                <option value="">-- Select a Permission --</option>
                {permissions.map((perm) => (
                  <option key={perm.permissionId || perm.Id} value={perm.permissionId || perm.Id}>
                    {perm.permissionCode || "Unnamed Permission"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <AuthButtons label={loading ? "Assigning..." : "Assign Permission"} textColor="text-white" isLoading={loading} onClick={handleAddRoleResource} />
        </form>
      </div>
    </ModalLayout>
  );
};

export default PermissionAllocationModal;