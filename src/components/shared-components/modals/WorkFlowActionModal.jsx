"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";
import { AxiosPost, AxiosGet } from "../../../services/http-service";
import AuthButtons from "../buttons/AuthButtons";

const WorkflowActionModal = ({ isOpen, onClose, refreshWorkflows }) => {
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [wfTypes, setWfTypes] = useState([]);
  const [wfStages, setWfStages] = useState([]);
  const [wfSteps, setWfSteps] = useState([]);
  const [isFinalAction, setIsFinalAction] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [selectedStageId, setSelectedStageId] = useState("");
  const [selectedStepId, setSelectedStepId] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, stagesRes, stepsRes, rolesRes] = await Promise.all([
          AxiosGet(`${API_BASE_URL}/api/WFlow/GetWFTypes`),
          AxiosGet(`${API_BASE_URL}/api/WFlow/GetWFStages`),
          AxiosGet(`${API_BASE_URL}/api/WFlow/GetWFSteps`),
          AxiosGet(`${API_BASE_URL}/api/Roles/GetAllRoles`)
        ]);

        if (typesRes?.data?.StatusCode === 200) setWfTypes(typesRes.data.Data);
        else toast.error("Failed to fetch workflow types.");

        if (stagesRes?.data?.StatusCode === 200) setWfStages(stagesRes.data.Data);
        else toast.error("Failed to fetch workflow stages.");

        if (stepsRes?.data?.StatusCode === 200) setWfSteps(stepsRes.data.Data);
        else toast.error("Failed to fetch workflow steps.");

        if (rolesRes?.data?.StatusCode === 200) {
          setRoles(rolesRes.data.Data);
          if (rolesRes.data.Data.length > 0) {
            setRoleId(rolesRes.data.Data[0].Id);
          }
        } else {
          toast.error("Failed to fetch roles.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching form data.");
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  const handleCreateWorkflowAction = async () => {
    if (!roleId || !selectedTypeId || !selectedStageId || !selectedStepId) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        WFTypeId: parseInt(selectedTypeId),
        StageId: parseInt(selectedStageId),
        StepId: parseInt(selectedStepId),
        RoleId: parseInt(roleId),
        isFinalAction: isFinalAction
      };

      console.log("🚀 Sending payload to API:", payload);

      const response = await AxiosPost(
        `${API_BASE_URL}/api/WFlow/CreateWFAction`,
        payload,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Full API Response:", response);

      if (response?.data?.StatusCode === 200) {
        toast.success("Workflow action created successfully!");
        refreshWorkflows?.();
        setTimeout(() => onClose(), 1500);
      } else {
        toast.error(response?.data?.StatusMessage || "Failed to create workflow action.");
      }
    } catch (error) {
      console.error("❌ Create error:", error);
      toast.error("Failed to create workflow action.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Create Workflow Action
        </h3>

        <form
          className="w-full mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateWorkflowAction();
          }}
        >
          {/* Role */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Select Role</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
            >
              <option value="">Select Role Type</option>
              {roles.map((role) => (
                <option key={role.Id} value={role.Id}>
                  {role.Name}
                </option>
              ))}
            </select>
          </div>

          {/* Workflow Type */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Workflow Type</label>
            <select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
              required
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
            >
              <option value="">Select Workflow Type</option>
              {wfTypes.map((type) => (
                <option key={type.WFTypeId} value={type.WFTypeId}>
                  {type.Description}
                </option>
              ))}
            </select>
          </div>

          {/* Stage */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Workflow Stage</label>
            <select
              value={selectedStageId}
              onChange={(e) => setSelectedStageId(e.target.value)}
              required
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
            >
              <option value="">Select Workflow Stage</option>
              {wfStages.map((stage) => (
                <option key={stage.StageId} value={stage.StageId}>
                  {stage.Description}
                </option>
              ))}
            </select>
          </div>

          {/* Step */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Workflow Step</label>
            <select
              value={selectedStepId}
              onChange={(e) => setSelectedStepId(e.target.value)}
              required
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
            >
              <option value="">Select Workflow Step</option>
              {wfSteps.map((step) => (
                <option key={step.StepId} value={step.StepId}>
                  {step.Description}
                </option>
              ))}
            </select>
          </div>

          {/* Final Action Toggle */}
          <div className="w-full mb-4 flex items-center gap-3">
            <label className="text-base font-medium text-gray-700">Is Final Action?</label>
            <div
              onClick={() => setIsFinalAction(!isFinalAction)}
              className={`cursor-pointer w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                isFinalAction ? "bg-pumpkin" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-all ${
                  isFinalAction ? "translate-x-6" : ""
                }`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-5">
            <AuthButtons
              label={loading ? "Creating Workflow Action..." : "Create Workflow Action"}
              textColor="text-white"
              isLoading={loading}
              disabled={!roleId || !selectedTypeId || !selectedStageId || !selectedStepId}
            />
          </div>
        </form>
      </div>
    </ModalLayout>
  );
};

export default WorkflowActionModal;












