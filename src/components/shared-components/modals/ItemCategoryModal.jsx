import { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout"; 
import { AxiosPost, AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";

const ItemCategoryModal = ({ onClose, refreshItemCategories }) => {
  const [catCode, setCatCode] = useState("");
  const [description, setDescription] = useState("");
  const [accountCode, setAccountCode] = useState("");
  const [itemCategories, setItemCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // ✅ Fetch item categories on mount
  useEffect(() => {
    fetchItemCategories();
  }, []);

  const fetchItemCategories = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Inventory/ItemCategory/GetAll`);
      setItemCategories(response?.data?.Data || []);
    } catch (error) {
      console.error("❌ Error fetching item categories:", error);
      toast.error("Failed to fetch item categories");
    }
  };

  const handleCreateItemCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const payload = {
      catCode,
      description,
      accountCode,
    };

    console.log("🚀 Sending API request with:", payload);

  
    try {
      const response = await AxiosPost(
        `${API_BASE_URL}/api/Inventory/ItemCategory/Create`,
        payload);
  
      console.log("✅ API Response:", response);

         if (!response || response.StatusCode !== 200) {
              toast.error(response?.StatusMessage || "Failed to create item category.");
              return;
            }
      
            toast.success(response.StatusMessage || "Item category created successfully");
            fetchItemCategories();
  
            if (typeof refreshItemCategories === "function") {
        refreshItemCategories(); // refresh parent
  onClose(); // close immediately
     } 
    } catch (error) {
      console.error("❌ Create error:", error);
      toast.error("Failed to create Item Category.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Create Item Category
        </h3>
        <form className="w-full mt-4" onSubmit={handleCreateItemCategory} autoComplete="off">
          {/* Category Code */}
          <div className="w-full mb-4">
            {/* <label className="text-base font-medium text-gray-700">Category Code</label> */}
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={catCode}
              onChange={(e) => setCatCode(e.target.value)}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-pumpkin text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? "Processing..." : "Create Item Category"}
          </button>
        </form>
      </div>
    </ModalLayout>
  );
};

export default ItemCategoryModal;















