import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, Zoom } from "react-toastify";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
};

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
        schema.max(100, "Discount value cannot be greater than 100"),
    })
    .max(999999999999, "Discount value cannot exceed 999999999999"),
  startDate: Yup.date().required("Start date is required"),
  // .min(new Date(), "Start date cannot be in the past"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  discountStatus: Yup.string()
    .required("Discount status is required")
    .oneOf(["ACTIVE", "INACTIVE"], "Invalid discount status"),
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
        schema.min(
          Yup.ref("minimumOrderValue"),
          "Must be greater than minimum order value"
        ),
    }),
  usageLimit: Yup.number()
    .min(1, "Usage limit cannot be negative")
    .required("Usage limit cannot be null"),
});

const DashboardEditDiscount = () => {
  const [initialValues, setInitialValues] = useState({
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
  });

  const navigate = useNavigate();
  const { discountId } = useParams();
  const varToken = useAuthHeader();

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const response = await apiClient.get(`/api/discounts/${discountId}`, {
          headers: { Authorization: varToken },
        });
        const discount = response.data;
        setInitialValues({
          discountCode: discount.discountCode,
          discountType: discount.discountType,
          discountValue: discount.discountValue,
          startDate: formatDateTime(discount.startDate),
          endDate: formatDateTime(discount.endDate),
          discountStatus: discount.discountStatus,
          discountDescription: discount.discountDescription,
          minimumOrderValue: discount.minimumOrderValue,
          maximumDiscountValue: discount.maximumDiscountValue,
          usageLimit: discount.usageLimit,
        });
      } catch (error) {
        console.error("Error fetching discount details:", error);
      }
    };
    fetchDiscount();
  }, [discountId, varToken]);

  const handleSubmit = (values) => {
    apiClient
      .put(`/api/discounts/${discountId}`, values, {
        headers: { Authorization: varToken },
      })
      .then(() => {
        toast.success("Update discount successfully", {
          position: "bottom-right",
          transition: Zoom,
        });
        navigate("/Dashboard/Discounts");
      })
      .catch((error) => {
        toast.error("Update discount failed", {
          position: "bottom-right",
          transition: Zoom,
        });
        console.error("Error updating discount:", error);
      });
  };

  return (
    <div className="max-w-lg mx-auto">
      <Typography variant="h4" gutterBottom>
        Edit Discount {discountId}
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange, errors, touched }) => (
          <Form className="space-y-6">
            <TextField
              label="Discount Code"
              name="discountCode"
              value={values.discountCode}
              onChange={handleChange}
              fullWidth
              error={touched.discountCode && Boolean(errors.discountCode)}
              helperText={touched.discountCode && errors.discountCode}
              required
              disabled
            />

            <FormControl
              fullWidth
              error={touched.discountType && Boolean(errors.discountType)}
            >
              <InputLabel>Discount Type</InputLabel>
              <Select
                name="discountType"
                value={values.discountType}
                onChange={handleChange}
                label="Discount Type"
              >
                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                <MenuItem value="FIXED_AMOUNT">Fixed Amount</MenuItem>
              </Select>
              <FormHelperText>
                {touched.discountType && errors.discountType}
              </FormHelperText>
            </FormControl>

            <TextField
              label="Discount Value"
              name="discountValue"
              type="number"
              value={values.discountValue}
              onChange={handleChange}
              fullWidth
              error={touched.discountValue && Boolean(errors.discountValue)}
              helperText={touched.discountValue && errors.discountValue}
              required
            />

            <TextField
              label="Start Date"
              name="startDate"
              type="datetime-local"
              value={values.startDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={touched.startDate && Boolean(errors.startDate)}
              helperText={touched.startDate && errors.startDate}
              required
            />

            <TextField
              label="End Date"
              name="endDate"
              type="datetime-local"
              value={values.endDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={touched.endDate && Boolean(errors.endDate)}
              helperText={touched.endDate && errors.endDate}
              required
            />

            <FormControl
              fullWidth
              error={touched.discountStatus && Boolean(errors.discountStatus)}
            >
              <InputLabel>Discount Status</InputLabel>
              <Select
                name="discountStatus"
                value={values.discountStatus}
                onChange={handleChange}
                label="Discount Status"
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="EXPIRED">Expired</MenuItem>
                <MenuItem value="USED">Used</MenuItem>
              </Select>
              <FormHelperText>
                {touched.discountStatus && errors.discountStatus}
              </FormHelperText>
            </FormControl>

            <TextField
              label="Discount Description"
              name="discountDescription"
              value={values.discountDescription}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              label="Minimum Order Value"
              name="minimumOrderValue"
              type="number"
              value={values.minimumOrderValue}
              onChange={handleChange}
              fullWidth
              error={
                touched.minimumOrderValue && Boolean(errors.minimumOrderValue)
              }
              helperText={touched.minimumOrderValue && errors.minimumOrderValue}
            />

            <TextField
              label="Maximum Discount Value"
              name="maximumDiscountValue"
              type="number"
              value={values.maximumDiscountValue}
              onChange={handleChange}
              fullWidth
              error={
                touched.maximumDiscountValue &&
                Boolean(errors.maximumDiscountValue)
              }
              helperText={
                touched.maximumDiscountValue && errors.maximumDiscountValue
              }
            />

            <TextField
              label="Usage Limit"
              name="usageLimit"
              type="number"
              value={values.usageLimit}
              onChange={handleChange}
              fullWidth
              error={touched.usageLimit && Boolean(errors.usageLimit)}
              helperText={touched.usageLimit && errors.usageLimit}
              required
            />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update Discount
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DashboardEditDiscount;
