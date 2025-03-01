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

  const toggleUserStatus = async (index) => {
    const user = index;
    user.Isactive = user.IsActive == false ? true : false;

    user.isActive = user.Isactive;
    user.remark = "";
    const updateUserStatusURL =
      "http://nofifications.fctirs.gov.ng/api/userManagement/updateAccountStatus";
    const apiResponse = await AxiosPost(updateUserStatusURL, user);

    if (apiResponse && apiResponse.StatusCode != 200) {
      toast.error("Could not Update User Status");
      return;
    }
    setUserList((prevUsers) =>
      prevUsers.map((user, i) => user.isActive == user.Isactive)
    );

    await getAllUsers();
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
    console.log("openUserModal");
  };

  const handleCloseDetailsModal = () => {
    setOpenModal(false);
  };

  const getAllUsers = async () => {
    const response = await AxiosGet(
      "http://nofifications.fctirs.gov.ng/api/userManagement/GetAllUser"
    );

    const { data } = response;
    if (!data.StatusCode) {
      toast.error("Failed to fetch Users");
      return;
    }

    const userList = data.Data;

    userList.map((user) => (user.userName = user.UserName));
    userList.map((user) => (user.email = user.Email));
    userList.map((user) => (user.phone = user.PrimaryPhone));
    userList.map((user) => (user.isActive = user.IsActive));

    setUserList(userList);
  };

  const updateUserRole = async (index, role) => {
    console.log(index, role);
    setUserList((prevUsers) =>
      prevUsers.map((user, i) => (i === index ? { ...user, role } : user))
    );
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
        <thead class="text-xs text-white uppercase bg-pumpkin">
          <tr>
            <th scope="col" class="px-6 py-3">
              Username
            </th>
            <th scope="col" class="px-6 py-3">
              Email
            </th>
            <th scope="col" class="px-6 py-3">
              Phone Number
            </th>

            {!isRoleAllocation && (
              <th scope="col" class="px-6 py-3">
                Status
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 &&
            userList.map((user, i) => (
              <tr
                className="odd:bg-white even:bg-gray-100 border-b border-gray-200"
                key={i}
              >
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 cursor-pointer hover:underline hover:text-pumpkin"
                  onClick={() => openUserModal(user)}
                >
                  {user.userName}
                </td>
                <td class="px-6 py-4 text-gray-900 ">{user.email}</td>
                <td class="px-6 py-4 text-gray-900">{user.phone}</td>

                {!isRoleAllocation && (
                  <td class="px-6 py-4 text-gray-900">
                    <SwitchIcon
                      isActive={user.isActive}
                      onToggle={toggleUserStatus}
                      index={user}
                    />
                  </td>
                )}
              </tr>
            ))}

          {userList.length === 0 && (
            <tr>
              <td colSpan={5} className="bg-white">
                <h3 className="w-full font-semibold py-5 text-2xl text-center">
                  No data available
                </h3>
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
