"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { AxiosPost, AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const RoleResourceModal = ({ isOpen, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
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

  const fetchRoles = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Roles/GetAllRoles`);
console.log(response);
      if (!response || response.data.StatusCode !== 200) {
        toast.error("Could not fetch roles");
        return;
      }

      setRoles(response.data.Data || []);
    } catch (error) {
      toast.error("Error fetching roles");
    }
  };

  const fetchResources = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Resources/GetAllResource`);

      if (!response || response.data.StatusCode !== 200) {
        toast.error("Could not fetch resources");
        return;
      }

      setResources(response.data.Data || []);
    } catch (error) {
      toast.error("Error fetching resources");
    }
  };

  const handleAddRoleResource = async () => {
    if (!API_BASE_URL) {
      toast.error("API base URL is missing.");
      return;
    }
  
    try {
      const storedUser = JSON.parse(localStorage.getItem("authDetails"));
      const userEmail = storedUser?.email;
  
      if (!userEmail) {
        toast.error("User email is required.");
        return;
      }
  
      if (!selectedRoleId || !selectedResourceId) {
        toast.error("Please select a role and a resource before adding.");
        return;
      }
  
      const rolesResponse = await axios.get(`${API_BASE_URL}/api/Roles/GetAllRoles`);
      const resourcesResponse = await axios.get(`${API_BASE_URL}/api/Resources/GetAllResource`);
  
      const roleExists = rolesResponse.data.Data?.some((role) => role.Id == selectedRoleId);
      const resourceExists = resourcesResponse.data.Data?.some((res) => res.ResourceId == selectedResourceId);
  
      if (!roleExists) {
        toast.error("Selected role does not exist.");
        return;
      }
  
      if (!resourceExists) {
        toast.error("Selected resource does not exist.");
        return;
      }
  
      const payload = {
        UserName: userEmail,
        RoleId: parseInt(selectedRoleId, 10),
        ResourcesId: parseInt(selectedResourceId, 10),
      };
  
      const response = await axios.post(`${API_BASE_URL}/api/RoleResources/Create`, payload, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.data.StatusCode === 200) {
        toast.success("Role resource created successfully!");
        setTimeout(() => {
          setSelectedRoleId("");
          setSelectedResourceId("");
          onClose(); 
        }, 2000); 
      } else {
        toast.error(response.data.StatusMessage || "Failed to create role resource.");
        setTimeout(() => {
            setSelectedRoleId("");
            setSelectedResourceId("");
            onClose(); 
          }, 2000); 
      }
    } catch (error) {
      toast.error(error.response?.data?.StatusMessage || "Error creating role resource.");
    }
  };
  
 
  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      fetchResources();
    }
  }, [isOpen]);

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Assign Resource to Role
        </h3>

        <form
          className="w-full mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddRoleResource();
          }}
        >
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
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <option key={role.Id} value={role.Id}>
                      {role.Name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading roles...</option>
                )}
              </select>
            </div>
          </div>

          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Select Resource</label>
            <div className="border-b-2 border-gray-300 h-[45px] w-full rounded-md my-2">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={selectedResourceId}
                onChange={(e) => setSelectedResourceId(e.target.value)}
                required
              >
                <option value="">-- Select a Resource --</option>
                {resources.length > 0 ? (
                  resources.map((resource) => (
                    <option key={resource.ResourceId} value={resource.ResourceId}>
                      {resource.ResourceName}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading resources...</option>
                )}
              </select>
            </div>
          </div>

          <AuthButtons
            label={loading ? "Assigning..." : "Assign Resource"}
            textColor="text-white"
            isLoading={loading}
            onClick={handleAddRoleResource}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default RoleResourceModal;