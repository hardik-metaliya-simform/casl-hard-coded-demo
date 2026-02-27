import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import type { AlertColor } from "@mui/material";
import { notificationService } from "../services/notificationService";

export const Notifications: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("info");

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((msg, type) => {
      setMessage(msg);
      setSeverity(type as AlertColor);
      setOpen(true);
    });

    return unsubscribe;
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
