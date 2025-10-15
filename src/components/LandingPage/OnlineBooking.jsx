// components/OnlineBooking.jsx
import React, { useState } from "react";
import { Box, Typography, TextField, MenuItem, useTheme } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CustomButton from "../CustomButton";
import bookingImage from "../../assets/images/LandingPage/online-booking.jpg";

const SERVICES = [
  "Plumbing",
  "Electrical",
  "Roofing",
  "Tutoring",
  "Accounting",
  "Moving",
];

const OnlineBooking = () => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking data:", form);
    // TODO: send to your API...
  };

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          alignItems: "stretch",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          gap: { xs: 2, md: 6 },
        }}
      >
        {/* FORM */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 6 },
            width: "100%",
            maxWidth: { md: "50%" },
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: theme.palette.grey[300], mb: 1 }}
          >
            ONLINE BOOKING
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: 700, mb: 4 }}
          >
            Online Booking For Appointments.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            {["name", "email", "phone"].map((field) => (
              <TextField
                key={field}
                required
                label={
                  field === "phone"
                    ? "Contact number"
                    : field === "name"
                    ? "Full name"
                    : "Email"
                }
                placeholder={
                  field === "name"
                    ? "Your Name"
                    : field === "email"
                    ? "Your Email"
                    : "Your phone"
                }
                value={form[field]}
                onChange={handleChange(field)}
                fullWidth
                variant="filled"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    height: 56,
                    backgroundColor: theme.palette.grey[800],
                    borderRadius: 1,
                    color: theme.palette.common.white,
                    "&:hover": { backgroundColor: theme.palette.grey[800] },
                    "&.Mui-focused": {
                      backgroundColor: theme.palette.grey[800],
                    },
                  },
                }}
                InputLabelProps={{ sx: { color: theme.palette.grey[500] } }}
              />
            ))}

            <TextField
              select
              required
              label="Select service"
              value={form.service}
              onChange={handleChange("service")}
              fullWidth
              variant="filled"
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root": {
                        color: theme.palette.primary.dark,
                      },
                    },
                  },
                },
              }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  height: 56,
                  backgroundColor: theme.palette.grey[800],
                  borderRadius: 1,
                  color: theme.palette.common.white,
                  "& .MuiSelect-icon": {
                    color: theme.palette.common.white,
                  },
                  "& .MuiFilledInput-input": {
                    color: theme.palette.common.white,
                    pt: "18px",
                  },
                  "&:hover": { backgroundColor: theme.palette.grey[800] },
                  "&.Mui-focused": { backgroundColor: theme.palette.grey[800] },
                },
              }}
              InputLabelProps={{ sx: { color: theme.palette.grey[500] } }}
            >
              {SERVICES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Message"
              placeholder="Your message…"
              value={form.message}
              onChange={handleChange("message")}
              fullWidth
              variant="filled"
              multiline
              rows={4}
              sx={{ gridColumn: "1 / -1" }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  backgroundColor: theme.palette.grey[800],
                  borderRadius: 1,
                  color: theme.palette.common.white,
                  "&:hover": { backgroundColor: theme.palette.grey[800] },
                  "&.Mui-focused": { backgroundColor: theme.palette.grey[800] },
                },
              }}
              InputLabelProps={{ sx: { color: theme.palette.grey[500] } }}
            />

            <Box sx={{ gridColumn: "1 / -1", mt: 2 }}>
              <CustomButton
                type="submit"
                label="Get An Appointment"
                width="200px"
                height="48px"
                backgroundColor={theme.palette.primary.main}
                textColor="#fff"
              />
            </Box>
          </Box>
        </Box>

        {/* IMAGE */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            width: "100%",
            alignSelf: { xs: "auto", md: "stretch" },
            "& img": {
              width: "100%",
              height: { xs: "auto", md: "100%" },
              objectFit: "cover",
            },
          }}
        >
          <Box component="img" src={bookingImage} alt="Booking" />

          {/* Glass-like hover play button */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              transition:
                "background-color 0.3s ease, backdrop-filter 0.3s ease, transform 0.3s ease",
              backdropFilter: "none",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.4)",
                backdropFilter: "blur(4px)",
                transform: "translate(-50%, -50%) scale(1.1)",
              },
            }}
          >
            <PlayCircleOutlineIcon
              sx={{
                fontSize: 32,
                color: theme.palette.primary.main,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OnlineBooking;
