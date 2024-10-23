import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import { toast, Zoom } from "react-toastify";

const DashboardCreateBrand = () => {
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandLogo, setBrandLogo] = useState(null); // State for the image (logo)
  const navigate = useNavigate();

  const varToken = localStorage.getItem("_auth");

  const handleImageChange = (e) => {
    setBrandLogo(e.target.files[0]); // Set the selected image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", brandLogo);

    const uploadPromise = fetch(
      "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
      {
        method: "POST",
        body: formData,
      }
    );

    toast.promise(
      uploadPromise
        .then((uploadResponse) => uploadResponse.json())
        .then(async (uploadData) => {
          if (uploadData.success) {
            const logoUrl = uploadData.data.display_url; // Get the image URL

            // Send the brand data to the backend
            await apiClient.post(
              "/api/brands",
              {
                brandName,
                brandDescription,
                websiteUrl,
                logoUrl, // Send the image URL for the brand's logo
              },
              {
                headers: {
                  Authorization: "Bearer " + varToken,
                },
              }
            );

            navigate("/Dashboard/Brands");
            toast.success("Brand created successfully!", {
              position: "bottom-right",
              transition: Zoom,
            });
          } else {
            throw new Error("Image upload failed");
          }
        })
        .catch((error) => {
          console.error("Error creating brand:", error);
          toast.error("Failed to create brand. Please try again.", {
            position: "bottom-right",
            transition: Zoom,
          });
        }),
      {
        pending: "Uploading image and creating brand...",
        success: "Brand created successfully!",
        error: "Failed to create brand. Please try again.",
      }
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Create New Brand</h1>
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

          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="websiteUrl"
          >
            Website URL
          </label>
          <input
            type="text"
            id="websiteUrl"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter website URL"
            required
          />

          {/* Image upload input */}
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="brandLogo"
          >
            Logo
          </label>
          <input
            type="file"
            id="brandLogo"
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

export default DashboardCreateBrand;
