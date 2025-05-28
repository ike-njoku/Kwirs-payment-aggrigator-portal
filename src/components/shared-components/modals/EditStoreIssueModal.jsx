import { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import { AxiosPost, AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EditStoreIssueModal = ({ isOpen, onClose, selectedIssue, refreshStoreIssues }) => {
  const [itemCode, setItemCode] = useState("");
  const [qty, setQty] = useState("");
  const [storeBranchId, setStoreBranchId] = useState("");
  const [issueTo, setIssueTo] = useState("");
  const [SIVNo, setSIVNo] = useState("");
  const [issueDate, setIssueDate] = useState(""); // Renamed state for date
  const [createdBy, setCreatedBy] = useState("");
  const [issueId, setIssueId] = useState("");
  const [items, setItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedIssue) {
      setIssueId(selectedIssue.issueId || "");
      setItemCode(selectedIssue.itemCode || "");
      setQty(selectedIssue.qty || "");
      setStoreBranchId(selectedIssue.storeBranchId || "");
      setIssueTo(selectedIssue.issueTo || "");
      setSIVNo(selectedIssue.SIVNo || "");

      // Format the date to match the requested format: "yyyy-MM-ddTHH:mm"
      const formattedDate = selectedIssue.Date && !isNaN(new Date(selectedIssue.Date).getTime()) 
        ? new Date(selectedIssue.Date).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16);  // Default to current date if invalid

      setIssueDate(formattedDate); // Store the formatted date in state
      setCreatedBy(selectedIssue.createdBy || "");
    }
  }, [selectedIssue]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare the payload with the formatted date
    const payload = {
      ItemCode: itemCode,
      qty: parseInt(qty),
      storeBranchId: parseInt(storeBranchId),
      issuedTo: issueTo,
      SIV: SIVNo,
      Date: issueDate,
      createdBy,
      issueid: parseInt(issueId),
    };
    

    try {
      const res = await AxiosPost(`${API_BASE_URL}/api/Inventory/StoreIssue/Update`, payload);
      if (!res || res.StatusCode !== 200) {
        toast.error(res?.StatusMessage || "Failed to update store issue");
        return;
      }

      toast.success(res.StatusMessage || "Store issue updated successfully");
      refreshStoreIssues();
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error("❌ Update error:", error?.response || error);
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
          Edit Store Issue
        </h3>
        <form className="w-full mt-4" onSubmit={handleUpdate} autoComplete="off">
          {/* Hidden Issue ID */}
          <input type="hidden" value={issueId} />

          {/* Item Dropdown */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Item</label>
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

          {/* Quantity */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Quantity</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              min={1}
              required
            />
          </div>

          {/* Store Branch Dropdown */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Store Branch</label>
            <select
              value={storeBranchId}
              onChange={(e) => setStoreBranchId(e.target.value)}
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

          {/* Issued To */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Issued To</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={issueTo}
              onChange={(e) => setIssueTo(e.target.value)}
              required
            />
          </div>

          {/* SIV No */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">SIV No</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={SIVNo}
              onChange={(e) => setSIVNo(e.target.value)}
              required
            />
          </div>

          {/* Issued Date */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Issued Date</label>
            <input
              type="datetime-local"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={issueDate} // Use the formatted date here
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
          </div>

          {/* Hidden CreatedBy */}
          <input type="hidden" value={createdBy} />

          <button
            type="submit"
            className="w-full py-2 bg-pumpkin text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Store Issue"}
          </button>
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditStoreIssueModal;



