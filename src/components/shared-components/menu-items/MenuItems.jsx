"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaUsers, FaTasks } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa6";
import Link from "next/link";

const MenuItems = ({ sidebarMenu }) => {
  const [showDropdown, setDropdown] = useState(null);
  const pathname = usePathname();

  const handleToggleDropdown = (index) => {
    setDropdown((prev) => (prev == index ? null : index));
  };

  return (
    <ul className="w-full flex flex-col gap-6">
      {/* use _sidebarMenu to get menus from the backend */}
      {sidebarMenu.map((menu, i) => (
        <li
          key={i}
          className={`w-full px-6  items-center text-lg text-black lg:text-white capitalize py-2 ${
            pathname.includes(menu.url) &&
            "bg-pumpkin text-white rounded-[30px]"
          }`}
        >
          <span
            className={`flex items-center gap-1 ${
              showDropdown == i && "text-pumpkin"
            }`}
          >
            <FaUsers />
            {menu?.MainMenu}{" "}
            <button
              className={`${showDropdown == i && "rotate-180"} transition-all`}
              onClick={() => handleToggleDropdown(i)}
            >
              <FaCaretDown />
            </button>
          </span>

          {showDropdown == i && (
            <ul className="flex flex-col gap-2 w-full">
              {menu?.submenu?.map((subMenu, j) => (
                <li
                  key={j}
                  className={`w-full px-2 flex gap-2 items-center text-lg text-black lg:text-white capitalize ${
                    pathname.includes(subMenu.URL) &&
                    "bg-pumpkin text-white rounded-[30px]"
                  }`}
                >
                  <Link
                    href={subMenu?.URL}
                    className="hover:text-pumpkin  flex gap-2 items-center"
                  >
                    <FaTasks /> {subMenu?.ResourceName}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MenuItems;
