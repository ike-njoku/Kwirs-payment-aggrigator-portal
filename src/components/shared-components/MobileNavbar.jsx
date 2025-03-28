"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { sidebarMenu } from "../../utils/app_data";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { authenticateUser } from "../../services/auth-service";
import { AxiosPost } from "../../services/http-service";

const MobileNavbar = ({ openNav, handleCloseNav }) => {
  const pathname = usePathname();
  const [_sidebarMenu, setSideBarMenu] = useState(sidebarMenu);
  const [authenticatedUser, setAuthenticatedUser] = useState({});

  const getUserMenuItems = async () => {
    const requestURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/Menue/GetUserMenueItems`;

    const apiResponse = await AxiosPost(requestURL, {
      UserName: authenticatesUser?.tin,
    });

    if (!apiResponse || apiResponse.StatusCode !== 200) {
      toast.error("Could not fetch Menu Items. Please reload the page");
      return;
    }

    const { Data } = apiResponse;
    setSideBarMenu(Data);
    return;
  };

  useEffect(() => {
    setAuthenticatedUser(authenticateUser);
    getUserMenuItems();
  }, []);

  return (
    <section
      className={`${
        openNav ? "translate-x-0" : "translate-x-[1000px]"
      } fixed bg-[rgba(0,0,0,0.7)] top-0 left-0 right-0 bottom-0 transition-all z-[24]`}
    >
      <div className="w-full max-w-[300px] h-full p-6 bg-white">
        <div className="flex justify-end">
          <button className="text-pumpkin text-2xl" onClick={handleCloseNav}>
            <IoMdClose />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <figure className="m-0 p-0 w-[50px] h-[50px] relative border border-black rounded-[50%] overflow-hidden">
            <Image
              fill
              alt="user-pic"
              src="/images/avatar.jpeg"
              className="object-cover"
            />
          </figure>
          <article className="flex flex-col gap-1">
            <h5 className="text-base capitalize text-black font-semibold">
              Jane Doe
            </h5>
            <p className="text-black font-light text-sm">Software Engineer</p>
          </article>
        </div>

        <div className="w-full py-5 mt-10">
          <ul className="w-full flex flex-col gap-6">
            {/* use _sidebarMenu to get menus from the backend */}
            {_sidebarMenu.map((menu, i) => (
              <li
                className={`w-full px-6 flex gap-2 items-center text-lg text-black capitalize py-2 ${
                  pathname.includes(menu.url) &&
                  "bg-pumpkin text-white rounded-[30px]"
                }`}
                key={i}
              >
                {menu.icon} <Link href={menu.url}>{menu.path}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MobileNavbar;
