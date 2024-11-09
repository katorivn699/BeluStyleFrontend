import React from "react";
import { toast, Zoom } from "react-toastify";
import { Formik, Field, Form } from "formik";
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
      .min(3, "Discount code must be at least 3 characters")
      .max(20, "Discount code cannot exceed 20 characters"),
    discountType: Yup.string()
      .required("Discount type is required")
      .oneOf(["PERCENTAGE", "FIXED_AMOUNT"], "Invalid discount type"),
    discountValue: Yup.number()
      .required("Discount value is required")
      .min(0, "Discount value cannot be negative")
      .when("discountType", {
        is: "PERCENTAGE",
        then: (schema) =>
          schema
            .max(100, "Discount value cannot be greater than 100")
            .required("Discount value is required"),
      })
      .max(999999999999, "Discount value cannot exceed 999999999999"),
    startDate: Yup.date()
      .required("Start date is required")
      .min(new Date(), "Start date cannot be in the past"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),
    discountStatus: Yup.string()
      .required("Discount status is required")
      .oneOf(
        ["ACTIVE", "INACTIVE"],
        "Invalid discount status (You cannot create an expired discount or make a discount expired)"
      ),
    discountDescription: Yup.string(),
    minimumOrderValue: Yup.number()
      .min(0, "Minimum order value cannot be negative")
      .max(999999999999, "Minimum order value cannot exceed 999999999999")
      .nullable(),
    maximumDiscountValue: Yup.number()
      .min(0, "Maximum discount value cannot be negative")
      .max(999999999999, "Maximum discount value cannot exceed 999999999999")
      .nullable()
      .when("minimumOrderValue", {
        is: (minValue) => minValue != null,
        then: (schema) =>
          schema
            .min(
              Yup.ref("minimumOrderValue"),
              "Must be greater than minimum order value"
            )
            .nullable(),
      }),
    usageLimit: Yup.number()
      .min(1, "Usage limit cannot be negative")
      .required("Usage limit cannot be null"),
  });

  const varToken = useAuthHeader();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await apiClient.post("/api/discounts", values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: varToken,
        },
      });

      toast.success("Discount created successfully!", {
        position: "bottom-right",
        transition: Zoom,
      });
      navigate("/Dashboard/Discounts");
    } catch (error) {
      toast.error("Create discount failed", {
        position: "bottom-right",
        transition: Zoom,
      });
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
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form>
            <Box sx={{ mb: 2 }}>
              <Field
                name="discountCode"
                as={TextField}
                label="Discount Code"
                variant="outlined"
                fullWidth
                required
                error={touched.discountCode && Boolean(errors.discountCode)}
                helperText={touched.discountCode && errors.discountCode}
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
                error={touched.discountType && Boolean(errors.discountType)}
                helperText={touched.discountType && errors.discountType}
              >
                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                <MenuItem value="FIXED_AMOUNT">Fixed Amount</MenuItem>
              </Field>
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
                error={touched.discountValue && Boolean(errors.discountValue)}
                helperText={touched.discountValue && errors.discountValue}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="startDate"
                as={TextField}
                label="Start Date"
                type="datetime-local"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                error={touched.startDate && Boolean(errors.startDate)}
                helperText={touched.startDate && errors.startDate}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="endDate"
                as={TextField}
                label="End Date"
                type="datetime-local"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                error={touched.endDate && Boolean(errors.endDate)}
                helperText={touched.endDate && errors.endDate}
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
                error={touched.discountStatus && Boolean(errors.discountStatus)}
                helperText={touched.discountStatus && errors.discountStatus}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                {/* <MenuItem value="EXPIRED">Expired</MenuItem> */}
              </Field>
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
                error={
                  touched.discountDescription &&
                  Boolean(errors.discountDescription)
                }
                helperText={
                  touched.discountDescription && errors.discountDescription
                }
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
                error={
                  touched.minimumOrderValue && Boolean(errors.minimumOrderValue)
                }
                helperText={
                  touched.minimumOrderValue && errors.minimumOrderValue
                }
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
                error={
                  touched.maximumDiscountValue &&
                  Boolean(errors.maximumDiscountValue)
                }
                helperText={
                  touched.maximumDiscountValue && errors.maximumDiscountValue
                }
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
                error={touched.usageLimit && Boolean(errors.usageLimit)}
                helperText={touched.usageLimit && errors.usageLimit}
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
