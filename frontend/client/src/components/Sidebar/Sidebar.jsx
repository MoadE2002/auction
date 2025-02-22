"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "@mui/material";
import { Gavel, Inventory2, AddShoppingCart, Assessment, Help, Logout, Dashboard, ManageAccounts , Person } from "@mui/icons-material";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";

const Sidebar = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const { user } = useAuthContext();
  const { logout } = useLogout();

  useEffect(() => {
    if (user) {
      setShowSidebar(true);
    }
  }, [user]);

  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    logout();
  };

  if (!user || !showSidebar) {
    return null;
  }

  return (
    <div
      className={`hidden md:block flex h-screen sticky top-10 min-h-full z-10 ${
        sidebarActive ? "w-24" : "w-64"
      } transition-all duration-300 bg-white shadow-lg`}
    >
      <div className="relative flex flex-col gap-5 p-6 w-full">
        {/* Sidebar Toggle */}
        <div
          className="absolute right-[-14px] top-[3.5%] w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer border-2 border-gray-200 bg-white"
          onClick={() => setSidebarActive(!sidebarActive)}
        >
          <i className={`transition-all duration-300 ${sidebarActive ? "rotate-180" : ""}`}>
            <Person />
          </i>
        </div>

        {/* User Info */}
        <div className="flex gap-5 pb-5 border-b border-gray-100">
          <div className="w-11 h-11 rounded-full overflow-hidden">
            {user && user.photoDeProfile ? (
              <Avatar
                src={user.photoDeProfile}
                alt="User Avatar"
                sx={{
                  width: 44,
                  height: 44,
                  border: "2px solid #f0f0f0",
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: "#3f51b5",
                }}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
              </Avatar>
            )}
          </div>
          {!sidebarActive && (
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase text-gray-500 mb-1">Logged in as:</p>
              <p className="text-sm font-medium">{user.username || "User"}</p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1">
          <div className="mb-5">
            <p
              className={`text-xs uppercase text-gray-500 mb-2 ${
                sidebarActive ? "text-center" : ""
              }`}
            >
              Main
            </p>
            <ul>
              <li
                className={`relative mb-1 ${activeMenu === 1 ? "active" : ""}`}
                onClick={() => handleMenuClick(1)}
              >
                <Link href="/user/scheduling" passHref>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-100 p-3 rounded transition-all duration-300">
                    <Gavel />
                    <span className={`${sidebarActive ? "hidden" : "flex-1"}`}>My Bids</span>
                  </div>
                </Link>
              </li>

              <li
                className={`relative mb-1 ${activeMenu === 1 ? "active" : ""}`}
                onClick={() => handleMenuClick(1)}
              >
                <Link href="/prescription" passHref>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-100 p-3 rounded transition-all duration-300">
                    <Inventory2 />
                    <span className={`${sidebarActive ? "hidden" : "flex-1"}`}>My Auction Items</span>
                  </div>
                </Link>
              </li>

              <li
                className={`relative mb-1 ${activeMenu === 1 ? "active" : ""}`}
                onClick={() => handleMenuClick(1)}
              >
                <Link href="/verification" passHref>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-100 p-3 rounded transition-all duration-300">
                    <AddShoppingCart />
                    <span className={`${sidebarActive ? "hidden" : "flex-1"}`}>Create Auction</span>
                  </div>
                </Link>
              </li>

              <li
                className={`relative mb-1 ${activeMenu === 2 ? "active" : ""}`}
                onClick={() => handleMenuClick(2)}
              >
                <Link href="/doctor" passHref>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-100 p-3 rounded transition-all duration-300">
                    <Assessment />
                    <span className={`${sidebarActive ? "hidden" : "flex-1"}`}>My Dashboard</span>
                  </div>
                </Link>
              </li>

              {user.role === "ADMIN" && (
                <>
                  <li
                    className={`relative mb-1 ${activeMenu === 3 ? "active" : ""}`}
                    onClick={() => handleMenuClick(3)}
                  >
                    <Link href="/admin" passHref>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-100 p-3 rounded transition-all duration-300">
                        <Dashboard />
                        <span className={`${sidebarActive ? "hidden" : "flex-1"}`}>Admin Dashboard</span>
                      </div>
                    </Link>
                  </li>

                  <li
                    className={`relative mb-1 ${activeMenu === 4 ? "active" : ""}`}
                    onClick={() => handleMenuClick(4)}
                  >
                    <Link href="/report/resolve" passHref>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-100 p-3 rounded transition-all duration-300">
                        <ManageAccounts />
                        <span className={`${sidebarActive ? "hidden" : "flex-1"}`}>Manage Reports</span>
                      </div>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Account Section */}
          <div>
            <p
              className={`text-xs uppercase text-gray-500 mb-2 ${
                sidebarActive ? "text-center" : ""
              }`}
            >
              Account
            </p>
            <ul>
              <li>
                <Link href="/help" passHref>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-100 p-3 rounded transition-all duration-300">
                    <Help />
                    <span className={`${sidebarActive ? "hidden" : "flex-1"}`}>Help</span>
                  </div>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-100 p-3 rounded transition-all duration-300 w-full"
                >
                  <Logout />
                  <span className={`${sidebarActive ? "hidden" : "flex-1"}`}>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
