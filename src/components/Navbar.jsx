// components/Navbar.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Link as MuiLink,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import Logo from "/logo.png";
import CustomButton from "./CustomButton";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Reviews", to: "/reviews" },
  { label: "Services Rendered", to: "/ServicesRendered" },
  { label: "Plans", to: "/pricing-plans" },
  { label: "FAQ", to: "/help" },
  { label: "Contact", to: "/Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // switch to burger menu at widths ≤ 990px
  const isBurger = useMediaQuery("(max-width:990px)");

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        bgcolor: "#fff",
        py: 2,
        boxShadow: "0px -5px 15px rgba(8, 106, 216, 0.29)",
      }}
    >
      <Container
        sx={{
          maxWidth: "1440px",
          mx: "auto",
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src={Logo} alt="Panic List Logo" style={{ height: 70 }} />
        </Box>

        {/* Nav links on screens wider than 990px */}
        {!isBurger && (
          <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
            {navLinks.map(({ label, to }) => (
              <MuiLink
                key={to}
                component={Link}
                to={to}
                underline="none"
                sx={{
                  position: "relative",
                  color: "primary.dark",
                  fontWeight: 700,
                  fontFamily: "Manrope, sans-serif",
                  "&::after": {
                    content: "''",
                    position: "absolute",
                    width: "100%",
                    height: "2px",
                    bgcolor: "primary.dark",
                    bottom: -2,
                    left: 0,
                    transform: "scaleX(0)",
                    transition: "transform 0.3s ease",
                    transformOrigin: "left",
                  },
                  "&:hover::after": {
                    transform: "scaleX(1)",
                  },
                }}
              >
                {label}
              </MuiLink>
            ))}
          </Box>
        )}

        {/* Right side: buttons (desktop) or burger icon (≤990px) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {!isBurger ? (
            <CustomButton
              label="Login"
              component={Link}
              to="/login"
            />
          ) : (
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ color: "primary.dark" }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Container>

      {/* Mobile Drawer (≤990px) */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box
          sx={{
            width: 250,
            fontFamily: "Manrope, sans-serif",
            px: 2,
            py: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {navLinks.map(({ label, to }) => (
              <ListItem
                button
                key={to}
                component={Link}
                to={to}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: 700,
                    color: "primary.dark",
                    fontFamily: "Manrope, sans-serif",
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Mobile: Login button only */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 2,
            }}
          >
            <CustomButton
              label="Login"
              width="100%"
              component={Link}
              to="/login"
            />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
