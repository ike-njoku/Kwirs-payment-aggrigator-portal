import { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import { AxiosPost } from "../../../services/http-service";
import { toast } from "react-toastify";

const EditItemCategoryModal = ({ isOpen, onClose, categoryData, refreshItemCategories }) => {
  const [catCode, setCatCode] = useState("");
  const [description, setDescription] = useState("");
  const [accountCode, setAccountCode] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (categoryData) {
      setCatCode(categoryData.catCode);
      setDescription(categoryData.description);
      setAccountCode(categoryData.accountCode);
    }
  }, [categoryData]);

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      catCode,
      description,
      accountCode,
    };

    try {
      const response = await AxiosPost(
        `${API_BASE_URL}/api/Inventory/ItemCategory/Update`,
        payload
      );

      if (!response || response.StatusCode !== 200) {
        toast.error(response?.StatusMessage || "Failed to update item category");
        return;
      }

      toast.success(response.StatusMessage || "Item category updated successfully");
      refreshItemCategories();
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error("❌ Update error:", error);
      toast.error("An error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Edit Item Category
        </h3>
        <form className="w-full mt-4" onSubmit={handleUpdateCategory} autoComplete="off">
          {/* Hidden Category Code */}
          <input type="hidden" value={catCode} />

          {/* Description */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Description</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Account Code */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Account Code</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={accountCode}
              onChange={(e) => setAccountCode(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-pumpkin text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Item Category"}
          </button>
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditItemCategoryModal;
