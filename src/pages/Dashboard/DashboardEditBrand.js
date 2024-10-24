import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import { toast, Zoom } from "react-toastify";

const DashboardEditBrand = () => {
  const { brandId } = useParams();
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState("");
  const navigate = useNavigate();

  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await apiClient.get(`/api/brands/${brandId}`, {
          headers: {
            Authorization: "Bearer " + varToken,
          },
        });

        const { brandName, brandDescription, websiteUrl, logoUrl } =
          response.data;

        setBrandName(brandName);
        setBrandDescription(brandDescription);
        setWebsiteUrl(websiteUrl);
        setCurrentLogoUrl(logoUrl);
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    fetchBrand();
  }, [brandId, varToken]);

  const handleImageChange = (e) => {
    setBrandImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let logoUrl = currentLogoUrl;

      if (brandImage) {
        const formData = new FormData();
        formData.append("image", brandImage);

        await toast.promise(
          fetch(
            "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
            {
              method: "POST",
              body: formData,
            }
          )
            .then((uploadResponse) => uploadResponse.json())
            .then((uploadData) => {
              if (uploadData.success) {
                logoUrl = uploadData.data.display_url;
              } else {
                throw new Error("Image upload failed");
              }
            }),
          {
            pending: "Uploading image...",
            success: "Image uploaded successfully!",
            error: "Image upload failed",
          },
          {
            position: "bottom-right",
            transition: Zoom,
          }
        );
      }

      await apiClient.put(
        "/api/brands",
        {
          brandId,
          brandName,
          brandDescription,
          websiteUrl,
          logoUrl,
        },
        {
          headers: {
            Authorization: "Bearer " + varToken,
          },
        }
      );

      toast.success("Brand updated successfully", {
        position: "bottom-right",
        transition: Zoom,
      });

      navigate("/Dashboard/Brands");
    } catch (error) {
      toast.error("Update brand failed", {
        position: "bottom-right",
        transition: Zoom,
      });
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

          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="brandImage"
          >
            Logo (Leave blank to keep current logo)
          </label>
          <input
            type="file"
            id="brandImage"
            accept="image/*"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          {currentLogoUrl && (
            <div className="mt-4">
              <img
                src={currentLogoUrl}
                alt="Current Logo"
                className="w-32 h-32 object-cover rounded"
              />
              <p className="text-gray-600 mt-2">Current Logo</p>
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

export default DashboardEditBrand;
