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
  Box,
} from "@mui/material";
import { apiClient } from "../../core/api";

const DashboardEditDiscount = () => {
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discountStatus, setDiscountStatus] = useState("ACTIVE");
  const [discountCode, setDiscountCode] = useState("");
  const [discountDescription, setDiscountDescription] = useState("");
  const navigate = useNavigate();
  const { discountId } = useParams();
  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const response = await apiClient.get(`/api/discounts/${discountId}`, {
          headers: { Authorization: "Bearer " + varToken },
        });
        const discount = response.data;
        setDiscountType(discount.discountType);
        setDiscountValue(discount.discountValue);
        setStartDate(formatDate(discount.startDate));
        setEndDate(formatDate(discount.endDate));
        setDiscountStatus(discount.discountStatus);
        setDiscountCode(discount.discountCode);
        setDiscountDescription(discount.discountDescription);
      } catch (error) {
        console.error("Error fetching discount details:", error);
      }
    };
    fetchDiscount();
  }, [discountId, varToken]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedDiscount = {
      discountType,
      discountValue: parseFloat(discountValue),
      startDate,
      endDate,
      discountStatus,
      discountCode,
      discountDescription,
    };

    try {
      await apiClient.put(`/api/discounts/${discountId}`, updatedDiscount, {
        headers: { Authorization: "Bearer " + varToken },
      });
      navigate("/Dashboard/Discounts");
    } catch (error) {
      console.error("Error updating discount:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Typography variant="h4" gutterBottom>
        Edit Discount {discountId}
      </Typography>
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          label="Discount Code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          fullWidth
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Discount Type</InputLabel>
          <Select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            label="Discount Type"
          >
            <MenuItem value="PERCENTAGE">Percentage</MenuItem>
            <MenuItem value="FIXED_AMOUNT">Fixed Amount</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Discount Value"
          type="number"
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Discount Status</InputLabel>
          <Select
            value={discountStatus}
            onChange={(e) => setDiscountStatus(e.target.value)}
            label="Discount Status"
          >
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Discount Description"
          value={discountDescription}
          onChange={(e) => setDiscountDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Update Discount
        </Button>
      </form>
    </div>
  );
};

export default DashboardEditDiscount;
