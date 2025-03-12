"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { AxiosPost, AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const PermissionModal = ({ isOpen, onClose, refreshPermissions }) => {
  const [permissionCode, setPermissionCode] = useState("");
  const [description, setDescription] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState(""); 
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (isOpen) {
      fetchResources();
    }
  }, [isOpen]);

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

  // Handle Permission Assignment
  const handleAddRolePermission = async () => {
    if (!permissionCode || !description || !selectedResourceId) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setLoading(true);
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

        refreshPermissions();

        setPermissionCode("");
        setDescription("");
        setSelectedResourceId("");

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error(response.data.StatusMessage || "Failed to create permission.");
      }
    } catch (error) {
      toast.error("Error creating permission.");
    } finally {
      setLoading(false);
    }
  };

   // Handle Delete Permission 
      const handleDeletePermission = async (permissionId) => {
        if (!permissionId) {
          toast.error("Invalid permission ID.");
          return;
        }
    
        try {
          const response = await AxiosGet(`${API_BASE_URL}/api/Permissions/Delete/${permissionId}`);
          if (response.data?.StatusCode === 200) {
            toast.success("Permission deleted successfully!");
            fetchPermissions(); 
          } else {
            toast.error(response.data?.StatusMessage || "Failed to delete permission.");
          }
        } catch (error) {
          toast.error(error.response?.data?.StatusMessage || "Error deleting permission. Kindly contact the Admin.");
        }
      };

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Assign Permission to Role
        </h3>

        <form
          className="w-full mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddRolePermission();
          }}
        >
          {/* Permission Code */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Permission Code</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
              value={permissionCode}
              onChange={(e) => setPermissionCode(e.target.value)}
              placeholder="Enter Permission Code"
              required
            />
          </div>

          {/* Description */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Description</label>
            <input
              className="w-full border-b-2 border-gray-300 h-[60px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Permission Description"
              required
            />
          </div>

          {/* Resource Selection Dropdown */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Select Resource</label>
            <select
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
              value={selectedResourceId}
              onChange={(e) => setSelectedResourceId(e.target.value)}
              required
            >
              <option value="">Select Resource</option>
              {resources.map((res) => (
                <option key={res.ResourceId} value={res.ResourceId}>
                  {res.ResourceName} 
                  {/* ({res.ResourceId}) */}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <AuthButtons
            label={loading ? "Assigning..." : "Assign Permission"}
            textColor="text-white"
            isLoading={loading}
            disabled={!permissionCode || !description || !selectedResourceId}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default PermissionModal;






