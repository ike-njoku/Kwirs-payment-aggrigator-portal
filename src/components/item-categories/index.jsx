"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "../shared-components/table/ItemCategories";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";
import ItemCategoryModal from "../shared-components/modals/ItemCategoryModal";
import EditItemCategoryModal from "../shared-components/modals/EditItemCategories";
import { FaPlus } from "react-icons/fa";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ItemCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [itemCategories, setItemCategories] = useState([]);
  const [openAgencyModal, setOpenAgencyModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [error, setError] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null); // Only for delete

  // ✅ Fetch Item Categories
  const fetchItemCategories = async () => {
    try {
      setLoading(true);
      const response = await AxiosGet(`${API_BASE_URL}/api/Inventory/ItemCategory/GetAll`);
      if (response?.data?.Data) {
        setItemCategories(response.data.Data);
        console.log("✅ Categories:", response.data.Data); // Optional debug
      } else {
        setItemCategories([]);
      }
    } catch (error) {
      console.error("❌ Error fetching item categories:", error);
      toast.error("Failed to fetch item categories");
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemCategories();
  }, []);

  const refreshItemCategories = () => {
    fetchItemCategories();
  };

  // ✅ Handle Delete
  const handleDeleteItemCategory = async (itemCategoryId) => {
    if (!itemCategoryId) {
      toast.error("Invalid item category selected.");
      return;
    }

    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Inventory/ItemCategory/Delete/${itemCategoryId}`);
      if (response?.data?.StatusCode === 200) {
        toast.success(response.data.StatusMessage || "Item category deleted successfully!");
        fetchItemCategories();
        setOpenDeleteModal(false);
      } else {
        toast.error(response.data.StatusMessage || "Delete failed.");
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <DashboardLayout page="Item Categories">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="mt-4 flex gap-4 justify-between items-center">
            <button
              onClick={() => setOpenAgencyModal(true)}
              className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2"
              disabled={loading}
            >
              {loading ? "Processing..." : "Create Item Category"}
              <FaPlus />
            </button>
          </div>
        </div>

        {/* ✅ Table Section */}
        <div className="w-[90%] mx-auto mt-6">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <CustomTable
              tableHeadings={["Category Code", "Description", "Account Code", "Actions"]}
              tableData={itemCategories}
              setOpenDeleteModal={setOpenDeleteModal}
              openDeleteModal={openDeleteModal}
              handleItem={handleDeleteItemCategory}
              setOpenEditModal={setOpenEditModal}
              openEditModal={openEditModal}
              handleEditItem={(item) => {
                setSelectedCategory(item); // ✅ Correctly set category for edit
                setOpenEditModal(true);
              }}
              handleDeleteItem={(id) => {
                setSelectedItemId(id);
                setOpenDeleteModal(true);
              }}
              loading={loading}
              text="Are You Sure You Want To Delete Item Category?"
            />
          )}
        </div>

        {/* ✅ Create Item Category Modal */}
        {openAgencyModal && (
          <ItemCategoryModal
            isOpen={openAgencyModal}
            onClose={() => setOpenAgencyModal(false)}
            refreshItemCategories={refreshItemCategories}
          />
        )}

        {/* ✅ Edit Item Category Modal */}
        {openEditModal && selectedCategory && (
          <EditItemCategoryModal
            isOpen={openEditModal}
            onClose={() => setOpenEditModal(false)}
            categoryData={selectedCategory}
            refreshItemCategories={refreshItemCategories}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default ItemCategoryPage;