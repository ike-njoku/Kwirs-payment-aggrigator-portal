"use client";
import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import { AxiosGet } from "../../../services/http-service";

const CreatePermissionModal = ({ isOpen, onClose }) => {
  const [permissionCode, setPermissionCode] = useState("");
  const [description, setDescription] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState(""); // ✅ Corrected
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  // const [
  //   showSelectParentResourceDropdown,
  //   setShowSelectParentResourceDropdown,
  // ] = useState(false);

  const handleFormSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!resourceName.trim() || !resourceUrl.trim()) {
      alert("Both fields are required!");
      return;
    }

    handleCreateModal({
      resourceName,
      resourceUrl,
      resourceType,
      parentResourceId,
    });
    setIsLoading(false);
    handleCloseModal();
  };

  const handleInputChange = (e) => {
    setResourceType(e.target.value);
    if (resourceType == 1) {
      setShowSelectParentResourceDropdown(true);
    } else {
      setParentResourceId(0);
      setShowSelectParentResourceDropdown(false);
    }
  };

   // ✅ Handle Permission Assignment
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

        // ✅ Fetch latest permissions to update table
        await fetchPermissions();

        setTimeout(() => {
          setSelectedResourceId("");
          setPermissionCode("");
          setDescription("");
          onClose();
        }, 2000);
      } else {
        toast.error(response.data.StatusMessage || "Failed to create permission.");
      }
    } catch (error) {
      toast.error(error.response?.data?.StatusMessage || "Error creating permission.");
      console.error("Error creating permission:", error);
    }
  };

   // ✅ Fetch Permissions
   const fetchPermissions = async () => {
     setLoading(true);
     try {
       console.log("Fetching permissions...");
       const response = await AxiosGet(`/api/Permissions/GetAllPermissions`);
 
       if (response?.data?.StatusCode === 200) {
         console.log("Permissions Data:", response.data.Data);
       } else {
         toast.error("Could not fetch permissions");
       }
     } catch (error) {
       console.error("Error fetching permissions:", error);
       toast.error("Error fetching permissions");
     }
     setLoading(false);
   };

  console.table({
    PARENT_RESOURCE_ID: parentResourceId,
    RESOURCE_TYPE: resourceType,
  });

  // ✅ Fetch Resources
   const fetchResources = async () => {
     try {
       const response = await AxiosGet(`${API_BASE_URL}/api/Resources/GetAllResource`);
       console.log("Resources Response:", response.data);
 
       if (response?.data?.StatusCode === 200) {
         setResources(response.data.Data || []);
       } else {
         toast.error("Could not fetch resources");
       }
     } catch (error) {
       toast.error("Error fetching resources");
       console.error("❌ Resource fetch error:", error);
     }
   };

    useEffect(() => {
      fetchPermissions();
      fetchResources();
    }, []);
  
    useEffect(() => {
      if (selectedPermissionId) {
        getPermissionById(selectedPermissionId);
      }
    }, [selectedPermissionId]);

    useEffect(() => {
        if (isOpen) {
          fetchResources();
        }
      }, [isOpen]);

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Assign Permission to Role
        </h3>

        <form
          className="w-full mt-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleAddRolePermission();
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

          {/* ✅ Resource Selection Dropdown */}
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
                  {res.ResourceName} ({res.ResourceId})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <AuthButtons
            label={loading ? "Assigning..." : "Assign Permission"}
            textColor="text-white"
            isLoading={loading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default CreatePermissionModal;
