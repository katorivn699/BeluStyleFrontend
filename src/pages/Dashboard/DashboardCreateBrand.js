import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const DashboardCreateBrand = () => {
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoFile, setLogoFile] = useState(null); // Store the file instead of URL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Start the loading state
    setIsSubmitting(true);

    try {
      let logoUrl = "";

      // If there is a logo file, upload it to Imgbb
      if (logoFile) {
        const formData = new FormData();
        formData.append("image", logoFile);

        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();

        if (data.success) {
          logoUrl = data.data.display_url;
          toast.success("Image uploaded successfully!");
        } else {
          throw new Error("Image upload failed");
        }
      }

      // Submit the brand data to the API
      await apiClient.post(
        "/api/brands",
        {
          brandName,
          brandDescription,
          websiteUrl,
          logoUrl,
        },
        {
          headers: {
            Authorization: varToken,
          },
        }
      );

      // Navigate to the brands list after successful submission
      navigate("/Dashboard/Brands");
    } catch (error) {
      console.error("Error creating brand:", error);
      toast.error("Failed to create brand");
    } finally {
      setIsSubmitting(false); // End the loading state
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Create New Brand</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <TextField
            label="Brand Name"
            fullWidth
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            value={brandDescription}
            onChange={(e) => setBrandDescription(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            label="Website URL"
            fullWidth
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            margin="normal"
          />
          <Box mt={2}>
            <Button variant="outlined" component="label">
              Upload Logo
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setLogoFile(file);
                }}
              />
            </Button>
          </Box>
          {logoFile && (
            <Box mt={2}>
              <img
                src={URL.createObjectURL(logoFile)}
                alt="Brand Logo"
                className="w-32 h-32 object-cover rounded"
              />
            </Box>
          )}
        </div>
        <div className="flex items-center justify-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DashboardCreateBrand;
