"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

// 👇 Add IDs that should be excluded (no initiation stage)
const INVALID_WF_TYPE_IDS = [1, 4];

const WorkflowModal = ({ isOpen, onClose, refreshWorkflows }) => {
  const [documentId, setDocumentId] = useState("");
  const [description, setDescription] = useState("");
  const [wfTypes, setWfTypes] = useState([]);
  const [selectedWfTypeId, setSelectedWfTypeId] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (!isOpen) return;

    const fetchWorkflowTypes = async () => {
      try {
        const response = await AxiosGet(`${API_BASE_URL}/api/WFlow/GetWFTypes`);
        console.log("Workflow Types Response:", response);

        if (Array.isArray(response.data.Data)) {
          const validTypes = response.data.Data.filter(
            (type) => !INVALID_WF_TYPE_IDS.includes(type.WFTypeId)
          );
          setWfTypes(validTypes);
        } else {
          toast.error("Failed to load workflow types: Unexpected response format.");
        }
      } catch (error) {
        console.error("Error fetching workflow types:", error);
        toast.error("Error fetching workflow types.");
      }
    };

    fetchWorkflowTypes();
  }, [isOpen]);

  const handleWfTypeChange = (e) => {
    const selectedId = Number(e.target.value);
    setSelectedWfTypeId(selectedId);

    if (INVALID_WF_TYPE_IDS.includes(selectedId)) {
      toast.warning("This workflow type cannot be initiated.");
    }
  };

  const handleCreateWorkflow = async () => {
    if (!documentId || !description || !selectedWfTypeId) {
      toast.error("Please provide all fields.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        WFTypeId: selectedWfTypeId,
        DocumentId: documentId,
        Description: description,
      };

      const response = await axios.post(`${API_BASE_URL}/api/WFlow/CreateWFlow`, payload);
      console.log("Create Workflow Response:", response);

      if (response?.data?.StatusCode === 200) {
        toast.success("Workflow created successfully!");
        refreshWorkflows?.();
        setDocumentId("");
        setDescription("");
        setSelectedWfTypeId("");
        setTimeout(() => onClose(), 1500);
      } else {
        toast.error(response?.data?.StatusMessage || "Failed to create workflow.");
      }
    } catch (error) {
      console.error("Workflow creation error:", error?.response || error);
      toast.error(
        error?.response?.data?.Message ||
        error?.response?.data?.StatusMessage ||
        "Error creating workflow."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Create New Workflow
        </h3>

        <form
          className="w-full mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateWorkflow();
          }}
        >
          {/* Workflow Type */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Workflow Type</label>
            <select
              value={selectedWfTypeId}
              onChange={handleWfTypeChange}
              required
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
            >
              <option value="">Select Workflow Type</option>
              {wfTypes.map((type) => (
                <option key={type.WFTypeId} value={type.WFTypeId}>
                  {type.Description}
                </option>
              ))}
            </select>
          </div>

          {/* Document ID */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Document ID</label>
            <input
              type="text"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              placeholder="Enter Document ID"
              required
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter workflow description"
              required
              className="w-full border-b-2 border-gray-300 h-[60px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <AuthButtons
            label={loading ? "Creating..." : "Create Workflow"}
            textColor="text-white"
            isLoading={loading}
            disabled={!documentId || !description || !selectedWfTypeId}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default WorkflowModal;














