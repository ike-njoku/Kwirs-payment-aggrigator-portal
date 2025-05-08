import { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout"; 
import { AxiosPost, AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";

const ItemUnitModal = ({ onClose, refreshItemUnits }) => {
  const [unitCode, setUnitCode] = useState(1); // Assuming default code to be 1
  const [description, setDescription] = useState("");
  const [itemUnits, setItemUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // ✅ Fetch item units on mount
  useEffect(() => {
    fetchItemUnits();
  }, []);

  const fetchItemUnits = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Inventory/ItemUnits/GetAll`);
      setItemUnits(response?.data?.Data || []);
    } catch (error) {
      console.error("❌ Error fetching item units:", error);
      toast.error("Failed to fetch item units");
    }
  };

  const handleCreateItemUnit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const payload = {
      unitCode,
      description,
    };

    console.log("🚀 Sending API request with:", payload);

    try {
      const response = await AxiosPost(
        `${API_BASE_URL}/api/Inventory/ItemUnits/Create`,
        payload);
  
      console.log("✅ API Response:", response);

      if (!response || response.StatusCode !== 200) {
        toast.error(response?.StatusMessage || "Failed to create item unit.");
        return;
      }
  
      toast.success(response.StatusMessage || "Item unit created successfully");
      fetchItemUnits();
  
      if (typeof refreshItemUnits === "function") {
        refreshItemUnits(); // refresh parent
        onClose(); // close immediately
      } 
    } catch (error) {
      console.error("❌ Create error:", error);
      toast.error("Failed to create Item Unit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Create Item Unit
        </h3>
        <form className="w-full mt-4" onSubmit={handleCreateItemUnit} autoComplete="off">
          {/* Unit Code */}
          <div className="w-full mb-4">
            {/* <label className="text-base font-medium text-gray-700">Unit Code</label> */}
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={unitCode}
              onChange={(e) => setUnitCode(e.target.value)}
              hidden
            />
          </div>

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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-pumpkin text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? "Processing..." : "Create Item Unit"}
          </button>
        </form>
      </div>
    </ModalLayout>
  );
};

export default ItemUnitModal;
