import React, { useState } from "react";
import { toast, Zoom } from "react-toastify";
import { apiClient } from "../../core/api";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LocationSelector from "../../service/LocationService";

const DashboardCreateStaffAccount = () => {
  const varToken = localStorage.getItem("_auth");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    username: Yup.string()
      .required("Username is required")
      .min(7, "Username must be at least 7 characters")
      .matches(
        /^[a-zA-Z0-9]*$/,
        "Username cannot contain special characters or spaces"
      ),
    fullName: Yup.string().required("Full name is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "Password must contain one uppercase, one lowercase, and one number"
      ),
    userAddress: Yup.string().required("Address is required"),
  });

  const handleSubmit = async (values) => {
    let imageUrl = "";

    const uploadImage = () => {
      const formData = new FormData();
      formData.append("image", values.userImage);

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
            email: values.email,
            username: values.username,
            fullName: values.fullName,
            passwordHash: values.password,
            userImage: imageUrl,
            userAddress: values.userAddress,
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
          navigate("/Dashboard/Accounts");
        })
        .catch((error) => {
          toast.error(error.message || "Failed to create staff account", {
            position: "bottom-right",
            transition: Zoom,
          });
        });
    };

    if (values.userImage) {
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
      <Formik
        initialValues={{
          email: "",
          username: "",
          fullName: "",
          password: "",
          userImage: null,
          userAddress: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter email"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm"
              />

              <label
                className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                htmlFor="username"
              >
                Username
              </label>
              <Field
                type="text"
                id="username"
                name="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter username"
              />
              <ErrorMessage
                name="username"
                component="p"
                className="text-red-500 text-sm"
              />

              <label
                className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <Field
                type="text"
                id="fullName"
                name="fullName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter full name"
              />
              <ErrorMessage
                name="fullName"
                component="p"
                className="text-red-500 text-sm"
              />

              <label
                className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                htmlFor="password"
              >
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter password"
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm"
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
                onChange={(e) => setFieldValue("userImage", e.target.files[0])}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <label
                className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                htmlFor="userAddress"
              >
                User Address
              </label>
              <LocationSelector
                onLocationChange={(location) =>
                  setFieldValue(
                    "userAddress",
                    `${location.tinh}, ${location.quan}, ${location.phuong}`
                  )
                }
              />
              <ErrorMessage
                name="userAddress"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create Account
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DashboardCreateStaffAccount;
