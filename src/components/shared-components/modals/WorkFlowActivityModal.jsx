import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";
import { AxiosPost } from "../../../services/http-service";
import AuthButtons from "../buttons/AuthButtons";

const WorkFlowActivityModal = ({ isOpen, onClose, selectedActivity, onUpdate }) => {
  const [formData, setFormData] = useState({
    WF_ActivitId: null,
    Approved: true,
    Remark: "",
  });
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (isOpen && selectedActivity) {
      console.log("🛠️ Editing selectedActivity:", selectedActivity);
      setFormData({
        WF_ActivitId: selectedActivity?.WFActivityId ?? null,
        Approved: selectedActivity?.Approved ?? true,
        Remark: selectedActivity?.Remark || "",
      });
    }
  }, [isOpen, selectedActivity]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleApproved = () => {
    setFormData((prev) => ({
      ...prev,
      Approved: !prev.Approved,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.WF_ActivitId) {
      toast.error("Invalid Workflow Activity ID.");
      return;
    }

    setLoading(true);

    try {
      const response = await AxiosPost(`${API_BASE_URL}/api/WFlow/CreateWFActivity`, formData);

      if (response?.data?.StatusCode === 200) {
        toast.success("Workflow activity submitted successfully!");
        onUpdate?.();
        onClose?.();
      } else {
        toast.error(response?.data?.StatusMessage || "Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting workflow activity:", error);
      toast.error("Something went wrong during submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalLayout open={isOpen} onClose={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Approve Workflow Activity
        </h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Approved Toggle */}
          <div className="flex items-center gap-3">
            <label className="text-base font-medium text-gray-700">Approved</label>
            <div
              onClick={handleToggleApproved}
              className={`cursor-pointer w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                formData.Approved ? "bg-pumpkin" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-all ${
                  formData.Approved ? "translate-x-6" : ""
                }`}
              />
            </div>
          </div>

          {/* Remark Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Remark</label>
            <textarea
              name="Remark"
              value={formData.Remark}
              onChange={handleChange}
              rows={3}
              className="w-full rounded bg-gray-100 px-3 py-2 border border-gray-300"
              placeholder="Enter a remark..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <AuthButtons
              label={loading ? "Submitting..." : "Submit"}
              textColor="text-white"
              isLoading={loading}
              disabled={!formData.Remark}
            />
          </div>
        </form>
      </div>
    </ModalLayout>
  );
};

export default WorkFlowActivityModal;



























