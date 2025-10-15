// src/components/AdminDashboard/pages/Settings.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

const Settings = () => {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState("");
  const [notifications, setNotifications] = useState({
    newReview: false,
    newWithdrawal: false,
    failedPayment: false,
  });

  const handleCreateRole = () => {
    console.log("Creating role:", { roleName, permissions });
    // Implement role creation functionality
    if (roleName.trim() && permissions.trim()) {
      // Reset form after successful creation
      setRoleName("");
      setPermissions("");
      alert("Role created successfully!");
    } else {
      alert("Please fill in both role name and permissions.");
    }
  };

  const handleUpdateNotifications = () => {
    console.log("Updating notifications:", notifications);
    // Implement notification update functionality
    alert("Notifications updated successfully!");
  };

  const handleNotificationChange = (event) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Page Header */}
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#1F2937", fontSize: "1.875rem", mb: 1 }}>
        Settings
      </Typography>
      <Typography variant="body1" sx={{ color: "#6B7280", fontSize: "1rem", mb: 6 }}>
        Manage system-level configurations and settings.
      </Typography>

      {/* Admin Roles and Permissions Section */}
      <Card sx={{ 
        mb: 4, 
        backgroundColor: "#FFFFFF", 
        borderRadius: 3, 
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        border: "1px solid #E2E8F0",
        maxWidth: 600
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 600, 
            color: "#374151", 
            fontSize: "1.25rem", 
            mb: 3 
          }}>
            Admin Roles and Permissions
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ 
              fontWeight: 500, 
              color: "#374151", 
              mb: 1,
              fontSize: "0.875rem"
            }}>
              Role Name
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g., Super Admin"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F9FAFB",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#9CA3AF",
                    fontStyle: "italic",
                    fontSize: "0.875rem",
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ 
              fontWeight: 500, 
              color: "#374151", 
              mb: 1,
              fontSize: "0.875rem"
            }}>
              Permissions
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Enter permissions for this role..."
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F9FAFB",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#9CA3AF",
                    fontStyle: "italic",
                    fontSize: "0.875rem",
                  },
                },
              }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleCreateRole}
            sx={{
              backgroundColor: "#00ADB4",
              color: "white",
              fontWeight: 600,
              fontSize: "0.875rem",
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#009DA4",
              },
              "&:active": {
                backgroundColor: "#008B92",
              },
            }}
          >
            Create Role
          </Button>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card sx={{ 
        backgroundColor: "#FFFFFF", 
        borderRadius: 3, 
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        border: "1px solid #E2E8F0",
        maxWidth: 600
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 600, 
            color: "#374151", 
            fontSize: "1.25rem", 
            mb: 3 
          }}>
            Notifications
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={notifications.newReview}
                  onChange={handleNotificationChange}
                  name="newReview"
                  sx={{
                    color: "#00ADB4",
                    "&.Mui-checked": {
                      color: "#00ADB4",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0, 173, 180, 0.04)",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ 
                  color: "#374151", 
                  fontSize: "0.875rem",
                  fontWeight: 500
                }}>
                  New Review Notifications
                </Typography>
              }
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={notifications.newWithdrawal}
                  onChange={handleNotificationChange}
                  name="newWithdrawal"
                  sx={{
                    color: "#00ADB4",
                    "&.Mui-checked": {
                      color: "#00ADB4",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0, 173, 180, 0.04)",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ 
                  color: "#374151", 
                  fontSize: "0.875rem",
                  fontWeight: 500
                }}>
                  New Withdrawal Notifications
                </Typography>
              }
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={notifications.failedPayment}
                  onChange={handleNotificationChange}
                  name="failedPayment"
                  sx={{
                    color: "#00ADB4",
                    "&.Mui-checked": {
                      color: "#00ADB4",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0, 173, 180, 0.04)",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ 
                  color: "#374151", 
                  fontSize: "0.875rem",
                  fontWeight: 500
                }}>
                  Failed Payment Notifications
                </Typography>
              }
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleUpdateNotifications}
            sx={{
              backgroundColor: "#00ADB4",
              color: "white",
              fontWeight: 600,
              fontSize: "0.875rem",
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#009DA4",
              },
              "&:active": {
                backgroundColor: "#008B92",
              },
            }}
          >
            Update Notifications
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;

