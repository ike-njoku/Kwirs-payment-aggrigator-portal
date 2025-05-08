"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "../shared-components/table/ItemUnit";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";
import ItemUnitModal from "../shared-components/modals/ItemUnitModal";
import EditItemUnitModal from "../shared-components/modals/EditItemUnitModal";
import { FaPlus } from "react-icons/fa";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ItemUnitsPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [selectedItemUnit, setSelectedItemUnit] = useState([]);
  const [itemUnits, setItemUnits] = useState([]);
  const [openAgencyModal, setOpenAgencyModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [error, setError] = useState("");

// ✅ Fetch Item Units Function
const fetchItemUnits = async () => {
  try {
    const response = await AxiosGet(`${API_BASE_URL}/api/Inventory/ItemUnits/GetAll`);
    if (response?.data?.Data) {
      setItemUnits(response.data.Data);
    } else {
      setItemUnits([]); // ✅ Prevents undefined state
    }
  } catch (error) {
    console.error("❌ Error fetching item units:", error);
    toast.error("Failed to fetch item units");
  }
};


  // ✅ Refresh data whenever a change occurs
  const refreshItemUnits = () => {
    fetchItemUnits();
  };

  useEffect(() => {
    refreshItemUnits();
  }, []);

  const handleEditUnit = (unitCode) => {
    const selected = itemUnits.find((item) => item.unitCode === unitCode);
    if (selected) {
      setSelectedItemUnit(selected);
      setOpenEditModal(true);
    }
  };
  
  

  // ✅ Handle Delete
  const handleDeleteItemUnit = async (itemUnitId) => {
    if (!itemUnitId) {
      toast.error("Invalid item unit selected.");
      return;
    }
  
    try {
      const response = await AxiosGet(
        `${API_BASE_URL}/api/Inventory/ItemUnits/Delete/${itemUnitId}`
      );
  
      if (response?.data?.StatusCode === 200) {
        toast.success(response.data.StatusMessage || "Item unit deleted successfully!");
        fetchItemUnits(); // ✅ Refresh data after deleting
      } else {
        toast.error(response.data.StatusMessage || "Delete failed.");
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  

  return (
    <DashboardLayout page="Item Unit">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="mt-4 flex gap-4 justify-between items-center">
            <button
              onClick={() => setOpenAgencyModal(true)}
              className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2"
              disabled={loading}
            >
              {loading ? "Processing..." : "Create Item Unit"}
              <FaPlus />
            </button>
          </div>
        </div>

        {/* ✅ Table */}
        <div className="w-[90%] mx-auto mt-6">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <CustomTable
            tableHeadings={["Unit Code", "Description", "Actions"]}
            tableData={itemUnits}
            handleEdit={handleEditUnit}
            handleDelete={handleDeleteItemUnit}
            loading={loading}
          />
          
          )}
        </div>

{/* ✅ Create Item Unit Modal */}
{openAgencyModal && (
  <ItemUnitModal
    isOpen={openAgencyModal}
    onClose={() => setOpenAgencyModal(false)}
    refreshItemUnits={refreshItemUnits} // ✅ Auto-refresh on close
  />
)}


    {/* ✅ Edit Item Unit Modal */}
{openEditModal && selectedItemUnit && (
  <EditItemUnitModal
    isOpen={openEditModal}
    onClose={() => setOpenEditModal(false)}
    itemUnit={selectedItemUnit} // Pass the selected item unit data
    refreshItemUnits={refreshItemUnits} // Pass the function to refresh item units
  />
)}




      </section>
    </DashboardLayout>
  );
};

export default ItemUnitsPage;







