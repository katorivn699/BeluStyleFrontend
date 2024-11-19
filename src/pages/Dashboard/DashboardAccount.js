import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import DashboardAccountDrawer from "../../components/drawer/DashboardAccountDrawer";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";

const DashboardAccounts = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const authUser = useAuthUser();
  const currentUser = authUser.username;
  const varToken = useAuthHeader();

  // Fetch users when search term, currentPage, or pageSize changes
  useEffect(() => {
    fetchUsers(currentPage, pageSize, searchTerm);
  }, [currentPage, searchTerm, pageSize, navigate]);

  const fetchUsers = (page, size, search = "") => {
    apiClient
      .get(`/api/admin?page=${page}&size=${size}&search=${search}`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
        setPageSize(response.data.size);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      setCurrentPage(0);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setDrawerOpen(true);
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "text-red-600 bg-red-100 px-4 py-2 rounded-md inline-block font-bold text-center w-32";
      case "STAFF":
        return "text-yellow-600 bg-yellow-100 px-4 py-2 rounded-md inline-block font-bold text-center w-32";
      case "CUSTOMER":
        return "text-teal-600 bg-teal-100 px-4 py-2 rounded-md inline-block font-bold text-center w-32";
      default:
        return "";
    }
  };

  const openDeleteModal = (userToDelete) => {
    setUserToDelete(userToDelete);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = () => {
    apiClient
      .delete(`/api/admin/${userToDelete.userId}`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        fetchUsers(currentPage, pageSize, searchTerm);
        handleClose();
        toast.success(response.data, {
          position: "bottom-right",
          transition: Zoom,
        });
      })
      .catch(() => {
        toast.error("Delete user failed", {
          position: "bottom-right",
          transition: Zoom,
        });
      });
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 border border-gray-300 rounded-lg ${
            currentPage === i ? "bg-blue-500 text-white" : ""
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Accounts</h1>
        <Link to="/Dashboard/Accounts/Create">
          <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Create A New Staff Account
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 px-4 py-2  w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username} className="hover:bg-gray-50">
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td
                  className={`px-4 py-2 font-bold ${getRoleStyle(user.role)}`}
                >
                  {user.role}
                </td>
                {user.enable ? (
                  <td className="px-4 py-2 text-emerald-600 font-bold">
                    Enable
                  </td>
                ) : (
                  <td className="px-4 py-2 text-rose-600 font-bold">Disable</td>
                )}
                <td className="px-4 py-2 flex space-x-2">
                  <button onClick={() => handleViewUser(user.userId)}>
                    <FaEye
                      className={`cursor-pointer ${
                        user.username === currentUser
                          ? "text-orange-500"
                          : "text-green-500"
                      }`}
                    />
                  </button>
                  <Link to={`/Dashboard/Accounts/Edit/${user.userId}`}>
                    <FaEdit className="text-blue-500 cursor-pointer" />
                  </Link>
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => openDeleteModal(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="px-4 py-2 mx-1 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        {renderPageNumbers()}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 mx-1 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* User Details Drawer */}
      <DashboardAccountDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userId={selectedUserId}
      />

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleDelete}
        name={userToDelete?.username}
      />
    </>
  );
};

export default DashboardAccounts;
