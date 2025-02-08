"use client";
import React, { useState } from "react";
import { usersList } from "../../utils/app_data";
import SwitchIcon from "./SwitchIcon";

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
          {userList.map((user, i) => (
            <tr
              className="odd:bg-white even:bg-gray-100 border-b border-gray-200"
              key={i}
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
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
