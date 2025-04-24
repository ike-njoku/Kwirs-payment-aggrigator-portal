import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";
import { AxiosPost } from "../../../services/http-service";
import AuthButtons from "../buttons/AuthButtons";

const WorkFlowActivityModal = ({
  isOpen,
  onClose,
  selectedActivity,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    WF_ActivitId: "",
    Approved: false,
    Remark: "",
  });

  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (isOpen && selectedActivity) {
      setFormData({
        WF_ActivitId: selectedActivity?.WF_ActivitId || "",
        Approved: selectedActivity?.Approved || false,
        Remark: selectedActivity?.Remark || "",
      });
    }
  }, [isOpen, selectedActivity]); // Re-run when `isOpen` or `selectedActivity` changes

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { WF_ActivitId, Remark } = formData;
    if (!WF_ActivitId || Remark.trim() === "") {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await AxiosPost(
        `${API_BASE_URL}/api/WFlow/CreateWFActivity`,
        {
          WF_ActivitId: parseInt(formData.WF_ActivitId),
          Approved: formData.Approved,
          Remark: formData.Remark.trim(),
        }
      );

      if (response?.StatusCode === 200) {
        toast.success("Workflow activity updated successfully!");
        onClose(); // close modal
      } else {
        toast.error(response?.data?.StatusMessage || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalLayout open={isOpen} handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Create Workflow Activity
        </h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* WF_ActivitId */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Activity ID
            </label>
            <input
              type="text"
              name="WF_ActivitId"
              value={formData.WF_ActivitId}
              onChange={handleChange}
              className="w-full rounded bg-gray-100 px-3 py-2 border border-gray-300"
              required
            />
          </div>

          {/* Remark */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Remark
            </label>
            <textarea
              name="Remark"
              value={formData.Remark}
              onChange={handleChange}
              className="w-full rounded bg-gray-100 px-3 py-2 border border-gray-300"
              rows={4}
              required
            />
          </div>

          {/* Approved Toggle */}
          <div className="flex items-center gap-3">
            <label className="text-base font-medium text-gray-700">
              Approved
            </label>
            <div
              onClick={() =>
                setFormData((prev) => ({ ...prev, Approved: !prev.Approved }))
              }
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

          {/* Submit Button */}
          <div className="flex justify-end">
            <AuthButtons
              label={loading ? "Submitting..." : "Submit"}
              textColor="text-white"
              isLoading={loading}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </ModalLayout>
  );
};

export default WorkFlowActivityModal;
