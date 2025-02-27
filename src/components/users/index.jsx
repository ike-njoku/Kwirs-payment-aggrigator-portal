"use client";
import React, { useEffect, useState } from "react";
import { usersList } from "../../utils/app_data";
import SwitchIcon from "./SwitchIcon";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";

const UsersTable = () => {
  const [userList, setUserList] = useState(usersList);

  const toggleUserStatus = (index) => {
    console.log(index);
    setUserList((prevUsers) =>
      prevUsers.map((user, i) =>
        i === index ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const openUserModal = () => {
    console.log("openUserModal");
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
            <th scope="col" class="px-6 py-3">
              Role
            </th>
            <th scope="col" class="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 &&
            userList.map((user, i) => (
              <tr
                className="odd:bg-white even:bg-gray-100 border-b border-gray-200"
                key={i}
                onClick={openUserModal}
                style={{ cursor: "pointer" }}
              >
                <td scope="row" class="px-6 py-4 font-medium text-gray-900 ">
                  {user.userName}
                </td>
                <td class="px-6 py-4 text-gray-900 ">{user.email}</td>
                <td class="px-6 py-4 text-gray-900">{user.phone}</td>
                <td class="px-6 py-4 text-gray-900">{user.role}</td>
                <td class="px-6 py-4 text-gray-900">
                  <SwitchIcon
                    isActive={user.isActive}
                    onToggle={toggleUserStatus}
                    index={i}
                  />
                </td>
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
    </div>
  );
};

export default UsersTable;
