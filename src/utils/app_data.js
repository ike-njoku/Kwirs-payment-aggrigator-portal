import { MdSpaceDashboard } from "react-icons/md";
import { FaUser, FaUsers, FaTasks, FaUserTie } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { MdPayment } from "react-icons/md";
import { AxiosGet } from "../services/http-service";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { MdOutlinePayment } from "react-icons/md";

export const sidebarMenu = [
  {
    MainMenu: "Dashboard",
    submenu: [
      { ResourceName: "Dashboard", URL: "/dashboard" },
      { ResourceName: "Profile", URL: "/profile" },
    ],
  },
  {
    MainMenu: "Settings",
    submenu: [{ ResourceName: "Notifications", URL: "/notifications" }],
  },
];

export const usersList = [];

export const profileData = {
  name: "John Doe",
  role: "Software Engineer",
  TIN: "1053249494",
  email: "james.olukotun@fctirs.gov.ng",
  bvn: "",
  firstname: "JAMES OLANREWAJU OLUKOTUN",
  lastname: "OLUKOTUN",
  status: "Found",
  dob: "1979-03-29T00:00:00",
  TaxOffice: "KUB",
  // mYear: null,
  // mDay: null,
  // mMonth: null,
};
