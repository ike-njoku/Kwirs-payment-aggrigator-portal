import { MdSpaceDashboard } from "react-icons/md";
import { FaUser, FaUsers, FaTasks, FaUserTie } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";

export const sidebarMenu = [
  {
    path: "dashboard",
    icon: <MdSpaceDashboard />,
    url: "/dashboard",
  },
  {
    path: "profile",
    icon: <FaUser />,
    url: "/profile",
  },
  {
    path: "settings",
    icon: <IoSettings />,
    url: "/settings",
  },
  {
    path: "notifications",
    icon: <IoNotifications />,
    url: "/notifications",
  },
  {
    path: "users",
    icon: <FaUsers />,
    url: "/user-list",
  },
  {
    path: "resources",
    icon: <FaTasks />,
    url: "/resources",
  },
  {
    path: "roles",
    icon: <FaUserTie />,
    url: "/roles",
  },
];

export const usersList = [
  {
    userName: "Ike-njoku David",
    createdAt: "01-10-2024",
    email: "ikenjokudc@gmail.com",
    phone: "08038686694",
    isActive: true,
    role: "Admin",
  },
  {
    userName: "Florence Chikwendu",
    createdAt: "01-10-2024",
    email: "chidaluchekwendu@gmail.com",
    phone: "07038792802",
    isActive: false,
    role: "User",
  },
];
