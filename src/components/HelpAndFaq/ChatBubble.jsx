import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";

const ChatBubble = () => {
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        fontFamily: "'Manrope', sans-serif",
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      {/* Chat window (visible when open) */}
      {open && (
        <Box
          sx={{
            width: { xs: 280, md: 320 },
            bgcolor: "#B9FCFF",
            border: "1px solid #10B2B9",
            borderRadius: 2,
            p: 2,
            boxShadow: 3,
            mb: 1,
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          {/* Message row */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "common.white",
                px: 2,
                py: 1,
                borderRadius: "0 16px 16px 16px",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              Hey! How can we help?
            </Box>
          </Box>
          {/* Input row */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              placeholder="type a message..."
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                sx: {
                  fontFamily: "'Manrope', sans-serif",
                  bgcolor: "common.white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "#9D9D9D",
                    opacity: 1,
                    fontFamily: "'Manrope', sans-serif",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "#555555",
                    fontFamily: "'Manrope', sans-serif",
                  },
                },
              }}
            />
            <IconButton color="primary" sx={{ ml: 1 }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Floating chat toggle icon */}
      <IconButton
        onClick={() => setOpen((prev) => !prev)}
        color="primary"
        sx={{
          bgcolor: "primary.main",
          color: "common.white",
          "&:hover": { bgcolor: "primary.dark" },
          width: 48,
          height: 48,
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        <ChatIcon />
      </IconButton>
    </Box>
  );
};

export default ChatBubble;
