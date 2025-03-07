"use client";
import React, { useEffect, useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import Select from "react-select";
import { FaTimes } from "react-icons/fa";
import { AxiosGet, AxiosPost } from "@/services/http-service";
import { toast } from "react-toastify";

const UserDetailsModal = ({ handleCloseModal, user, isRoleAllocation }) => {
  const [options, setOptions] = useState([]);
  const [formValues, setFormValues] = useState({
    userName: user.userName,
    email: user.email,
    phone: user.phone,
  });
  const [userRoles, setRoles] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    const name = e.target.name;
    setFormValues((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleChangeRoles = (values) => {
    setRoles(values);
  };

  const [allUserRoles, setAllUserRoles] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const handleGetUserRole = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/Roles/GetUserRoles`;

      const payload = {
        UserName: user.UserName,
      };

      const apiResponse = await AxiosPost(apiUrl, payload);

      if (apiResponse && apiResponse.StatusCode !== 200) {
        toast.error("Could not fetch user roles!");
        return;
      }

      setAllUserRoles(apiResponse.Data);
    } catch (error) {}
  };

  const handleUpdateUserRole = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();

      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/Roles/AddUserToRole`;
      const payload = {
        UserName: user.userName,
        LoginUsername: user.email,
        RoleId: userRoles.value,
      };

      const apiResponse = await AxiosPost(apiUrl, payload);

      if (apiResponse && apiResponse.StatusCode !== 200) {
        toast.error("Could not update user role!");
        return;
      }

      toast.success("User role updated successfully!");
      setIsLoading(false);
      handleGetUserRole();
      handleCloseModal();
    } catch (error) {}
  };

  const handleDeleteRole = async (id) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/Roles/RemoveUserFromRole`;

      const payload = {
        UserName: user.email,
        RoleId: id,
      };
      const apiResponse = await AxiosPost(apiUrl, payload);
      if (apiResponse && apiResponse.StatusCode !== 200) {
        toast.error("Could not delete user role!");
        return;
      }
      handleGetUserRole();
    } catch (error) {}
  };

  const getRoles = async () => {
    const apiResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/Roles/GetAllRoles`
    );
    if (!apiResponse) toast.error("Could not fetch roles");

    const { data } = apiResponse;
    const tableData = data.Data.map((role) => ({
      name: role.Name,
      id: role.Id,
      dateCreated: new Date(role.UpdateDate).toISOString().split("T")[0],
    }));

    const roles = tableData.map((role) => ({
      value: role.id,
      label: role.name,
    }));
    setOptions(roles);
  };

  useEffect(() => {
    getRoles();
    handleGetUserRole();
  }, []);
  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <article className="mt-5 w-full border-b border-b-gray-500 text-gray-700 flex items-center gap-3 justify-between">
          <h3 className="my-5 text-lg font-semibold ">User Details</h3>

          <h3 className="flex items-center text-base gap-1">
            <span className="flex items-center gap-2">
              {user.isActive ? "Active" : "Inactive"}{" "}
            </span>
            <span
              className={`w-[10px] h-[10px] rounded-[50%] inline-block ${
                user.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>{" "}
          </h3>
        </article>

        {isRoleAllocation ? (
          <form className="w-full mt-5" onSubmit={handleUpdateUserRole}>
            <div className="w-full">
              <ul className="w-full flex flex-col gap-5 ">
                <li className="flex items-center gap-2 text-base">
                  <span className="font-semibold">Username:</span>
                  <span className="">{user.userName}</span>
                </li>
                <li className="flex items-center gap-2 text-base">
                  <span className="font-semibold">Email:</span>
                  <span className="">{user.email}</span>
                </li>
                <li className="flex items-center gap-2 text-base">
                  <span className="font-semibold">Phone:</span>
                  <span className="">{user.phone}</span>
                </li>
                <li className="flex items-center gap-2 text-base border-t border-t-gray-500 mt-2 pt-5">
                  <span className="font-semibold">Roles:</span>
                  <span className="flex w-full flex-wrap items-center gap-1">
                    {allUserRoles.length > 0 ? (
                      <>
                        {allUserRoles.map((roles, i) => (
                          <span
                            key={i}
                            className="cursor-pointer text-base relative role-hover p-1 hover:bg-gray-100"
                          >
                            {roles.Name}
                            {i !== allUserRoles.length - 1 && ","}
                            <button
                              className="absolute -top-2 -right-2 text-red-500 text-sm opacity-0"
                              onClick={() => handleDeleteRole(roles.Id)}
                            >
                              <FaTimes />
                            </button>
                          </span>
                        ))}
                      </>
                    ) : (
                      "No roles assigned."
                    )}
                  </span>
                </li>
              </ul>

              <div className="border-b-2 border-b-pumpkin w-full rounded-md my-4 custom-select">
                <Select options={options} onChange={handleChangeRoles} />
              </div>

              {/* undo the comment below to update user info */}
              <AuthButtons
                label="Update User Roles"
                textColor="text-white"
                isLoading={isLoading}
              />
            </div>
          </form>
        ) : (
          <form className="w-full mt-5" onSubmit={handleFormSubmit}>
            <div className="w-full">
              <div className="w-full">
                <label
                  className="text-base font-medium text-gray-700"
                  htmlFor="role"
                >
                  Username
                </label>

                <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
                  <input
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                    type="text"
                    value={formValues.userName}
                    onChange={handleOnChange}
                    placeholder="Enter username"
                    name="userName"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="w-full">
                <label
                  className="text-base font-medium text-gray-700"
                  htmlFor="role"
                >
                  Email
                </label>

                <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
                  <input
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                    type="text"
                    value={formValues.email}
                    onChange={handleOnChange}
                    placeholder="Enter email"
                    name="email"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="w-full">
                <label
                  className="text-base font-medium text-gray-700"
                  htmlFor="role"
                >
                  Phone
                </label>

                <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
                  <input
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                    type="text"
                    value={formValues.phone}
                    onChange={handleOnChange}
                    placeholder="Enter phone number"
                    name="phone"
                    disabled={true}
                  />
                </div>
              </div>

              {/* undo the comment below to update user info */}
              <AuthButtons
                label="Update"
                textColor="text-white"
                isLoading={isLoading}
              />
            </div>
          </form>
        )}
      </div>
    </ModalLayout>
  );
};

export default UserDetailsModal;
