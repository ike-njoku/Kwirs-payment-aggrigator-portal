import React, { useState } from "react";
import ModalLayout from "../ModalLayout";
import ModalTextInput from "../../inputs/ModalTextInput";
import { AxiosPost } from "@/services/http-service";
import { toast } from "react-toastify";

const EditClassModal = ({
  handleCloseModal,
  selectedItem,
  handleEditClassItem,
  fetchAllClass,
}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState({
    classCode: selectedItem.classCode || "",
    catCode: selectedItem.catCode || "",
    description: selectedItem.description || "",
  });
  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setClassData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();

      // handleEditClassItem(selectedItem, classData);
      const payload = {
        classCode: Number(classData.classCode),
        catCode: Number(classData.catCode),
        description: classData.description,
      };
      // api call
      const response = await AxiosPost(
        `${API_BASE_URL}/api/Inventory/ItemClassification/Update`,
        payload
      );

      if (response.StatusCode !== 200) {
        toast.error(response.StatusMessage);
        setLoading(false);
        return;
      }
      toast.success("Classification updated successfully!");
      fetchAllClass();
      setLoading(false);
      handleCloseModal();
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Update Classification
        </h3>
        <form className="w-full mt-4" onSubmit={handleSubmit}>
          <ModalTextInput
            label="Class Code"
            name="classCode"
            placeholder="Enter class code"
            type="text"
            value={classData.classCode}
            handleChange={handleChangeValue}
            disabled={true}
          />
          <ModalTextInput
            label="Cat Code"
            name="catCode"
            placeholder="Enter cat code"
            type="text"
            value={classData.catCode}
            handleChange={handleChangeValue}
            disabled={true}
          />

          <ModalTextInput
            label="Description"
            name="description"
            placeholder="Enter description"
            type="text"
            value={classData.description}
            handleChange={handleChangeValue}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-pumpkin text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? "Processing..." : "Update Classification"}
          </button>
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditClassModal;
