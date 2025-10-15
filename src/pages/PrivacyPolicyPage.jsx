import React from "react";
import {
  Box,
  Container,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Link as MuiLink,
} from "@mui/material";

// sidebar nav structure
const navSections = [
  {
    heading: "Getting Started",
    items: [{ id: "overview", label: "Overview" }],
  },
  {
    heading: "Privacy",
    items: [
      { id: "toc", label: "Table Of Contents" },
      { id: "privacy-faq", label: "Privacy FAQ" },
    ],
  },
  {
    heading: "Applicability",
    items: [
      {
        id: "applicability-of-this-privacy-policy",
        label: "Applicability of this Privacy Policy",
      },
      { id: "app-lorem-2", label: "Lorem Ipsum" },
      { id: "app-lorem-3", label: "Lorem Ipsum" },
    ],
  },
  {
    heading: "Information We Collect",
    items: [
      { id: "info-lorem-1", label: "Lorem Ipsum" },
      { id: "info-lorem-2", label: "Lorem Ipsum" },
      { id: "ccpa-faq", label: "California Consumer Privacy Act (CCPA) FAQ" },
      { id: "info-lorem-3", label: "Lorem Ipsum" },
      { id: "info-lorem-4", label: "Lorem Ipsum" },
    ],
  },
  {
    heading: "Security",
    items: [{ id: "security", label: "Overview" }],
  },
  {
    heading: "Data Management",
    items: [
      { id: "transparency-and-control", label: "Transparency and Control" },
      {
        id: "privacy-principles-search-learning-and-intelligence",
        label: "Privacy principles: Search, Learning, and Intelligence",
      },
    ],
  },
  {
    heading: "Legal",
    items: [{ id: "legal-overview", label: "Legal Overview" }],
  },
];

const PrivacyPolicyPage = () => (
  <Box sx={{ fontFamily: "'Manrope', sans-serif" }}>
    {/* Page header */}
    <Box sx={{ bgcolor: "#D8FDFF", py: 4 }}>
      <Container>
        <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
          Privacy Policy
        </Typography>
      </Container>
    </Box>

    {/* Main area */}
    <Container maxWidth="lg" sx={{ my: 6 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "flex-start",
        }}
      >
        {/* Sidebar nav */}
        <Box
          component="nav"
          sx={{
            width: { xs: "100%", md: "240px" },
            position: { md: "sticky" },
            top: { md: 120 },
          }}
        >
          {navSections.map((section) => (
            <Box key={section.heading} sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, px: 1, mb: 1 }}
              >
                {section.heading}
              </Typography>
              <List disablePadding>
                {section.items.map((item) => (
                  <ListItemButton
                    key={item.id}
                    component={MuiLink}
                    href={`#${item.id}`}
                    sx={{ pl: 2, borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          ))}
        </Box>

        {/* Content column */}
        <Box sx={{ flex: 1, width: { xs: "100%", md: "auto" } }}>
          {/* Effective date + intro */}
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Effective: July 5, 2023
          </Typography>
          <Typography variant="body2" paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            <br />
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            <br />
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            <br />
            Nisi ut aliquip ex ea commodo consequat.
          </Typography>
          <Typography variant="body2" paragraph>
            Duis aute irure dolor in reprehenderit in voluptate velit esse.
            <br />
            Cillum dolore eu fugiat nulla pariatur.
            <br />
            Excepteur sint occaecat cupidatat non proident.
          </Typography>

          {/* In-page Table of Contents */}
          <Typography variant="h6" component="h3" sx={{ mt: 4, mb: 2 }}>
            Table of Contents:
          </Typography>
          <List disablePadding>
            {navSections
              .flatMap((sec) => sec.items)
              .map(({ id, label }) => (
                <ListItemButton
                  key={id}
                  component={MuiLink}
                  href={`#${id}`}
                  sx={{ pl: 0, mb: 0.5 }}
                >
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItemButton>
              ))}
          </List>

          {/* 1. Overview */}
          <Box id="overview" sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Overview
            </Typography>
            <Typography variant="body2" paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br />
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              <br />
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris.
              <br />
              Nisi ut aliquip ex ea commodo consequat.
            </Typography>
          </Box>

          {/* 2. Applicability */}
          <Box id="applicability-of-this-privacy-policy" sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Applicability of this Privacy Policy
            </Typography>
            <Typography variant="body2" paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br />
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              <br />
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris.
              <br />
              Nisi ut aliquip ex ea commodo consequat.
              <br />
              Duis aute irure dolor in reprehenderit in voluptate velit esse.
              <br />
              Cillum dolore eu fugiat nulla pariatur.
              <br />
              Excepteur sint occaecat cupidatat non proident.
            </Typography>
          </Box>

          {/* 3. Information We Collect */}
          <Box id="information-we-collect-and-receive" sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Information We Collect and Receive
            </Typography>
            <Typography variant="body2" paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br />
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
            <Typography variant="body2" paragraph>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris.
              <br />
              Nisi ut aliquip ex ea commodo consequat.
            </Typography>
          </Box>

          {/* 4. Processing */}
          <Box
            id="how-we-process-your-information-and-our-legal-bases-for-doing-so"
            sx={{ mt: 4 }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              How We Process Your Information and Our Legal Bases for Doing So
            </Typography>
            <Typography variant="body2" paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br />
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </Box>

          {/* 5. Security */}
          <Box id="security" sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Security
            </Typography>
            <Typography variant="body2" paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br />
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </Box>

          {/* 6. Data Management */}
          <Box id="transparency-and-control" sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Transparency and Control
            </Typography>
            <Typography variant="body2" paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br />
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </Box>

          <Box
            id="privacy-principles-search-learning-and-intelligence"
            sx={{ mt: 4 }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Privacy principles: Search, Learning, and Intelligence
            </Typography>
            <Typography variant="body2" paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br />
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </Box>

          {/* 7. Legal */}
          <Box id="legal-overview" sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Legal Overview
            </Typography>
            <Typography variant="body2" paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br />
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  </Box>
);

export default PrivacyPolicyPage;
