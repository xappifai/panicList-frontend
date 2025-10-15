// components/CustomButton.jsx
import React from "react";
import { Button as MuiButton } from "@mui/material";

const CustomButton = ({
  label = "Text",
  width = "100px",
  height = "50px",
  backgroundColor = "primary.main",
  textColor = "white",
  ...rest
}) => {
  return (
    <MuiButton
      variant="contained"
      sx={{
        width,
        height,
        backgroundColor,
        color: textColor,
        textTransform: "none",
        fontFamily: "Manrope, sans-serif",
        fontWeight: 600, // updated from 500 to 600
        fontSize: "1rem",
        borderRadius: "8px",
        "&:hover": {
          backgroundColor,
          opacity: 0.9,
        },
      }}
      {...rest}
    >
      {label}
    </MuiButton>
  );
};

export default CustomButton;
