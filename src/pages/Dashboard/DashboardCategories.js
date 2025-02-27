import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CategoryDrawer from "../../components/drawer/DashboardCategoryDrawer"; // Import CategoryDrawer
import { apiClient } from "../../core/api";
import useAuthUser from "react-auth-kit/hooks/useAuthUser"; // Import useAuthUser
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import DeleteConfirmationModal from "../../components/buttons/DeleteConfirmationModal";

const DashboardCategories = () => {
  const [categories, setCategories] = useState([]); // State to store categories
  const [categoryToDelete, setCategoryToDelete] = useState(null); // State to delete categories
  const [isOpen, setIsOpen] = useState(false); // Manage modal open state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Manage drawer open state
  const [selectedCategory, setSelectedCategory] = useState(null); // State for the selected category for drawer
  const navigate = useNavigate();

  const authUser = useAuthUser(); // Get the current user
  const userRole = authUser.role; // Get the user's role

  const varToken = useAuthHeader();

  useEffect(() => {
    // Fetch categories from API
    apiClient
      .get("/api/categories", {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setCategories(response.data); // Set the fetched data to categories state
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, [varToken]);

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false); // Close the modal
  };

  const handleDelete = (categoryToDelete) => {
    if (categoryToDelete) {
      apiClient
        .delete(`/api/categories/${categoryToDelete.categoryId}`, {
          headers: {
            Authorization: varToken,
          },
        })
        .then((response) => {
          setCategories(
            categories.filter(
              (c) => c.categoryId !== categoryToDelete.categoryId
            )
          );
          setIsOpen(false); // Close the modal after deletion
          console.log(categoryToDelete.categoryId);
          toast.success(response.data.message, {
            position: "bottom-right",
            transition: Zoom,
          });
        })
        .catch((response) =>
          toast.error(response.data.message, {
            position: "bottom-right",
            transition: Zoom,
          })
        );
    }
  };

  const openDrawer = (category) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (category) => {
    navigate(`/Dashboard/Categories/Edit/${category.categoryId}`); // Use navigate to go to the edit page
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Categories</h1>
        <div className="flex ">
          {userRole === "ADMIN" && ( // Show create button only for Admin
            <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
              <Link
                to="/Dashboard/Categories/Create"
                className="flex items-center"
              >
                <FaPlus className="mr-2" /> Create New
              </Link>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Total Quantity</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.categoryId} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{category.categoryId}</td>
                  <td className="px-4 py-2">
                    <img
                      src={category.imageUrl}
                      alt={category.categoryName}
                      className="h-12 w-12"
                    />
                  </td>
                  <td className="px-4 py-2">{category.categoryName}</td>
                  <td className="px-4 py-2">{category.categoryDescription}</td>
                  <td className="px-4 py-2">{category.totalQuantity}</td>
                  <td className="px-4 py-2 flex space-x-2 pt-6">
                    <button
                      onClick={() => openDrawer(category)} // Open drawer on click
                      className="text-green-500 cursor-pointer"
                    >
                      <FaEye />
                    </button>
                    <Link
                      to={`/Dashboard/Categories/Edit/${category.categoryId}`}
                    >
                      <FaEdit className="text-blue-500 cursor-pointer" />
                    </Link>
                    {userRole === "ADMIN" && ( // Show delete button only for Admin
                      <button
                        onClick={() => openDeleteModal(category)}
                        className="text-red-500 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <p className="text-red-500">No categories found.</p>
            )}
          </tbody>
        </table>
      </div>

      {/* Use DeleteConfirmationModal component */}
      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={() => handleDelete(categoryToDelete)} // Pass categoryToDelete here
        name={categoryToDelete?.categoryName || ""}
      />

      {/* Category Drawer */}
      <CategoryDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        category={selectedCategory || {}} // Pass selected category to drawer
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};

export default DashboardCategories;
