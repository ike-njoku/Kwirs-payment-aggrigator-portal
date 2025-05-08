import { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import { AxiosPost } from "../../../services/http-service";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EditItemUnitModal = ({ isOpen, onClose, itemUnit, refreshItemUnits }) => {
  const [unitCode, setUnitCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (itemUnit) {
      setUnitCode(itemUnit.unitCode);
      setDescription(itemUnit.description);
    }
  }, [itemUnit]);

  const handleUpdateItemUnit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      unitCode,
      description,
    };

    try {
      const response = await AxiosPost(`${API_BASE_URL}/api/Inventory/ItemUnits/Update`,
        payload
      );

      if (!response || response.StatusCode !== 200) {
        toast.error(response?.StatusMessage || "Failed to update item unit");
        return;
      }

      toast.success(response.StatusMessage || "Item unit updated successfully");
      refreshItemUnits();
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
          Edit Item Unit
        </h3>
        <form className="w-full mt-4" onSubmit={handleUpdateItemUnit} autoComplete="off">
          {/* Hidden Unit Code */}
          <input type="hidden" value={unitCode} />

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

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-pumpkin text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Item Unit"}
          </button>
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditItemUnitModal;
