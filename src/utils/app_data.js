import { MdSpaceDashboard } from "react-icons/md";
import { FaUser, FaUsers, FaTasks, FaUserTie } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { MdPayment } from "react-icons/md";
import { AxiosGet } from "../services/http-service";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { MdOutlinePayment } from "react-icons/md";
import { Carter_One } from "next/font/google";

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
    submenu: [{ ResourceName: "Change Password", URL: "/change-password" }],
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
export const inventoryData = [
  {
    itemCode: "ITM001",
    itemName: "Item 1",
    itemClass: "Class A",
    category: "Category 1",
    customer: "Customer 1",
    vendor: "Vendor 1",
    itemPrice: 100,
    dateIssued: "2023-01-01",
    itemUnits: 10,
  },
  {
    itemCode: "ITM002",
    itemName: "Item 2",
    itemClass: "Class B",
    category: "Category 2",
    customer: "Customer 2",
    vendor: "Vendor 2",
    itemPrice: 200,
    dateIssued: "2023-02-01",
    itemUnits: 10,
  },
  {
    itemCode: "ITM003",
    itemName: "Item 3",
    itemClass: "Class C",
    category: "Category 3",
    customer: "Customer 3",
    vendor: "Vendor 3",
    itemPrice: 300,
    dateIssued: "2023-03-01",
    itemUnits: 10,
  },
  {
    itemCode: "ITM004",
    itemName: "Item 4",
    itemClass: "Class D",
    category: "Category 4",
    customer: "Customer 4",
    vendor: "Vendor 4",
    itemPrice: 400,
    dateIssued: "2023-04-01",
    itemUnits: 10,
  },
  {
    itemCode: "ITM005",
    itemName: "Item 5",
    itemClass: "Class E",
    category: "Category 5",
    customer: "Customer 5",
    vendor: "Vendor 5",
    itemPrice: 500,
    dateIssued: "2023-05-01",
    itemUnits: 10,
  },
];

export const classData = [
  {
    classCode: 1,
    description: "Chair",
    catCode: 1,
  },
  {
    classCode: 2,
    description: "Table",
    catCode: 2,
  },
  {
    classCode: 3,
    description: "Book",
    catCode: 3,
  },
];
