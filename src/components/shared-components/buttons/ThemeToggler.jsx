"use client";
import React, { useContext, useState } from "react";
import { ThemeContext } from "@/context/ThemeProvider";
import { MdOutlineLightMode } from "react-icons/md";
import { FaMoon } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";

const ThemeToggler = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [expandToggler, setExpandToggler] = useState(false);

  const handleExpandToggler = () => {
    setExpandToggler(true);
  };

  const closeToggler = (mode) => {
    setExpandToggler(false);
  };
  return (
    <div
      className={`fixed bottom-4 right-4 z-[24] py-1  transition-all duration-300  ${
        expandToggler ? "w-full max-w-[120px] " : " w-fit"
      }`}
    >
      <div
        className={`w-full relative flex justify-end items-center gap-2 transition-all ${
          expandToggler &&
          "bg-white shadow-2xl border dark:shadow-none  dark:bg-darkSurface py-1 rounded-3xl dark:border-none "
        }`}
      >
        <button
          onClick={handleExpandToggler}
          className={`text-pumpkin  w-full flex gap-2 items-center justify-center`}
        >
          <span className={`text-3xl ${expandToggler && "text-xl"}`}>
            {theme === "dark" ? <FaMoon /> : <MdOutlineLightMode />}
          </span>{" "}
          {expandToggler && (
            <span className="capitalize text-base">
              {theme === "dark" ? "dark" : "light"}
            </span>
          )}
        </button>

        {expandToggler && (
          <div className="w-full absolute -top-28 bg-white shadow-2xl border dark:border-none dark:shadow-none dark:bg-darkSurface dark:text-white rounded-lg py-2">
            <div className="w-full flex justify-end pb-2 px-3">
              <button className="ml-auto" onClick={closeToggler}>
                <FaTimesCircle className="text-pumpkin dark:text-darkMPumpkin text-lg" />
              </button>
            </div>

            <ul className="w-full flex flex-col gap-1 ">
              <li className="w-full py-1 px-3 text-sm hover:bg-[#dfdcdc] dark:hover:bg-[#717171]">
                <button
                  onClick={() => {
                    toggleTheme("light");
                  }}
                  className={`w-full flex gap-2 items-center justify-start capitalize`}
                >
                  Light mode
                </button>
              </li>

              <li className="w-full py-1 text-sm px-3 dark:hover:bg-[#717171] hover:bg-[#dfdcdc]">
                <button
                  onClick={() => {
                    toggleTheme("dark");
                  }}
                  className={`w-full flex gap-2 items-center justify-start capitalize`}
                >
                  dark mode
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeToggler;
