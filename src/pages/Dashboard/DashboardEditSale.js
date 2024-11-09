import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, Zoom } from "react-toastify";

const validationSchema = Yup.object({
  saleType: Yup.string()
    .required("Sale type is required")
    .oneOf(["PERCENTAGE", "FIXED_AMOUNT"], "Invalid sale type"),
  saleValue: Yup.number()
    .required("Sale value is required")
    .min(0, "Sale value cannot be negative")
    .when("saleType", {
      is: "PERCENTAGE",
      then: (schema) =>
        schema.max(100, "Sale value cannot be greater than 100 for percentage"),
    })
    .max(999999999999, "Sale value cannot exceed 999999999999"),
  startDate: Yup.date().required("Start date is required"),
  // .min(new Date(), "Start date cannot be in the past"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  saleStatus: Yup.string().required("Sale status is required"),
});

const DashboardEditSale = () => {
  const [initialValues, setInitialValues] = useState({
    saleType: "PERCENTAGE",
    saleValue: "",
    startDate: "",
    endDate: "",
    saleStatus: "ACTIVE",
  });
  const navigate = useNavigate();
  const { saleId } = useParams();
  const varToken = useAuthHeader();

  useEffect(() => {
    apiClient
      .get(`/api/sales/${saleId}`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        const sale = response.data;
        setInitialValues({
          saleType: sale.saleType,
          saleValue: sale.saleValue,
          startDate: formatDateTime(sale.startDate),
          endDate: formatDateTime(sale.endDate),
          saleStatus: sale.saleStatus,
        });
      })
      .catch((error) => {
        console.error("Error fetching sale details:", error);
      });
  }, [saleId]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      apiClient
        .put(`/api/sales/${saleId}`, values, {
          headers: {
            Authorization: varToken,
          },
        })
        .then((response) => {
          toast.success("Update sale successfully", {
            position: "bottom-right",
            transition: Zoom,
          });
          console.log("Sale updated successfully:", response.data);
          navigate("/Dashboard/Sales");
        })
        .catch((error) => {
          toast.error("Update sale failed", {
            position: "bottom-right",
            transition: Zoom,
          });
          console.error("Error updating sale:", error);
        });
    },
  });

  return (
    <div className="max-w-lg mx-auto">
      <Typography variant="h4" gutterBottom>
        Edit Sale {saleId}
      </Typography>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <FormControl fullWidth margin="normal">
          <InputLabel>Sale Type</InputLabel>
          <Select
            id="saleType"
            name="saleType"
            value={formik.values.saleType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Sale Type"
          >
            <MenuItem value="PERCENTAGE">Percentage</MenuItem>
            <MenuItem value="FIXED_AMOUNT">Fixed Amount</MenuItem>
          </Select>
          {formik.touched.saleType && formik.errors.saleType && (
            <Typography color="error">{formik.errors.saleType}</Typography>
          )}
        </FormControl>

        <TextField
          label="Sale Value"
          type="number"
          id="saleValue"
          name="saleValue"
          value={formik.values.saleValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          margin="normal"
          required
          error={formik.touched.saleValue && Boolean(formik.errors.saleValue)}
          helperText={formik.touched.saleValue && formik.errors.saleValue}
        />

        <TextField
          label="Start Date"
          type="datetime-local"
          id="startDate"
          name="startDate"
          value={formik.values.startDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required
          error={formik.touched.startDate && Boolean(formik.errors.startDate)}
          helperText={formik.touched.startDate && formik.errors.startDate}
          disabled
        />

        <TextField
          label="End Date"
          type="datetime-local"
          id="endDate"
          name="endDate"
          value={formik.values.endDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required
          error={formik.touched.endDate && Boolean(formik.errors.endDate)}
          helperText={formik.touched.endDate && formik.errors.endDate}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Sale Status</InputLabel>
          <Select
            id="saleStatus"
            name="saleStatus"
            value={formik.values.saleStatus}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Sale Status"
          >
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
            <MenuItem value="EXPIRED">Expired</MenuItem>
          </Select>
          {formik.touched.saleStatus && formik.errors.saleStatus && (
            <Typography color="error">{formik.errors.saleStatus}</Typography>
          )}
        </FormControl>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Update Sale
        </Button>
      </form>
    </div>
  );
};

export default DashboardEditSale;
