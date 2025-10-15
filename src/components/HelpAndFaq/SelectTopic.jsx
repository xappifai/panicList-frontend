import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SupportIcon from "@mui/icons-material/Support";
import PublicIcon from "@mui/icons-material/Public";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const topics = [
  {
    title: "Payments",
    description:
      "Id mea congue dictas, nec et summo mazim impedit. Vim te audiam impetus interpretaris.",
    icon: AccountBalanceWalletIcon,
  },
  {
    title: "Submission",
    description:
      "Id mea congue dictas, nec et summo mazim impedit. Vim te audiam impetus interpretaris.",
    icon: CloudUploadIcon,
  },
  {
    title: "General help",
    description:
      "Id mea congue dictas, nec et summo mazim impedit. Vim te audiam impetus interpretaris.",
    icon: SupportIcon,
  },
  {
    title: "International",
    description:
      "Id mea congue dictas, nec et summo mazim impedit. Vim te audiam impetus interpretaris.",
    icon: PublicIcon,
  },
  {
    title: "Cancellation",
    description:
      "Id mea congue dictas, nec et summo mazim impedit. Vim te audiam impetus interpretaris.",
    icon: CancelScheduleSendIcon,
  },
  {
    title: "Reviews",
    description:
      "Id mea congue dictas, nec et summo mazim impedit. Vim te audiam impetus interpretaris.",
    icon: ChatBubbleOutlineIcon,
  },
];

const SelectTopic = () => (
  <Box
    component="section"
    sx={{
      fontFamily: "'Manrope', sans-serif",
      py: { xs: 6, md: 12 },
      bgcolor: "#F9FAFB",
    }}
  >
    <Container maxWidth="lg">
      {/* Heading with dual-line underline */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            width: 60,
            height: 3,
            bgcolor: "primary.main",
            mx: "auto",
            mb: 1,
            borderRadius: 1,
          }}
        />

        <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
          Select a topic
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cum doctus civibus efficiantur in imperdiet deterruisset.
        </Typography>
      </Box>

      {/* Topics Flex Container */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: { xs: "center", sm: "center", md: "space-between" },
        }}
      >
        {topics.map(({ title, description, icon: Icon }) => (
          <Paper
            key={title}
            elevation={0}
            sx={{
              flexBasis: { xs: "100%", sm: "48%", md: "31%" },
              p: 3,
              bgcolor: "common.white",
              textAlign: "center",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <Icon sx={{ fontSize: 48, color: "#00BFA5", mb: 2 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1, color: "#222222" }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  </Box>
);

export default SelectTopic;
