import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../core/api";

const DashboardEditCategory = () => {
  const { categoryId } = useParams(); // Get the category ID from the URL
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null); // State for the image
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // To hold the current image URL
  const navigate = useNavigate();

  const varToken = localStorage.getItem("_auth");

  // Fetch category data when the component mounts
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await apiClient.get(`/api/categories/${categoryId}`, {
          headers: {
            Authorization: "Bearer " + varToken,
          },
        });

        const { categoryName, categoryDescription, imageUrl } = response.data;
        console.log(categoryDescription);
        setCategoryName(categoryName);
        setCategoryDescription(categoryDescription);
        setCurrentImageUrl(imageUrl); // Set the current image URL
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategory();
  }, [categoryId, varToken]);

  const handleImageChange = (e) => {
    setCategoryImage(e.target.files[0]); // Set the selected image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = currentImageUrl; // Default to the current image URL

      // If a new image is selected, upload it
      if (categoryImage) {
        const formData = new FormData();
        formData.append("image", categoryImage);

        const uploadResponse = await fetch(
          "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912", // Replace with your API key
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadData = await uploadResponse.json();

        if (uploadData.success) {
          imageUrl = uploadData.data.display_url; // Get the new image URL
        } else {
          console.error("Error uploading image:", uploadData.error);
        }
      }

      // Send the updated category data to the backend
      await apiClient.put(
        "/api/categories",
        {
          categoryId,
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
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Category</h1>
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
            Image (Leave blank to keep current image)
          </label>
          <input
            type="file"
            id="categoryImage"
            accept="image/*" // Accepts image files only
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          {/* Display current image */}
          {currentImageUrl && (
            <div className="mt-4">
              <img
                src={currentImageUrl}
                alt="Current Category"
                className="w-32 h-32 object-cover rounded"
              />
              <p className="text-gray-600 mt-2">Current Image</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardEditCategory;
