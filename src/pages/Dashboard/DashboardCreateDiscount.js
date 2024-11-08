import React from "react";
import { toast, Zoom } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Typography, Box, MenuItem } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { apiClient } from "../../core/api";
import { useNavigate } from "react-router-dom";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardCreateDiscount = () => {
  const validationSchema = Yup.object({
    discountCode: Yup.string()
      .required("Discount code is required")
      .min(3, "Discount code must be at least 3 characters"),
    discountType: Yup.string().required("Discount type is required"),
    discountValue: Yup.number()
      .required("Discount value is required")
      .min(0, "Discount value cannot be negative"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),
    discountStatus: Yup.string().required("Discount status is required"),
    discountDescription: Yup.string(),
    minimumOrderValue: Yup.number().min(
      0,
      "Minimum order value cannot be negative"
    ),
    maximumDiscountValue: Yup.number().min(
      0,
      "Maximum discount value cannot be negative"
    ),
    usageLimit: Yup.number().min(0, "Usage limit cannot be negative"),
  });

  const varToken = useAuthHeader();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      // Make the API call to create the discount
      await apiClient.post(
        "/api/discounts",
        {
          discountCode: values.discountCode,
          discountType: values.discountType,
          discountValue: values.discountValue,
          startDate: values.startDate,
          endDate: values.endDate,
          discountStatus: values.discountStatus,
          discountDescription: values.discountDescription,
          minimumOrderValue: values.minimumOrderValue,
          maximumDiscountValue: values.maximumDiscountValue,
          usageLimit: values.usageLimit,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: varToken,
          },
        }
      );

      toast.success("Discount created successfully!", {
        position: "bottom-right",
        transition: Zoom,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create discount",
        {
          position: "bottom-right",
          transition: Zoom,
        }
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" gutterBottom>
        Create Discount
      </Typography>
      <Formik
        initialValues={{
          discountCode: "",
          discountType: "PERCENTAGE",
          discountValue: "",
          startDate: "",
          endDate: "",
          discountStatus: "ACTIVE",
          discountDescription: "",
          minimumOrderValue: "",
          maximumDiscountValue: "",
          usageLimit: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box sx={{ mb: 2 }}>
              <Field
                name="discountCode"
                as={TextField}
                label="Discount Code"
                variant="outlined"
                fullWidth
                required
                helperText={<ErrorMessage name="discountCode" />}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="discountType"
                as={TextField}
                label="Discount Type"
                variant="outlined"
                select
                fullWidth
                required
              >
                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                <MenuItem value="FIXED_AMOUNT">Fixed Amount</MenuItem>
              </Field>
              <ErrorMessage
                name="discountType"
                component="div"
                className="text-red-500"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="discountValue"
                as={TextField}
                label="Discount Value"
                variant="outlined"
                fullWidth
                required
                type="number"
                helperText={<ErrorMessage name="discountValue" />}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="startDate"
                as={TextField}
                label="Start Date"
                type="date"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={<ErrorMessage name="startDate" />}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="endDate"
                as={TextField}
                label="End Date"
                type="date"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={<ErrorMessage name="endDate" />}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="discountStatus"
                as={TextField}
                label="Discount Status"
                variant="outlined"
                select
                fullWidth
                required
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Field>
              <ErrorMessage
                name="discountStatus"
                component="div"
                className="text-red-500"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="discountDescription"
                as={TextField}
                label="Discount Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="minimumOrderValue"
                as={TextField}
                label="Minimum Order Value"
                variant="outlined"
                fullWidth
                type="number"
                helperText={<ErrorMessage name="minimumOrderValue" />}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="maximumDiscountValue"
                as={TextField}
                label="Maximum Discount Value"
                variant="outlined"
                fullWidth
                type="number"
                helperText={<ErrorMessage name="maximumDiscountValue" />}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="usageLimit"
                as={TextField}
                label="Usage Limit"
                variant="outlined"
                fullWidth
                type="number"
                helperText={<ErrorMessage name="usageLimit" />}
              />
            </Box>
            <div className="flex items-center justify-center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Create Discount
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DashboardCreateDiscount;
