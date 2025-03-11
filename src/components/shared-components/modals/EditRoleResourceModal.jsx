"use client";

import React, { useState, useEffect } from "react";
import { AxiosGet, AxiosPost } from "../../../services/http-service";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditRoleResourceModal = ({ isOpen, onClose, roleResourceId, selectedRoleResource, selectedRole }) => {
  const [roleDetails, setRoleDetails] = useState("");
  const [resourcesId, setResourcesId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roleResourceIdState, setRoleResourceId] = useState(roleResourceId ?? "");
  const [UserName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [resources, setResources] = useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      fetchResources();
      if (roleResourceId) {
        fetchRoleResourceDetails();
      }
    }
  }, [isOpen, roleResourceId]);

  const fetchRoleResourceDetails = async () => {
    if (!selectedRole || !selectedRole.RoleId) {
      
      return;
    }

    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/RoleResources/GetAllRoleResources/${selectedRole.RoleId}`);
      
      if (response?.data?.StatusCode === 200) {
        const roleData = response.data.Data;
        setRoleDetails(roleData.RoleName || "");
        setResourcesId(roleData.ResourceId || "");
        setRoleId(roleData.RoleId || "");
        setRoleResourceId(roleData.RoleResourceId || "");
      } else {
        console.warn("No role resources found:", response.data.StatusMessage);
      }
    } catch (error) {
      console.error("Error fetching role resources:", error.response?.data || error);
    }
  };

  const handleUpdateRoleResource = async () => {
    if (!roleId || !resourcesId || !roleResourceIdState || !UserName) {
      toast.error("Please ensure all fields (Role, Resource, UserName) are selected before updating.");
      return;
    }
  
    const payload = {
      UserName: UserName,
      RoleId: roleId,
      ResourcesId: resourcesId,
      RoleResourceId: roleResourceIdState,
    };
  
    console.log("🚀 Sending Update Request - Payload:", JSON.stringify(payload, null, 2));
  
    try {
      setLoading(true);
      const response = await AxiosPost(`${API_BASE_URL}/api/RoleResources/Update`, payload);
  
      console.log("✅ API Response:", response); // Debugging log
  
      if (response?.StatusCode === 200) {
        toast.success(response.StatusMessage || "Role resource updated successfully!");
        onClose();
      } else {
        toast.error(response?.StatusMessage || "Update failed.");
      }
    } catch (error) {
      console.error("❌ Exception during update:", error);
  
      if (error.response) {
        console.log("📌 Full Backend Response:", error.response.data); // Capture the exact backend error
        toast.error(error.response.data?.StatusMessage || "Error updating role resource.");
      } else if (error.request) {
        toast.error("No response from server. Please check your network.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  

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

  const fetchResources = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Resources/GetAllResource`);
  
      if (response?.data?.StatusCode === 200 && Array.isArray(response.data.Data)) {
        setResources(response.data.Data);
      } else {
        toast.error("Could not fetch resources");
      }
    } catch (error) {
      toast.error("Error fetching resources");
    }
  };
  

  useEffect(() => {
  }, [resources]);
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("authDetails");
        console.log("🔍 Raw storedUser:", storedUser); // Debugging log
  
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("✅ Parsed User Data:", parsedUser); // Debugging log
  
          // Try setting UserName from multiple possible keys
          const extractedUserName = parsedUser?.UserName || parsedUser?.tin || parsedUser?.email;
  
          if (extractedUserName) {
            setUserName(extractedUserName);
            console.log("✅ Updated UserName:", extractedUserName);
          } else {
            toast.error("User identifier not found in auth details.");
          }
        } else {
          toast.error("User data not found. Please log in again.");
        }
      } catch (error) {
        toast.error("Invalid user data. Please log in again.");
      }
    }
  }, []);
  

  
  
  
  
  
  useEffect(() => {
    console.log("Updated UserName:", UserName);
  }, [UserName]);
  

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Role Resource
        </h3>

        <form className="w-full mt-4" onSubmit={(e) => { e.preventDefault(); handleUpdateRoleResource(); }}>
        
          <input type="hidden" value={UserName} readOnly className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700" />

          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Role</label>
            <select
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <option value="">Select a Role</option>
              {roles.map((role) => (
                <option key={role.Id} value={role.Id}>{role.Name}</option>
              ))}
            </select>
          </div>

          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Resource</label>
            <select
  className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
  value={resourcesId}
  onChange={(e) => setResourcesId(e.target.value)}
>
  <option value="">Select a Resource</option>
  {resources.map((res) => (
    <option key={res.ResourceId} value={res.ResourceId}>
      {res.ResourceName}
    </option>
  ))}
</select>

          </div>

          <input
            type="hidden"
            className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
            value={roleResourceIdState || ""}
            readOnly
          />

          <AuthButtons
            label={loading ? "Updating..." : "Update Role Resource"}
            textColor="text-white"
            isLoading={loading}
            onClick={handleUpdateRoleResource}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditRoleResourceModal;
