"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import DashCard from "./DashCard";
import DashProfileCard from "./DashProfileCard";
import { FaCaretDown, FaPlus } from "react-icons/fa";
import TransctionComponent from "./TransctionComponent";
import Link from "next/link";
import { AxiosPost, AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const fetchProfileData = async () => {
    try {
      const response = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Dashboard/GetDashboard/${
          JSON.parse(localStorage.getItem("authDetails")).tin
        }`
      );

      if (response?.data?.StatusCode === 200) {
        setProfileData(response.data || {});
        setRecentTransactions(response.data.Data || []);
      } else {
        toast.error(
          response?.data?.StatusMessage || "Could not fetch profile data."
        );
        setProfileData({});
      }
    } catch (error) {
      toast.error("Error fetching profile data.");
      setProfileData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <DashboardLayout>
      <section className="w-full h-full mt-5">
        <div className="w-[90%] mx-auto xl:max-w-[1140px] lg:py-10">
          <section className="flex flex-col gap-8 w-full xl:flex-row justify-between">
            <div className="w-full flex overflow-x-auto flex-nowrap xl:max-w-[500px] border-2 border-gray-200 dark:border-[#575757] rounded-[28px] p-6 gap-8 xl:flex-col xl:flex-wrap">
              {/*  */}
              <div className="lg:mt-3 lg:w-full shrink-0 lg:shrink-[unset] w-fit">
                <h3 className="font-semibold text-xl lg:text-2xl capitalize mb-3 dark:text-white">
                  total payments
                </h3>
                <DashCard loading={loading} dashboardData={profileData} />
              </div>

              <div className="w-fit lg:w-full lg:mt-6 shrink-0 lg:shrink-[unset]">
                <h3 className="font-semibold text-xl lg:text-2xl capitalize mb-3 dark:text-white">
                  Profile
                </h3>
                <DashProfileCard loading={loading} profileData={profileData} />
              </div>
            </div>

            <div className="xl:max-w-[600px] w-full border-2 border-gray-200 dark:border-[#575757]  rounded-[28px] p-6 gap-8">
              {/* create transaction */}
              <section className="w-full mb-3 flex justify-end items-center gap-5">
                <Link
                  href="/"
                  id="dropdownBgHoverButton"
                  data-dropdown-toggle="dropdownBgHover"
                  className="text-pumpkin dark:text-darkPumpkin2 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  relative  gap-2 border border-pumpkin dark:border-darkPumpkin2"
                  type="button"
                >
                  New Payment
                  <FaPlus />
                </Link>
              </section>
              <div className="w-full flex items-center justify-between">
                <article className="flex flex-col">
                  <h3 className="font-semibold text-xl lg:text-2xl capitalize dark:text-white ">
                    Transactions
                  </h3>

                  {/* <div className="flex items-center gap-2">
                    <h3 className="text-sm capitalize flex items-center gap-2">
                      sort by:{" "}
                      <span className="text-pumpkin text-sm">Recently</span>
                    </h3>
                    <FaCaretDown />
                  </div> */}
                </article>
              </div>
              <TransctionComponent
                transactions={recentTransactions}
                loading={loading}
              />
            </div>
          </section>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default UserDashboard;
