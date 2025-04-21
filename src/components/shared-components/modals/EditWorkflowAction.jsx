import React, { useEffect, useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import { AxiosGet, AxiosPost } from "../../../services/http-service";
import { toast } from "react-toastify";
const EditWorkflowActionModal = ({ onClose, workflowActionDetails }) => {
  console.table(workflowActionDetails);
  const [loading, setLoading] = useState(false);
  const [workflowTypes, setWorkflowTypes] = useState([]);
  const [workflowStages, setWorkflowStages] = useState([]);
  const [initialWorkflowStage, setInitialWorkflowStage] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [allWorkflowSteps, setAllWorkflowSteps] = useState([]);
  const [isFinalAction, setIsFinalAction] = useState(
    workflowActionDetails.isFinalAction
  );

  const [selectedStage, setSelectedStage] = useState(
    workflowActionDetails.Stage
  );
  const [selectedDescription, setSelectedDescription] = useState(
    workflowActionDetails.Description
  );
  const [selectedRole, setSelectedRole] = useState(workflowActionDetails.Role);
  const [selectedStep, setSelectedStep] = useState(
    allWorkflowSteps.find(
      (step) => step.Description === workflowActionDetails.Description
    )
  );

  const handleUpdateWorkflow = async () => {
    workflowActionDetails.isFinalAction = isFinalAction;
    workflowActionDetails.Stage = selectedStage;
    workflowActionDetails.Description = selectedDescription;
    workflowActionDetails.Role = selectedRole;
    workflowActionDetails.StepId = selectedStep;

    const something = {
      WFActionId: workflowActionDetails.WFActionId,
      StepId: selectedStep,
      StageId: selectedStage,
      RoleId: selectedRole,
      isFinalAction: isFinalAction,
    };

    setLoading(true);
    const url = `/api/WFlow/UpdateWFAction`;
    const apiResponse = AxiosPost(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${url}`,
      something
    );

    if (apiResponse.status !== 200) {
      toast.error("Failed to update workflow action.");
      setLoading(false);
      return;
    }

    toast.success("Workflow action updated successfully.");
    setLoading(false);
  };

  const getWorkflowActions = async () => {
    const url = "/api/WFlow/GetWFTypes";
    const apiResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${url}`
    );
    if (apiResponse.status !== 200) {
      toast.error("Failed to load workflow types: Unexpected response format.");
      return;
    }

    const workflowTypes = apiResponse?.data?.Data;
    if (!workflowTypes) {
      toast.error("Failed to load workflow actions.");
      return;
    }
    setWorkflowTypes(workflowTypes);
  };

  const getStages = async () => {
    const url = `/api/WFlow/GetWFStages`;
    const apiResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${url}`
    );
    if (apiResponse.status !== 200) {
      toast.error("Failed to load workflow steps.");
      return;
    }

    const responseData = apiResponse?.data?.Data;
    if (!responseData) {
      toast.error("Failed to load workflow steps.");
      return;
    }

    const initialStage = responseData.find(
      (stage) =>
        stage.StageId === workflowActionDetails?.Stage ||
        stage.Description === workflowActionDetails?.Stage
    );

    setInitialWorkflowStage(initialStage);
    setWorkflowStages(responseData);
  };

  const getRoles = async () => {
    const url = `/api/Roles/GetAllRoles`;
    const apiResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${url}`
    );

    if (apiResponse?.status !== 200) {
      toast.error("Failed to load workflow roles.");
      return;
    }
    const responseData = apiResponse?.data?.Data;
    if (!responseData) {
      toast.error("Failed to load workflow roles.");
      return;
    }
    setAllRoles(responseData);
  };

  const getWorkflowSteps = async () => {
    const url = `api/WFlow/GetWFSteps`;
    const apiResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${url}`
    );

    if (apiResponse.status !== 200) {
      toast.error("Failed to load workflow steps.");
      return;
    }

    const responseData = apiResponse?.data?.Data;
    if (!responseData) {
      toast.error("Failed to load workflow steps.");
      return;
    }

    setAllWorkflowSteps(responseData);
  };

  useEffect(() => {
    getWorkflowActions();
    getStages();
    getRoles();
    getWorkflowSteps();
  }, []);

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Update Workflow Action
        </h3>

        <form
          className="w-full mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateWorkflow();
          }}
        >
          {/* Workflow Type */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">
              Workflow Type
            </label>
            <select
              onChange={(e) => {}}
              required
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
            >
              {workflowTypes?.map((type) => (
                <option key={type.WFTypeId} value={type.WFTypeId}>
                  {type.Description}
                </option>
              ))}
            </select>
          </div>

          {/* Workflow Stage */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">
              Workflow Stage
            </label>
            <select
              onChange={(e) => setSelectedStage(e.target.value)}
              required
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
            >
              <option value={initialWorkflowStage?.Stage}>
                {initialWorkflowStage?.Description}
              </option>

              {workflowStages?.map((stage) => (
                <option key={stage.StageId} value={stage.StageId}>
                  {stage.Description}
                </option>
              ))}
            </select>
          </div>

          {/* Role*/}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Role</label>
            <select
              onChange={(e) => {
                setSelectedRole(e.target.value);
              }}
              required
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
            >
              {allRoles?.map((role) => (
                <option key={role.Id} value={role.Id}>
                  {role.Name}
                </option>
              ))}
            </select>
          </div>

          {/* Step / Description */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">
              Workflow Step
            </label>
            <select
              onChange={(e) => {
                setSelectedDescription(e.target.value);
                setSelectedStep(e.target.value);
              }}
              required
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
            >
              <option value={selectedStep}>
                {workflowActionDetails?.Description}
              </option>

              {allWorkflowSteps?.map((step) => (
                <option key={step.StepId} value={step.StepId}>
                  {step.Description}
                </option>
              ))}
            </select>
          </div>

          {/* is final action */}
          <div className="flex items-center gap-3">
            <label className="text-base font-medium text-gray-700">
              Is Final Action
            </label>
            <div
              onClick={() => setIsFinalAction((prev) => !prev)}
              className={`cursor-pointer w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                workflowActionDetails.isFinalAction
                  ? "bg-pumpkin"
                  : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-all ${
                  workflowActionDetails.isFinalAction ? "translate-x-6" : ""
                }`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <AuthButtons
            label={loading ? "Updating..." : "Update Workflow Action"}
            textColor="text-white"
            isLoading={loading}
            // disabled={!documentId || !description || !selectedWfTypeId}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditWorkflowActionModal;
