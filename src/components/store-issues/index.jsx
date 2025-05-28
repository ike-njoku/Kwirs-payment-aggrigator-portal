"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "../shared-components/table/StoreIssue";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";
import StoreIssueModal from "../shared-components/modals/StoreIssueModal";
import EditStoreIssueModal from "../shared-components/modals/EditStoreIssueModal";
import FilterModal from "../shared-components/modals/FilterModal";
import { FaPlus, FaFilter } from "react-icons/fa";
import PrintButton from "../shared-components/PrintButton";


const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const StoreIssuesPage = () => {
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAgencyModal, setOpenAgencyModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [storeIssues, setStoreIssues] = useState([]);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    item: "",
    date: "",
    store: "",
    // vendor: "",
    // customer: "",
  });

  const [stores, setStores] = useState([]);
  // const [vendors, setVendors] = useState([]);
  // const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  // Fetch dropdown/filter options once on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Whenever filters change, fetch or filter store issues immediately
  useEffect(() => {
    fetchStoreIssues();
  }, [filters]);

  // Fetch dropdown/filter option data
  const fetchFilterOptions = async () => {
    try {
      const [storeRes, /* vendorRes, customerRes, */ itemRes] = await Promise.all([
        AxiosGet(`${API_BASE_URL}/api/StoreBranches/GetAll`),
        // AxiosGet(`${API_BASE_URL}/api/Vendors/GetAll`),
        // AxiosGet(`${API_BASE_URL}/api/Customers/GetAll`),
        AxiosGet(`${API_BASE_URL}/api/Inventory/ItemDetails/GetAll`),
      ]);
      setStores(storeRes?.data?.Data || []);
      // setVendors(vendorRes?.data?.Data || []);
      // setCustomers(customerRes?.data?.Data || []);
      setItems(itemRes?.data?.Data || []);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      toast.error("Failed to load filter options");
    }
  };

  // Fetch store issues and apply local filtering based on current filters
const fetchStoreIssues = async () => {
  setLoading(true);
  try {
    const response = await AxiosGet(`${API_BASE_URL}/api/Inventory/StoreIssue/GetAll`);
    let data = response?.data?.Data || [];

    data = data.filter((item) => {
      // Safe string values to avoid errors
      const description = (item.description || "").toString().toLowerCase();
const date = (item.IssuedDate || "").toString().slice(0, 10);
      const storeName = (item.Store || item.storeBranchName || "").toString().toLowerCase();

      const filterItem = filters.item.trim().toLowerCase();
      const filterDate = filters.date.trim();
      const filterStore = filters.store.trim().toLowerCase();

      const matchItem = filterItem ? description.includes(filterItem) : true;
      const matchDate = filterDate ? date === filterDate : true;
      const matchStore = filterStore ? storeName.includes(filterStore) : true;

      return matchItem && matchDate && matchStore;
    });

    setStoreIssues(data);
    setError("");
  } catch (error) {
    console.error("Error fetching store issues:", error);
    setError("Failed to fetch store issues.");
    setStoreIssues([]);
  } finally {
    setLoading(false);
  }
};


  // Open Edit modal with selected issue data
  const handleEditItem = (item) => {
    setSelectedIssue(item);
    setOpenEditModal(true);
  };

  // Delete issue handler
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

  const handleCloseModal = () => {
    setOpenEditModal(false);
    setSelectedIssue(null);
  };

  return (
    <DashboardLayout page="Store Issues">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5 flex justify-between items-center">
          <button
            onClick={() => setOpenAgencyModal(true)}
            className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2"
            disabled={loading}
          >
            {loading ? "Processing..." : "Create Store Issue"}
            <FaPlus />
          </button>

          <button
            onClick={() => setOpenFilterModal(true)}
            className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2"
          >
            <FaFilter />
            Filter
          </button>
                        <PrintButton data={storeIssues} fileName="store_issues_list.csv" />
          
        </div>

        {/* Table */}
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
              handleItem={handleDeleteIssue}
              openDeleteModal={openDeleteModal}
              setOpenEditModal={setOpenEditModal}
              openEditModal={openEditModal}
              handleEditItem={handleEditItem}
              handleDeleteItem={(id) => {
                setSelectedIssue(id);
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
            selectedIssue={selectedIssue}
            refreshStoreIssues={fetchStoreIssues}
          />
        )}

        {/* Filter Modal */}
        {openFilterModal && (
          <FilterModal
            isOpen={openFilterModal}
            onClose={() => setOpenFilterModal(false)}
            filters={filters}
            setFilters={setFilters} // directly updates filters, triggers useEffect fetch
            stores={stores}
            // vendors={vendors}
            // customers={customers}
            items={items}
            onApply={() => {}} // not needed, filters auto-apply
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default StoreIssuesPage;
