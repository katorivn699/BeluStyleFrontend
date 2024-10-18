import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../core/api";

const DashboardCreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null); // State for the image
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setCategoryImage(e.target.files[0]); // Set the selected image
  };

  const varToken = localStorage.getItem("_auth");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload the image to ImgBB
      const formData = new FormData();
      formData.append("image", categoryImage);

      const uploadResponse = await fetch(
        "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (uploadData.success) {
        const imageUrl = uploadData.data.display_url; // Get the image URL

        // Send the category data to the backend
        await apiClient.post(
          "/api/categories",
          {
            categoryName,
            categoryDescription,
            imageUrl, // Send the image URL
          },
          {
            headers: {
              Authorization: "Bearer " + varToken,
            },
          }
        );

        navigate("/Dashboard/Categories");
      } else {
        console.error("Error uploading image:", uploadData.error);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Category</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="categoryName"
          >
            Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter category name"
            required
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="categoryDescription"
          >
            Description
          </label>
          <input
            type="text"
            id="categoryDescription"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter category description"
            required
          />

          {/* Image upload input */}
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="categoryImage"
          >
            Image
          </label>
          <input
            type="file"
            id="categoryImage"
            accept="image/*" // Accepts image files only
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardCreateCategory;
