"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { resourcesTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateResourceModal from "../shared-components/modals/CreateResourceModal";
import { AxiosPost } from "../../services/http-service";
import { authenticateUser } from "../../services/auth-service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import UsersTable from "../users";

const ResourcesPage = () => {
  const router = useRouter();
  const tableHeadings = ["Name", "Resource URL", "Actions"];
  const [tableData, setTableData] = useState(resourcesTableData);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openResourceModal, setOpenResourceModal] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState({});
  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
  };

  const handleDeleteItem = (id) => {
    const filteredTableData = tableData.filter((item) => id !== item.id);
    setTableData(filteredTableData);
    setOpenDeleteModal(false);
  };

  const handleEditItem = async (updatedItem, newRole) => {
    if (newRole) {
      const updateResourceURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/Resources/Update`;
      updatedItem.ResourceName = newRole;
      updatedItem.Username;
      updatedItem.URL = newRole;

      const updateResourceResponse = await AxiosPost(
        updateResourceURL,
        updatedItem
      );

      if (!updateResourceResponse.StatusCode == 200) {
        toast.error("Could not update Resource at this time");
        return;
      }

      toast.success("Resource updated");
      setTableData((prevData) =>
        prevData.map((item) =>
          item.id === updatedItem.id ? { ...updatedItem, name: newRole } : item
        )
      );
    }
  };

  const handleCloseCreateRoleModal = () => {
    setOpenResourceModal(false);
  };

  const handleOpenCreateResourceModal = () => {
    setOpenResourceModal(true);
  };

  const handleCreateResourceModal = (newRole) => {
    const newRoleData = {
      name: newRole,
      id: tableData.length + 1,
      dateCreated: "Tomorrow",
    };

    setTableData([...tableData, newRoleData]);
  };

  useEffect(() => {
    const isUserAuthenticated = authenticateUser();

    setAuthenticatedUser(isUserAuthenticated);
    // fetchAllResources();
  }, []);

  return (
    <DashboardLayout page="Role Allocation">
      <section className="w-full">
        <div className=" w-[90%] mx-auto py-5">
          <div className=" w-full lg:mt-10">
            {/* search bar and filter options here */}
            {/* table */}
            <UsersTable isRoleAllocation={true} />
          </div>
        </div>
        {openResourceModal && (
          <CreateResourceModal
            handleCloseModal={handleCloseCreateRoleModal}
            handleCreateModal={handleCreateResourceModal}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default ResourcesPage;
