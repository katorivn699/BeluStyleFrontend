import React from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {
  FaTags,
  FaList,
  FaBell,
  FaPercent,
  FaGift,
  FaWarehouse,
  FaCog,
  FaSignOutAlt,
  FaFileInvoice,
  FaStar,
} from "react-icons/fa";
import { FaBorderAll, FaCircleUser, FaGaugeHigh } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const location = useLocation(); // Get current route

  const authUser = useAuthUser(); // Get the current user
  const userRole = authUser.role; // Get the user's role

  // Function to check if the current link is active
  const isActive = (path) => location.pathname.startsWith(path);
  const isDashboard = (path) => location.pathname === path;

  return (
    <div
      className={`bg-white shadow-md h-screen transition-all duration-500 ease-in-out transform ${
        isOpen ? "max-w-[150px] md:max-w-[300px] sm:max-w-[200px] w-full overflow-auto opacity-100" : "max-w-0 w-0 opacity-0 overflow-hidden"
      } flex justify-start items-start lg:justify-center lg:items-center overflow-y-auto`}
    >
      {isOpen && (
        <ul className="space-y-4 p-7 w-full lg:w-72">
          <li>
            <Link
              to="/Dashboard"
              className={`flex items-center justify-center text-gray-700 hover:text-white hover:bg-gray-500 ${
                isDashboard("/Dashboard")
                  ? "border-2 border-blue-700 text-white"
                  : ""
              } p-2 rounded-md`}
            >
              <span className="text-xl text-[#4880ff] font-bold">Belu</span>
              <span className="text-xl text-[#202224] font-bold "> Admin</span>
            </Link>
          </li>

          {/* Products Link */}
          <li>
            <Link
              to="/Dashboard/Products"
              className={`flex items-center text-gray-700 hover:text-white hover:bg-gray-500 ${
                isActive("/Dashboard/Products") ? "bg-blue-500 text-white" : ""
              } p-2 rounded-md`}
            >
              <FaBorderAll className="mr-2" />
              Products
            </Link>
          </li>

          {/* Accounts Link */}
          {userRole === "ADMIN" && (
            <li>
              <Link
                to="/Dashboard/Accounts?"
                className={`flex items-center text-gray-700 hover:text-white hover:bg-gray-500 ${
                  isActive("/Dashboard/Accounts")
                    ? "bg-blue-500 text-white"
                    : ""
                } p-2 rounded-md`}
              >
                <FaCircleUser className="mr-2" />
                Accounts
              </Link>
            </li>
          )}

          {/* Categories Link */}
          <li>
            <Link
              to="/Dashboard/Categories"
              className={`flex items-center text-gray-700 hover:text-white hover:bg-gray-500 ${
                isActive("/Dashboard/Categories")
                  ? "bg-blue-500 text-white"
                  : ""
              } p-2 rounded-md`}
            >
              <FaTags className="mr-2" />
              Categories
            </Link>
          </li>

          {/* Brands Link */}
          <li>
            <Link
              to="/Dashboard/Brands"
              className={`flex items-center text-gray-700 hover:text-white hover:bg-gray-500 ${
                isActive("/Dashboard/Brands") ? "bg-blue-500 text-white" : ""
              } p-2 rounded-md`}
            >
              <FaStar className="mr-2" />
              Brands
            </Link>
          </li>

          {/* Notifications Link */}
          <li>
            <Link
              to="/Dashboard/Notifications"
              className={`flex items-center text-gray-700 hover:text-white hover:bg-gray-500 ${
                isActive("/Dashboard/Notifications")
                  ? "bg-blue-500 text-white"
                  : ""
              } p-2 rounded-md`}
            >
              <FaBell className="mr-2" />
              Notifications
            </Link>
          </li>

          {/* Divider */}
          <hr className="my-4 border-gray-300" />

          {/* Discounts Link */}
          <li>
            <Link
              to="/Dashboard/Discounts"
              className={`flex items-center text-gray-700 hover:text-white hover:bg-gray-500 ${
                isActive("/Dashboard/Discounts") ? "bg-blue-500 text-white" : ""
              } p-2 rounded-md`}
            >
              <FaPercent className="mr-2" />
              Discounts
            </Link>
          </li>

          {/* Sales Link */}
          <li>
            <Link
              to="/Dashboard/Sales"
              className={`flex items-center text-gray-700 hover:text-white hover:bg-gray-500 ${
                isActive("/Dashboard/Sales") ? "bg-blue-500 text-white" : ""
              } p-2 rounded-md`}
            >
              <FaGift className="mr-2" />
              Sales
            </Link>
          </li>

          {/* Order Lists Link */}
          <li>
            <Link
              to="/Dashboard/Orders"
              className={`flex items-center text-gray-700 hover:text-white hover:bg-gray-500 ${
                isActive("/Dashboard/Orders") ? "bg-blue-500 text-white" : ""
              } p-2 rounded-md`}
            >
              <FaList className="mr-2" />
              Order Lists
            </Link>
          </li>

          {/* Warehouse Link */}
          <li>
            <Link
              to="/Dashboard/Warehouse"
              className={`flex items-center text-gray-700 hover:text-white hover:bg-gray-500 ${
                isActive("/Dashboard/Warehouse") ? "bg-blue-500 text-white" : ""
              } p-2 rounded-md`}
            >
              <FaWarehouse className="mr-2" />
              Warehouse
            </Link>
          </li>

          {/* Transaction Link */}
          <li>
            <Link
              to="/Dashboard/StockTransactions"
              className={`flex items-center text-gray-700 hover:text-white hover:bg-gray-500 ${
                isActive("/Dashboard/StockTransactions")
                  ? "bg-blue-500 text-white"
                  : ""
              } p-2 rounded-md`}
            >
              <FaFileInvoice className="mr-2" />
              Stock Transactions
            </Link>
          </li>

          {/* Divider */}
          {/* <hr className="my-4 border-gray-300" /> */}
          {/* Logout Link */}
          {/* <li>
            <Link
              to="/Dashboard/Logout"
              className={`flex items-center text-gray-700 hover:text-white hover:bg-gray-500 ${
                isActive("/Dashboard/Logout") ? "bg-blue-500 text-white" : ""
              } p-2 rounded-md`}
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </Link>
          </li> */}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
