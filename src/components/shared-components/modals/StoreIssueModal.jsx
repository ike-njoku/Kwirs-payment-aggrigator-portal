import { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import { AxiosPost, AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const StoreIssueModal = ({ onClose, refreshStoreIssues }) => {
  const [itemCode, setItemCode] = useState("");
  const [selectedStoreBranchId, setSelectedStoreBranchId] = useState("");
  const [qty, setQty] = useState("");
  const [siv, setSiv] = useState("");
  const [issuedTo, setIssuedTo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [itemList, setItemList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [createdBy, setCreatedBy] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("authDetails");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const tin = parsedUser?.tin;
        if (tin) setCreatedBy(tin);
        else toast.error("TIN not found. Please log in.");
      } catch {
        toast.error("Invalid user data.");
      }
    }
  }, []);

  useEffect(() => {
    fetchItems();
    fetchBranches();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await AxiosGet(`${API_BASE_URL}/api/Inventory/ItemDetails/GetAll`);
      setItemList(res?.data?.Data || []);
    } catch {
      toast.error("Failed to load items.");
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await AxiosGet(`${API_BASE_URL}/api/StoreBranches/GetAll`);
      setBranchList(res?.data?.Data || []);
    } catch {
      toast.error("Failed to load store branches.");
    }
  };

  const handleCreateStoreIssue = async (e) => {
    e.preventDefault();

    // Validate required fields including the store branch
    if (
      !itemCode ||
      !selectedStoreBranchId ||  // Check for empty store branch ID
      !qty ||
      !issuedTo ||
      !siv ||
      !createdBy
    ) {
      toast.error("All fields are required, including a valid store branch.");
      return;
    }

    if (parseInt(qty, 10) <= 0) {
      toast.error("Quantity must be greater than zero.");
      return;
    }

    const inputDate = new Date(date);
    if (inputDate > new Date()) {
      toast.error("Date cannot be in the future.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated. Please log in again.");
        return;
      }

      const payload = {
        ItemCode: parseInt(itemCode, 10),
        issueid: Math.floor(Math.random() * 100000),
        Date: inputDate.toISOString(),
        storeBranchId: parseInt(selectedStoreBranchId, 10),  // Use the parsedBranchId here
        createdBy,
        issuedTo,
        qty: parseInt(qty, 10),
        SIV: siv,
      };

      const response = await AxiosPost(
        `${API_BASE_URL}/api/Inventory/StoreIssue/Create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Store Branch ID before submission:", selectedStoreBranchId);

      if (response?.StatusCode === 200) {
        toast.success("Store issue recorded successfully.");
        refreshStoreIssues?.();

        // Reset fields after successful submission
        setItemCode("");
        setSelectedStoreBranchId("");
        setQty("");
        setIssuedTo("");
        setSiv("");
        setDate(new Date().toISOString().slice(0, 16));

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error(response.StatusMessage || "Failed to create store issue.");
      }
    } catch (error) {
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b text-gray-700">Create Store Issue</h3>
        <form onSubmit={handleCreateStoreIssue} className="mt-4 space-y-4">
          {/* Select Item */}
          <div>
            <label className="text-sm text-gray-700">Select Item</label>
            <select
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              className="w-full border-b-2 bg-gray-100 px-3 py-2"
              required
            >
              <option value="">-- Select Item --</option>
              {itemList.map((item) => (
                <option key={item.itemCode} value={item.itemCode}>
                  {item.description}
                </option>
              ))}
            </select>
          </div>

          {/* Store Branch */}
          <div>
            <label className="text-sm text-gray-700">Store Branch</label>
            <select
              value={selectedStoreBranchId}
              onChange={(e) => setSelectedStoreBranchId(e.target.value)}
              className="w-full border-b-2 bg-gray-100 px-3 py-2"
              required
            >
              <option value="">-- Select Branch --</option>
              {branchList.map((branch) => (
                <option key={branch.branchId} value={branch.branchId}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div>
            <label className="text-sm text-gray-700">Date & Time</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-b-2 bg-gray-100 px-3 py-2"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="text-sm text-gray-700">Quantity</label>
            <input
              type="text"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full border-b-2 bg-gray-100 px-3 py-2"
              required
            />
          </div>

          {/* Issued To */}
          <div>
            <label className="text-sm text-gray-700">Issued To</label>
            <input
              type="text"
              value={issuedTo}
              onChange={(e) => setIssuedTo(e.target.value)}
              className="w-full border-b-2 bg-gray-100 px-3 py-2"
              required
            />
          </div>

          {/* SIV */}
          <div>
            <label className="text-sm text-gray-700">SIV</label>
            <input
              type="text"
              value={siv}
              onChange={(e) => setSiv(e.target.value)}
              className="w-full border-b-2 bg-gray-100 px-3 py-2"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-pumpkin text-white font-semibold rounded-md"
          >
            {loading ? "Saving..." : "Submit Store Issue"}
          </button>
        </form>
      </div>
    </ModalLayout>
  );
};

export default StoreIssueModal;





