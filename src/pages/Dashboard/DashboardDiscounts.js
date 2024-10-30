import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import DeleteConfirmationModal from "../../components/buttons/DeleteConfirmationModal";
import { toast, Zoom } from "react-toastify";

const DashboardDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [discountToDelete, setDiscountToDelete] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const authUser = useAuthUser();
  const userRole = authUser.role;
  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    fetchDiscounts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchDiscounts = (page, size) => {
    apiClient
      .get(`/api/discounts?page=${page}&size=${size}`, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        setDiscounts(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching discounts:", error);
      });
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

  const openDeleteModal = (discount) => {
    setDiscountToDelete(discount);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = () => {
    console.log(discountToDelete.discountId);
    apiClient
      .delete(`/api/discounts/${discountToDelete.discountId}`, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        fetchDiscounts(currentPage, pageSize);
        handleClose();
        toast.success("Delete discount successfully", {
          position: "bottom-right",
          transition: Zoom,
        });
      })
      .catch((error) => {
        toast.error("Delete discount failed", {
          position: "bottom-right",
          transition: Zoom,
        });
      });
  };

  function getStatusColor(discountStatus) {
    switch (discountStatus) {
      case "INACTIVE":
        return "text-gray-500";
      case "ACTIVE":
        return "text-green-500";
      case "EXPIRED":
        return "text-red-500";
      case "USED":
        return "text-purple-500";
      default:
        return "";
    }
  }

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
        <h1 className="text-4xl font-bold mb-6">Discounts</h1>
        <Link to="/Dashboard/Discounts/Create">
          <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Create Discount
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Value</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Usage Limit</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.discountId} className="hover:bg-gray-50">
                <td className="px-4 py-2">{discount.discountId}</td>
                <td className="px-4 py-2">{discount.discountCode}</td>
                <td className="px-4 py-2">{discount.discountType}</td>
                <td className="px-4 py-2">{discount.discountValue}</td>
                <td
                  className={`px-4 py-2 font-bold ${getStatusColor(
                    discount.discountStatus
                  )}`}
                >
                  {discount.discountStatus}
                </td>
                <td className="px-4 py-2">{discount.usageLimit}</td>

                <td className="px-4 py-2 flex space-x-2 pt-6">
                  <Link to={`/Dashboard/Discounts/${discount.discountId}`}>
                    <FaEye className="text-green-500 cursor-pointer" />
                  </Link>
                  <Link to={`/Dashboard/Discounts/Edit/${discount.discountId}`}>
                    <FaEdit className="text-blue-500 cursor-pointer" />
                  </Link>
                  {/* Add User to Discount Button */}
                  <Link
                    to={`/Dashboard/Discounts/${discount.discountId}/AddUser`}
                  >
                    <FaUserPlus
                      className="text-blue-500 cursor-pointer"
                      title="Add User to Discount"
                    />
                  </Link>
                  {userRole === "ADMIN" && (
                    <button
                      className="text-red-500 cursor-pointer"
                      onClick={() => openDeleteModal(discount)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="px-4 py-2 mx-1 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <div>{renderPageNumbers()}</div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 mx-1 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleDelete}
        name={discountToDelete?.discountCode || ""}
      />
    </>
  );
};

export default DashboardDiscounts;
