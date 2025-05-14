"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "../shared-components/table/StoreIssue";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";
import StoreIssueModal from "../shared-components/modals/StoreIssueModal";
import EditStoreIssueModal from "../shared-components/modals/EditStoreIssueModal";
import { FaPlus } from "react-icons/fa";
import EllipseDropdown from "../shared-components/table/EllipseDropdown";


const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const StoreIssuesPage = () => {
  const [loading, setLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAgencyModal, setOpenAgencyModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [error, setError] = useState("");
  const [storeIssues, setStoreIssues] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); 
  



  useEffect(() => {
    fetchStoreIssues();
  }, []);

  // ✅ Fetch all store issues
  const fetchStoreIssues = async () => {
    setLoading(true);
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Inventory/StoreIssue/GetAll`);
      setStoreIssues(response?.data?.Data || []);
      setError("");
    } catch (error) {
      console.error("Error fetching store issues:", error);
      setError("Failed to fetch store issues.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle edit
const handleEditItem = (item) => {
  setSelectedIssue(item);
  setOpenEditModal(true);
};


  // ✅ Handle delete
  const handleDeleteIssue = async (issueId) => {
    if (!issueId) {
      toast.error("Invalid issue selected.");
      return;
    }

    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Inventory/StoreIssue/Delete/${issueId}`);
      if (response?.data?.StatusCode === 200) {
        toast.success(response.data.StatusMessage || "Store issue deleted successfully!");
        fetchStoreIssues();

        setOpenDeleteModal(false);

      } else {
        toast.error(response.data.StatusMessage || "Delete failed.");
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // ✅ Modal close
  const handleCloseModal = () => {
    setOpenEditModal(false);
    setSelectedIssue(null);
  };

  return (
    <DashboardLayout page="Store Issues">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="mt-4 flex gap-4 justify-between items-center">
            <button
              onClick={() => setOpenAgencyModal(true)}
              className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2"
              disabled={loading}
            >
              {loading ? "Processing..." : "Create Store Issue"}
              <FaPlus />
            </button>
          </div>
        </div>

        <div className="w-[90%] mx-auto mt-6">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <CustomTable
            tableHeading={[
              "Issue ID",
              "Description",
              "Qty",
              "Store",
              "Issued To",
              "SIV No",
              "Issued Date",
              "Created By",
              "Actions",
            ]}
            tableData={storeIssues}
            setOpenDeleteModal={setOpenDeleteModal}
            handleItem={handleDeleteIssue}  // ✅ Important
            // handleItem={handleItem} // ✅ make sure this is passed
            openDeleteModal={openDeleteModal}
            setOpenEditModal={setOpenEditModal}
            openEditModal={openEditModal}
            handleEditItem={(item) => {
              setSelectedIssue(item);
              setOpenEditModal(true);
            }}
            handleDeleteItem={(id) => {
              setSelectedItem(id);
              setOpenDeleteModal(true);
            }}
            loading={loading}
            text="Are You Sure You Want To Delete Store Issue?"
          />
          
          )}
        </div>

        {/* Create Modal */}
        {openAgencyModal && (
          <StoreIssueModal
            isOpen={openAgencyModal}
            onClose={() => setOpenAgencyModal(false)}
            refreshStoreIssues={fetchStoreIssues}
          />
        )}

        {/* Edit Modal */}
        {openEditModal && (
    <EditStoreIssueModal
  isOpen={openEditModal}
  onClose={handleCloseModal}
  selectedIssue={selectedIssue} // ✅ must match prop name
  refreshStoreIssues={fetchStoreIssues}
/>

      
        )}
      </section>
    </DashboardLayout>
  );
};

export default StoreIssuesPage;











