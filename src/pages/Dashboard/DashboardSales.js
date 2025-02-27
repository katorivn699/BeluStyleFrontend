import React, { useState, useEffect } from "react";
import { FaEdit, FaEye, FaPlus, FaPlusSquare, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api"; // Assuming you have an api client setup
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import DeleteConfirmationModal from "../../components/buttons/DeleteConfirmationModal"; // Import DeleteConfirmationModal
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { formatPrice } from "../../components/format/formats";

const DashboardSales = () => {
  const [sales, setSales] = useState([]);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Manage modal open state
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const itemsPerPage = 10; // Set items per page

  const authUser = useAuthUser(); // Get the current user
  const userRole = authUser.role; // Get the user's role
  const varToken = useAuthHeader();

  const openDeleteModal = (sale) => {
    setSaleToDelete(sale);
    setIsOpen(true); // Open the modal
  };

  const handleClose = () => {
    setIsOpen(false); // Close the modal
  };

  const handleDelete = (saleToDelete) => {
    if (saleToDelete) {
      apiClient
        .delete(`/api/sales/${saleToDelete.saleId}`, {
          headers: {
            Authorization: varToken,
          },
        })
        .then((response) => {
          setSales(sales.filter((c) => c.saleId !== saleToDelete.saleId));
          setIsOpen(false); // Close the modal after deletion
          toast.success(response.data.message, {
            position: "bottom-right",
            transition: Zoom,
          });
        })
        .catch((error) =>
          toast.error(error.data.message, {
            position: "bottom-right",
            transition: Zoom,
          })
        );
    }
  };

  function getStatusColor(saleStatus) {
    switch (saleStatus) {
      case "INACTIVE":
        return "text-gray-500";
      case "ACTIVE":
        return "text-green-500";
      case "EXPIRED":
        return "text-red-500";
      default:
        return "";
    }
  }

  useEffect(() => {
    apiClient
      .get("/api/sales", {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setSales(response.data); // Set the fetched data to sales state
      })
      .catch((error) => {
        console.error("Error fetching sales:", error);
      });
  }, []);

  // Calculate the paginated sales for the current page
  const paginatedSales = sales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Total number of pages
  const totalPages = Math.ceil(sales.length / itemsPerPage);

  // Change page
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-6">Sales List</h1>
        </div>
        <div>
          <Link to="/Dashboard/Sales/Create">
            <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
              <FaPlus className="mr-2" /> Create New Sale
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Sale Type</th>
              <th className="px-4 py-2 text-left">Sale Value</th>
              <th className="px-4 py-2 text-left">Start Date</th>
              <th className="px-4 py-2 text-left">End Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSales.length > 0 ? (
              paginatedSales.map((sale) => (
                <tr key={sale.saleId} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{sale.saleId}</td>
                  <td className="px-4 py-2">{sale.saleType}</td>
                  <td className="px-4 py-2">
                    {sale.saleType === "PERCENTAGE"
                      ? sale.saleValue + "%"
                      : formatPrice(sale.saleValue)}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(sale.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(sale.endDate).toLocaleDateString()}
                  </td>
                  <td
                    className={`px-4 py-2 font-bold ${getStatusColor(
                      sale.saleStatus
                    )}`}
                  >
                    {sale.saleStatus}
                  </td>
                  <td className="px-4 py-2 flex space-x-2 pt-6">
                    <Link to={`/Dashboard/Sales/${sale.saleId}`}>
                      <FaEye className="text-green-500 cursor-pointer" />
                    </Link>
                    <Link to={`/Dashboard/Sales/Edit/${sale.saleId}`}>
                      <FaEdit className="text-blue-500 cursor-pointer" />
                    </Link>
                    <Link to={`/Dashboard/Sales/${sale.saleId}/AddProduct`}>
                      <FaPlusSquare
                        className="text-blue-500 cursor-pointer"
                        title="Add Product to Sale"
                      />
                    </Link>
                    {userRole === "ADMIN" && (
                      <button
                        className="text-red-500 cursor-pointer"
                        onClick={() => openDeleteModal(sale)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-red-500 px-4 py-2">
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 mx-1 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 border border-gray-300 rounded-lg ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 mx-1 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={() => handleDelete(saleToDelete)}
        name={saleToDelete?.saleId || ""}
      />
    </>
  );
};

export default DashboardSales;
