"use client";
import React, { useEffect, useState } from "react";
import { sidebarMenu } from "../../../utils/app_data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaBars } from "react-icons/fa6";
import MobileNavbar from "../MobileNavbar";
import { authenticateUser } from "../../../services/auth-service";
import { AxiosGet, AxiosPost } from "../../../services/http-service";
import { toast } from "react-toastify";

const DashboardLayout = ({ page = "Dashboard", subheading = "", children }) => {
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState({});
  const [_sidebarMenu, setSideBarMenu] = useState(sidebarMenu);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const TIN = authenticateUser?.tin;

  // Fetch sidebar menu items from API
  const getUserMenuItems = async () => {
    const requestURL = `${API_BASE_URL}/api/Menue/GetUserMenueItems`;

    try {
      const apiResponse = await AxiosPost(requestURL, { UserName: TIN });

      if (!apiResponse || apiResponse.StatusCode !== 200) {
        toast.error("Could not fetch menu items. Please reload the page.");
        return;
      }

      setSideBarMenu(apiResponse.Data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  // Fetch user data from API
  const fetchUserData = async () => {
    if (!TIN) return;

    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Dashboard/GetDashboard/${TIN}`);

      if (response?.data?.StatusCode === 200) {
        setUserData(response.data.Data);
      } else {
        toast.error(response.data?.StatusMessage || "Could not fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAuthenticatedUser(authenticateUser);
    fetchUserData();
    // getUserMenuItems(); // Uncomment this when needed
  }, []);

  const handleOpenNav = () => setOpenNav(true);
  const handleCloseNav = () => setOpenNav(false);

  return (
    <section className="w-full">
      {/* Sidebar */}
      <div className="fixed max-w-[250px] w-full hidden lg:block top-0 left-0 bottom-0 bg-[rgba(32,32,32,1)]">
        <div className="w-full h-full py-6 text-white">
          <h3 className="w-full font-bold text-xl italic px-8 my-5">
            Quantum<span className="text-pumpkin">Gateway</span>
          </h3>

          <div className="w-full py-5 mt-10">
            <ul className="w-full flex flex-col gap-6">
              {_sidebarMenu.map((menu, i) => (
                <li
                  className={`w-full px-8 flex gap-2 items-center text-xl text-white capitalize py-2 ${
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

      {/* Main Content */}
      <div className="w-full lg:relative lg:left-[250px] lg:w-[calc(100%-250px)] min-h-screen">
        <section className="w-full">
          <div className="lg:text-pumpkin w-full py-6 shadow-lg">
            <div className="w-[90%] mx-auto lg:flex justify-between gap-5 items-center hidden">
              <article className="flex flex-col gap-2">
                <h4 className="text-4xl capitalize text-pumpkin font-semibold">
                  {page}
                </h4>
                <p className="text-pumpkin font-light text-base">{subheading}</p>
              </article>

              {/* User Profile (Updated with API Data) */}
              <div className="flex items-center gap-2 justify-end">
                {loading ? (
                  <p className="text-gray-600">Loading...</p>
                ) : userData ? (
                  <>
                    <article className="flex flex-col gap-1 items-end">
                      <h5 className="text-base capitalize text-pumpkin font-semibold">
                        {userData.userName || "N/A"}
                      </h5>
                      <p className="text-pumpkin font-light text-sm">
                        {userData.userRole || "N/A"}
                      </p>
                    </article>

                    <figure className="m-0 p-0 w-[50px] h-[50px] relative border border-pumpkin rounded-[50%] overflow-hidden">
                      <Image
                        fill
                        alt="user-pic"
                        src={userData.profilePicture || "/images/avatar.jpeg"}
                        className="object-cover"
                      />
                    </figure>
                  </>
                ) : (
                  <p className="text-gray-600">No user data available</p>
                )}
              </div>
            </div>

            {/* Mobile Navbar */}
            <div className="w-[90%] mx-auto lg:hidden text-black">
              <article className="w-full flex items-center justify-between">
                <h3 className="w-full font-bold text-2xl italic">
                  Quantum<span className="text-pumpkin">Gateway</span>
                </h3>

                <button className="text-pumpkin text-2xl" onClick={handleOpenNav}>
                  <FaBars />
                </button>
                <MobileNavbar openNav={openNav} handleCloseNav={handleCloseNav} />
              </article>
            </div>
          </div>

          {/* Mobile Page Title */}
          <div className="w-[90%] mx-auto lg:hidden mt-8">
            <article className="flex flex-col gap-2">
              <h4 className="text-2xl capitalize font-semibold">{page}</h4>
              <p className="font-light text-base">{subheading}</p>
            </article>
          </div>
        </section>
        {children}
      </div>
    </section>
  );
};

export default DashboardLayout;

