import React, { useState } from "react";
import { toast, Zoom } from "react-toastify";
import { apiClient } from "../../core/api";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const DashboardCreateStaffAccount = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  const varToken = localStorage.getItem("_auth");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setUserImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let imageUrl = "";

    const uploadImage = () => {
      const formData = new FormData();
      formData.append("image", userImage);

      const uploadToastId = toast.loading("Uploading image...");

      return fetch(
        "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            imageUrl = data.data.display_url;
            toast.update(uploadToastId, {
              render: "Image uploaded successfully!",
              type: "success",
              isLoading: false,
              autoClose: 3000,
              transition: Zoom,
            });
          } else {
            throw new Error("Image upload failed");
          }
        });
    };

    const createStaffAccount = () => {
      apiClient
        .post(
          "/api/admin",
          {
            email,
            username,
            fullName,
            passwordHash: password,
            userImage: imageUrl,
            userAddress,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + varToken,
            },
          }
        )
        .then(() => {
          toast.success("Staff account created successfully!", {
            position: "bottom-right",
            transition: Zoom,
          });
          setEmail("");
          setUsername("");
          setFullName("");
          setPassword("");
          setUserImage(null);
          setUserAddress("");
          navigate("/Dashboard/Accounts");
        })
        .catch((error) => {
          toast.error(error.message || "Failed to create staff account", {
            position: "bottom-right",
            transition: Zoom,
          });
        });
    };

    if (userImage) {
      uploadImage()
        .then(createStaffAccount)
        .catch((error) => {
          toast.error(error.message, {
            position: "bottom-right",
            transition: Zoom,
          });
        });
    } else {
      createStaffAccount();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create Staff Account</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter email"
            required
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter username"
            required
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="fullName"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter full name"
            required
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter password"
            required
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="userImage"
          >
            User Image
          </label>
          <input
            type="file"
            id="userImage"
            accept="image/*"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="userAddress"
          >
            User Address
          </label>
          <input
            type="text"
            id="userAddress"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter address"
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardCreateStaffAccount;
