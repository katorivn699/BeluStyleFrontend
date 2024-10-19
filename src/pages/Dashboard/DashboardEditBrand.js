import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";

const DashboardEditBrand = () => {
  const { brandId } = useParams(); // Get the brand ID from the URL
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState(""); // State for the image
  const navigate = useNavigate();

  const varToken = localStorage.getItem("_auth");

  // Fetch brand data when the component mounts
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await apiClient.get(`/api/brands/${brandId}`, {
          headers: {
            Authorization: "Bearer " + varToken,
          },
        });

        const { brandName, brandDescription, websiteUrl } = response.data;

        setBrandName(brandName);
        setBrandDescription(brandDescription);
        setWebsiteUrl(websiteUrl);
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    fetchBrand();
  }, [brandId, varToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the updated brand data to the backend
      await apiClient.put(
        "/api/brands",
        {
          brandId,
          brandName,
          brandDescription,
          websiteUrl, // Send the image URL
        },
        {
          headers: {
            Authorization: "Bearer " + varToken,
          },
        }
      );

      navigate("/Dashboard/Brands");
    } catch (error) {
      console.error("Error updating brand:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Brand</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="brandName"
          >
            Name
          </label>
          <input
            type="text"
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter brand name"
            required
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="brandDescription"
          >
            Description
          </label>
          <input
            type="text"
            id="brandDescription"
            value={brandDescription}
            onChange={(e) => setBrandDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter brand description"
            required
          />

          {/* Image upload input */}
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="brandImage"
          >
            Website URL
          </label>
          <input
            type="text"
            id="websiteUrl"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter brand description"
            required
          />
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

export default DashboardEditBrand;
