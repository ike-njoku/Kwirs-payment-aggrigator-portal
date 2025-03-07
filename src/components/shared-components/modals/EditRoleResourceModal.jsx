"use client";

import React, { useState, useEffect } from "react";
import { AxiosGet, AxiosPost } from "../../../services/http-service";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditRoleResourceModal = ({
  isOpen,
  onClose,
  roleResourceId,
  selectedRoleResource,
  selectedRole,
}) => {
  const [roleDetails, setRoleDetails] = useState("");
  const [ResourcesId, setResourcesId] = useState("");
  const [RoleId, setRoleId] = useState("");
  const [RoleResourceId, setRoleResourceId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const fetchRoleResourceDetails = async () => {
    if (!roleResourceId) return;

    try {
      const response = await AxiosGet(
        `${API_BASE_URL}/api/RoleResources/GetAllRoleResources/${roleResourceId}`
      );

      if (response?.data?.StatusCode === 200 && response.data.Data) {
        const roleResource = response.data.Data.find(
          (item) => item.RoleResourceId === roleResourceId
        );

        if (roleResource) {
          setRoleDetails(roleResource.RoleName || "");
          setResourcesId(roleResource.ResourceName || "");
          setRoleId(roleResource.RoleId || "");
          setRoleResourceId(roleResource.RoleResourceId || "");
        } else {
          toast.error("Role-Resource not found.");
        }
      } else {
        toast.error("Could not fetch role resource.");
      }
    } catch (error) {
      console.error("Error fetching role resource:", error);
      toast.error("Error fetching role resource.");
    }
  };

  const handleUpdateRoleResource = async () => {
    if (!API_BASE_URL) {
      toast.error("API base URL is missing.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        UserName: userEmail,
        RoleId: RoleId,
        ResourcesId: ResourcesId,
        RoleResourceId: RoleResourceId,
      };

      const response = await AxiosPost(
        `${API_BASE_URL}/api/RoleResources/Update`,
        payload
      );

      if (response?.StatusCode !== 200) {
        toast.error("Could not update role-resource at this time.");
        return;
      }

      toast.success("Role resource updated successfully!");

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.StatusMessage || "Error updating role-resource."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && roleResourceId) {
      fetchRoleResourceDetails();
    }
  }, [isOpen, roleResourceId]);

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

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Role Resource
        </h3>

        <form
          className="w-full mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateRoleResource();
          }}
        >
          <input type="hidden" value={userEmail} />

          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Role</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
              value={selectedRole.Name}
              onChange={(e) => setRoleDetails(e.target.value)}
              readOnly
            />
          </div>

          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">
              Resource
            </label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
              value={selectedRoleResource.Name}
              onChange={(e) => setResourcesId(e.target.value)}
              readOnly
            />
          </div>

          <input type="hidden" value={RoleResourceId} />

          {/* <AuthButtons
            label={loading ? "Updating..." : "Update Role Resource"}
            textColor="text-white"
            isLoading={loading}
            onClick={handleUpdateRoleResource}
          /> */}
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditRoleResourceModal;
