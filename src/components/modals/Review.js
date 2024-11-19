import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box, Typography, Rating } from "@mui/material";

function ReviewModal({ open, handleClose, productId, name, image, orderDetails, handleSubmitReview }) {
  const [reviewText, setReviewText] = useState(""); // State for review text input
  const [rating, setRating] = useState(0); // State for rating

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleRatingChange = (e, newValue) => {
    setRating(newValue);
  };

  const handleReviewSubmit = () => {
    const review = {
        productId: productId,
        reviewComment: reviewText,
        reviewRating: rating,
        orderDetailId: orderDetails
      };
    handleSubmitReview(productId, review);
    clearFields();
  };


  const clearFields = () => {
    setReviewText(""); // Clear review text
    setRating(0); // Reset rating
  };

  const handleCancel = () => {
    clearFields(); // Clear fields when canceled
    handleClose(); // Close the modal
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel} 
      maxWidth="sm" 
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "16px",
          padding: "16px",
          fontFamily: "Poppins",
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          textAlign: "center", 
          fontWeight: "bold", 
          fontFamily: "Poppins", 
          fontSize: "1.5rem" 
        }}
      >
        Add Review for {name}
      </DialogTitle>
      <DialogContent 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 2, 
          alignItems: "center",
          px: 4,
          pb: 3
        }}
      >
        {/* Product details */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2,
            width: "100%", 
            mb: 2, 
          }}
        >
          <img 
            src={image} 
            alt={name} 
            style={{ 
              width: 80, 
              height: 80, 
              objectFit: "cover", 
              borderRadius: "12px", 
              border: "2px solid #ddd",
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "Poppins", 
              fontWeight: "bold",
              fontSize: "1.2rem", 
              textOverflow: "ellipsis", 
              overflow: "hidden", 
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </Typography>
        </Box>

        {/* Rating */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1, 
            width: "100%",
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "Poppins", 
              fontSize: "1rem", 
            }}
          >
            Rating:
          </Typography>
          <Rating 
            value={rating} 
            onChange={handleRatingChange} 
            size="large" 
            sx={{
              color: "#fbc02d", // Gold color for rating stars
            }}
          />
        </Box>

        {/* Review text area */}
        <TextField
          label="Your Review"
          multiline
          fullWidth
          rows={4}
          value={reviewText}
          onChange={handleReviewChange}
          sx={{
            mt: 2,
            "& .MuiInputBase-root": {
              fontFamily: "Poppins",
            },
            "& .MuiInputLabel-root": {
              fontFamily: "Poppins",
              fontSize: "0.9rem",
            },
          }}
        />
      </DialogContent>
      <DialogActions 
        sx={{
          display: "flex", 
          justifyContent: "space-between", 
          px: 3,
        }}
      >
        <Button 
          onClick={handleCancel} 
          color="secondary"
          sx={{
            textTransform: "none",
            fontFamily: "Poppins",
            fontSize: "0.9rem",
            padding: "6px 16px",
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleReviewSubmit} 
          color="primary"
          variant="contained"
          sx={{
            textTransform: "none",
            fontFamily: "Poppins",
            fontSize: "0.9rem",
            padding: "6px 16px",
            borderRadius: "8px",
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReviewModal;
