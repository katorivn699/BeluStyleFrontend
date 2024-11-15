import React from "react";
import { Box, Button, Typography, Modal } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, name }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Confirm Delete
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          Are you sure you want to delete "{name}"?
        </Typography>
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button onClick={onClose} color="secondary" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary" variant="contained">
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;