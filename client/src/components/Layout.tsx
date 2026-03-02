import React from "react";
import { Box } from "@mui/material";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <Navbar />
      <Box sx={{ mt: 4, mb: 4, px: 3, flexGrow: 1, width: "100%" }}>
        {children}
      </Box>
    </Box>
  );
};
