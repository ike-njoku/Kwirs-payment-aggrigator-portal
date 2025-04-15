import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";
import { AxiosPost } from "../../../services/http-service";
import AuthButtons from "../buttons/AuthButtons"; 

const EditWorkFlowActivityModal = ({ isOpen, onClose, selectedActivity, onUpdate }) => {
  const [formData, setFormData] = useState({
    WF_ActivitId: "",
    Approved: false,
    Remark: "",
  });
  const [loading, setLoading] = useState(false); 
  useEffect(() => {
    if (selectedActivity) {
      console.log("Selected Activity:", selectedActivity); 
      setFormData({
        WF_ActivitId: selectedActivity?.WF_ActivitId || "",  
        Approved: selectedActivity?.Approved || false,      
        Remark: selectedActivity?.Remark || "",            
      });
    }
  }, [selectedActivity]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, 
    }));
  };

  const handleToggleChange = () => {
    setFormData((prev) => ({
      ...prev,
      Approved: !prev.Approved, 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await AxiosPost(`${API_BASE_URL}/api/WFlow/UpdateWFAction`, formData);

      if (res?.data?.StatusCode === 200) {
        toast.success("Workflow action updated!");
        onUpdate(); 
        onClose();
      } else {
        toast.error(res?.data?.StatusMessage || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <ModalLayout open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 bg-black bg-opacity-30">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
          <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
            Edit Workflow Activity
          </h3>

          <form onSubmit={handleSubmit} className="w-full mt-4">
            {/* WF_ActivitId (hidden) */}
            <input
              type="hidden"
              name="WF_ActivitId"
              value={formData.WF_ActivitId}
            />

            {/* Approved (Toggle switch) */}
            <div className="w-full mb-4 flex items-center gap-3">
              <label htmlFor="Approved" className="text-base font-medium text-gray-700">Approved</label>
              <div
                onClick={handleToggleChange}
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

            {/* Remark */}
            <div className="w-full mb-4">
              <label className="text-base font-medium text-gray-700">Remark</label>
              <textarea
                name="Remark"
                value={formData.Remark}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
              <AuthButtons
                label={loading ? "Saving..." : "Save Changes"} // Change button text based on loading state
                textColor="text-white"
                isLoading={loading} // Bind loading state
                disabled={!formData.Remark || !formData.WF_ActivitId} // Disable save if Remark or WF_ActivitId is empty
              />
            </div>
          </form>
        </div>
      </div>
    </ModalLayout>
  );
};

export default EditWorkFlowActivityModal;






















