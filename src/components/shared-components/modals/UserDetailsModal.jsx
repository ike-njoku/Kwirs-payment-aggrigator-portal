"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const UserDetailsModal = ({ handleCloseModal, user, i }) => {
  console.log(user);
  const [formValues, setFormValues] = useState({
    userName: user.userName,
    email: user.email,
    phone: user.phone,
  });

  const handleOnChange = (e) => {
    const name = e.target.name;
    setFormValues((prev) => ({ ...prev, [name]: e.target.value }));
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <article className="mt-5 w-full border-b border-b-gray-500 text-gray-700 flex items-center gap-3 justify-between">
          <h3 className="my-5 text-lg font-semibold ">User Details</h3>

          <h3 className=" flex items-center text-base gap-1">
            <span className={`flex items-center gap-2`}>
              {user.isActive ? "Active" : "Inactive"}{" "}
            </span>
            <span
              className={`w-[10px] h-[10px] rounded-[50%] inline-block ${
                user.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>{" "}
          </h3>
        </article>

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
            {/* <AuthButtons label="Update" textColor="text-white" /> */}
          </div>
        </form>
      </div>
    </ModalLayout>
  );
};

export default UserDetailsModal;
