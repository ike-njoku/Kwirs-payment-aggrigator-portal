"use client";
import React, { useEffect, useState } from "react";
import { sidebarMenu } from "../../../utils/app_data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaBars } from "react-icons/fa6";
import MobileNavbar from "../MobileNavbar";
import { authenticateUser } from "../../../services/auth-service";
import { AxiosPost } from "../../../services/http-service";
import { toast } from "react-toastify";

const DashboardLayout = ({
  page = "Dashboard",
  subheading = "",
  children,
}) => {
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState({});
  const [_sidebarMenu, setSideBarMenu] = useState(sidebarMenu);

  const getUserMenuItems = async () => {
    const requestURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/Menue/GetUserMenueItems`;

    const apiResponse = await AxiosPost(requestURL, {
      UserName: authenticateUser?.tin,
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
    // getUserMenuItems(); undo this comment when the time comes
  }, []);

  const handleOpenNav = () => {
    setOpenNav(true);
  };
  const handleCloseNav = () => {
    setOpenNav(false);
  };
  return (
    <section className="w-full ">
      <div className="fixed max-w-[250px] w-full hidden lg:block top-0 left-0 bottom-0 bg-[rgba(32,32,32,1)]">
        <div className="w-full h-full py-6 text-white">
          <h3 className="w-full font-bold text-xl italic px-8 my-5">
            Quantum<span className="text-pumpkin">Gateway</span>
          </h3>

          <div className="w-full py-5 mt-10">
            <ul className="w-full custom-scrollbar flex flex-col gap-6 max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
              {/* use _sidebarMenu to get menus from the backend */}
              {sidebarMenu.map((menu, i) => (
                <li
                  className={`w-full px-8 flex gap-2 items-center text-sm text-white capitalize py-2 ${
                    pathname.includes(menu.url) && "bg-pumpkin"
                  }`}
                  key={i}
                >
                  {menu.icon} <Link href={menu.url}>{menu.path}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full lg:relative lg:left-[250px] lg:w-[calc(100%-250px)] min-h-screen">
        <section className="w-full">
          <div className="lg:text-pumpkin w-full py-6 shadow-lg">
            <div className="w-[90%] mx-auto lg:flex justify-between gap-5 items-center hidden">
              <article className="flex flex-col gap-2">
                <h4 className="text-4xl capitalize text-pumpkin font-semibold">
                  {page}
                </h4>
                <p className="text-pumpkin font-light text-base">
                  {subheading}
                </p>
              </article>

              <div className="flex items-center gap-2 justify-end">
                <article className="flex flex-col gap-1 items-end">
                  <h5 className="text-base capitalize text-pumpkin font-semibold">
                    Jane Doe
                  </h5>
                  <p className="text-pumpkin font-light text-sm">
                    Software Engineer
                  </p>
                </article>

                <figure className="m-0 p-0 w-[50px] h-[50px] relative border border-pumpkin rounded-[50%] overflow-hidden">
                  <Image
                    fill
                    alt="user-pic"
                    src="/images/avatar.jpeg"
                    className="object-cover"
                  />
                </figure>
              </div>
            </div>
            <div className="w-[90%] mx-auto lg:hidden text-black">
              <article className="w-full flex items-center justify-between ">
                <h3 className="w-full font-bold text-2xl italic">
                  Quantum<span className="text-pumpkin">Gateway</span>
                </h3>

                <button
                  className="text-pumpkin text-2xl"
                  onClick={handleOpenNav}
                >
                  <FaBars />
                </button>
                <MobileNavbar
                  openNav={openNav}
                  handleCloseNav={handleCloseNav}
                />
              </article>
            </div>
          </div>

          <div className="w-[90%] mx-auto lg:hidden mt-8">
            <article className="flex flex-col gap-2">
              <h4 className="text-2xl capitalize font-semibold">{page}</h4>
              <p className=" font-light text-base">{subheading}</p>
            </article>
          </div>
        </section>
        {children}
      </div>
    </section>
  );
};

export default DashboardLayout;
