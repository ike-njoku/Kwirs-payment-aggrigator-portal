"use client";
import React, { useEffect, useState } from "react";
import { usersList } from "../../utils/app_data";
import SwitchIcon from "./SwitchIcon";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { toast } from "react-toastify";
import UserDetailsModal from "../shared-components/modals/UserDetailsModal";

const UsersTable = ({ isRoleAllocation = false }) => {
  const [userList, setUserList] = useState(usersList);
  const [selectedUser, setSelectedUser] = useState({});
  const [openModal, setOpenModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Number of users per page

  // Get current users for the page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userList.slice(indexOfFirstUser, indexOfLastUser);

  // Change Page
  const nextPage = () => {
    if (currentPage < Math.ceil(userList.length / usersPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleUserStatus = async (index) => {
    setUserList((prevUsers) =>
      prevUsers.map((user, i) =>
        i === index ? { ...user, isActive: !user.isActive } : user
      )
    );
  
    const updatedUser = { ...userList[index], isActive: !userList[index].isActive, remark: "" };
  
    const updateUserStatusURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/userManagement/updateAccountStatus`;
    const apiResponse = await AxiosPost(updateUserStatusURL, updatedUser);
  
    if (apiResponse && apiResponse.StatusCode !== 200) {
      toast.error("Could not Update User Status");
      return;
    }
  
    // Refresh user list
    await getAllUsers();
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenModal(false);
  };

  const getAllUsers = async () => {
    const response = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/userManagement/GetAllUser`
    );
    if (!response) {
      toast.error("Could not fetch users");
      return;
    }
    const { data } = response;
    if (!data.StatusCode) {
      toast.error("Failed to fetch Users");
      return;
    }

    const userList = data.Data.map((user) => ({
      userName: user.UserName,
      email: user.Email,
      phone: user.PrimaryPhone,
      isActive: user.IsActive,
    }));

    setUserList(userList);
  };

  const updateUserRole = async (index, role) => {
    setUserList((prevUsers) =>
      prevUsers.map((user, i) => (i === index ? { ...user, role } : user))
    );
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-white uppercase bg-pumpkin">
          <tr>
            <th scope="col" className="px-6 py-3">Username</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Phone Number</th>
            {!isRoleAllocation ? (
              <th scope="col" className="px-6 py-3">Status</th>
            ) : (
              <th scope="col" className="px-6 py-3">Role(s)</th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 &&
            currentUsers.map((user, i) => (
              <tr
                className="odd:bg-white even:bg-gray-100 border-b border-gray-200 cursor-pointer"
                key={i}
                onClick={() => openUserModal(user)}
              >
                <td className="px-6 py-4 font-medium text-gray-900">{user.userName}</td>
                <td className="px-6 py-4 text-gray-900">{user.email}</td>
                <td className="px-6 py-4 text-gray-900">{user.phone}</td>
                {!isRoleAllocation ? (
                  <td className="px-6 py-4 text-gray-900">
                    <SwitchIcon isActive={user.isActive} onToggle={() => toggleUserStatus(i)} />
                  </td>
                ) : (
                  <td className="px-6 py-4 text-gray-900">...</td>
                )}
              </tr>
            ))}
          {currentUsers.length === 0 && (
            <tr>
              <td colSpan={5} className="bg-white text-center py-5">
                <h3 className="w-full font-semibold text-2xl">No data available</h3>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 px-4 py-2 bg-gray-100">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm font-medium rounded ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-pumpkin text-white hover:bg-orange-600"
          }`}
        >
          Previous
        </button>

        <span className="text-sm font-medium">
          Page {currentPage} of {Math.ceil(userList.length / usersPerPage)}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage >= Math.ceil(userList.length / usersPerPage)}
          className={`px-4 py-2 text-sm font-medium rounded ${
            currentPage >= Math.ceil(userList.length / usersPerPage) ? "bg-gray-300 cursor-not-allowed" : "bg-pumpkin text-white hover:bg-orange-600"
          }`}
        >
          Next
        </button>
      </div>

      {openModal && (
        <UserDetailsModal
          handleCloseModal={handleCloseDetailsModal}
          user={selectedUser}
          setUserList={setUserList}
          isRoleAllocation={isRoleAllocation}
        />
      )}
    </div>
  );
};

export default UsersTable;

