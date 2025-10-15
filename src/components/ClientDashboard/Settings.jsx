// src/components/ClientDashboard/Settings.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Switch,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  Grid,
} from "@mui/material";
import { useUser } from "../../contexts/UserContext.jsx";
import { authAPI } from "../../services/apiService.js";

export default function Settings() {
  const { user, updateUser } = useUser();
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    dateOfBirth: ""
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    notifications: true,
    emailUpdates: true,
    smsUpdates: false,
    orderUpdates: true,
    promotionalEmails: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    twoFactorAuth: false,
    profileVisibility: "public"
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: ""
        },
        dateOfBirth: user.dateOfBirth || ""
      });

      setNotificationPreferences({
        notifications: user.preferences?.notifications ?? true,
        emailUpdates: user.preferences?.emailUpdates ?? true,
        smsUpdates: user.preferences?.smsUpdates ?? false,
        orderUpdates: user.preferences?.orderUpdates ?? true,
        promotionalEmails: user.preferences?.promotionalEmails ?? false
      });
    }
  }, [user]);

  const handlePersonalInfoChange = (field, value) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setPersonalInfo(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setPersonalInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNotificationChange = (field, checked) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handlePrivacyChange = (field, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePersonalInfo = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Clean up the data before sending
      const updateData = {
        fullName: personalInfo.fullName?.trim() || undefined,
        dateOfBirth: personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth).toISOString() : undefined
      };

      // Validate and add phone number if provided
      if (personalInfo.phoneNumber?.trim()) {
        const phoneNumber = personalInfo.phoneNumber.trim();
        // Basic phone number validation - must start with + and have digits
        if (phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
          updateData.phoneNumber = phoneNumber;
        } else {
          throw new Error('Please enter a valid phone number in the format +1234567890');
        }
      }

      // Handle address object - only include if it has meaningful data
      if (personalInfo.address && (
        personalInfo.address.street?.trim() || 
        personalInfo.address.city?.trim() || 
        personalInfo.address.state?.trim() || 
        personalInfo.address.zipCode?.trim() ||
        personalInfo.address.country?.trim()
      )) {
        updateData.address = {};
        
        // Only add fields that have values
        if (personalInfo.address.street?.trim()) {
          updateData.address.street = personalInfo.address.street.trim();
        }
        if (personalInfo.address.city?.trim()) {
          updateData.address.city = personalInfo.address.city.trim();
        }
        if (personalInfo.address.state?.trim()) {
          updateData.address.state = personalInfo.address.state.trim();
        }
        if (personalInfo.address.zipCode?.trim()) {
          updateData.address.zipCode = personalInfo.address.zipCode.trim();
        }
        if (personalInfo.address.country?.trim()) {
          updateData.address.country = personalInfo.address.country.trim();
        }
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === '') {
          delete updateData[key];
        }
      });

      console.log('Sending update data:', updateData);
      const response = await authAPI.updateProfile(updateData);
      
      if (response.success) {
        setSuccess('Personal information updated successfully!');
        updateUser(response.data);
      } else {
        throw new Error(response.message || 'Failed to update personal information');
      }
    } catch (error) {
      console.error('Error updating personal info:', error);
      console.error('Error details:', error);
      
      // Handle validation errors
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors.map(err => `${err.field}: ${err.message}`).join(', ');
        setError(`Validation error: ${errorMessages}`);
      } else {
        setError(error.message || 'Failed to update personal information');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotificationPreferences = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData = {
        preferences: notificationPreferences
      };

      const response = await authAPI.updateProfile(updateData);
      
      if (response.success) {
        setSuccess('Notification preferences updated successfully!');
        updateUser(response.data);
      } else {
        throw new Error(response.message || 'Failed to update notification preferences');
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      setError(error.message || 'Failed to update notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = () => {
    // Handle update profile logic
    console.log("Updating profile:", personalInfo);
  };

  const handleSavePreferences = () => {
    // Handle save preferences logic
    console.log("Saving notification preferences:", notificationPreferences);
  };

  const handleResetPassword = () => {
    // Handle reset password logic
    console.log("Resetting password...");
  };

  const handleTwoFactorAuth = (event) => {
    handlePrivacyChange('twoFactorAuth', event.target.checked);
  };

  const handleDeleteAccount = () => {
    // Handle delete account logic
    console.log("Deleting account...");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
            mb: 1,
          }}
        >
          Settings
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#6B7280",
            fontSize: "1.125rem",
          }}
        >
          Manage settings here.
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Personal Information Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1F2937",
            mb: 3,
          }}
        >
          Personal Information
        </Typography>

        <Card sx={{ 
          backgroundColor: "#FFFFFF", 
          borderRadius: 3, 
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
          width: "100%"
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Name Field */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Full Name
                </Typography>
                <TextField
                  value={personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
                  fullWidth
                  placeholder="Enter your name"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FFFFFF",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ADB4",
                      },
                      "& input": {
                        color: "#1F2937",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6B7280",
                      "&.Mui-focused": {
                        color: "#00ADB4",
                      },
                    },
                  }}
                />
              </Box>

              {/* Email Field */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Email
                </Typography>
                <TextField
                  value={personalInfo.email}
                  disabled
                  fullWidth
                  placeholder="Your email address"
                  helperText="Email cannot be changed"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F3F4F6",
                      "& fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "& input": {
                        color: "#6B7280",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6B7280",
                    },
                  }}
                />
              </Box>

              {/* Phone Field */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Phone Number
                </Typography>
                <TextField
                  value={personalInfo.phoneNumber}
                  onChange={(e) => handlePersonalInfoChange("phoneNumber", e.target.value)}
                  fullWidth
                  placeholder="Enter your phone number (e.g., +1234567890)"
                  helperText="Format: +1234567890 (country code + number, no spaces or dashes)"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FFFFFF",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ADB4",
                      },
                      "& input": {
                        color: "#1F2937",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6B7280",
                      "&.Mui-focused": {
                        color: "#00ADB4",
                      },
                    },
                  }}
                />
              </Box>

              {/* Date of Birth Field */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Date of Birth
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => handlePersonalInfoChange("dateOfBirth", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FFFFFF",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ADB4",
                      },
                      "& input": {
                        color: "#1F2937",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6B7280",
                      "&.Mui-focused": {
                        color: "#00ADB4",
                      },
                    },
                  }}
                />
              </Box>

              {/* Address Fields */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    fontWeight: 500,
                    mb: 2,
                  }}
                >
                  Address
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    value={personalInfo.address.street}
                    onChange={(e) => handlePersonalInfoChange("address.street", e.target.value)}
                    fullWidth
                    placeholder="Street Address"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FFFFFF",
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        },
                        "&:hover fieldset": {
                          borderColor: "#D1D5DB",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#00ADB4",
                        },
                        "& input": {
                          color: "#1F2937",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#6B7280",
                        "&.Mui-focused": {
                          color: "#00ADB4",
                        },
                      },
                    }}
                  />
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      value={personalInfo.address.city}
                      onChange={(e) => handlePersonalInfoChange("address.city", e.target.value)}
                      fullWidth
                      placeholder="City"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFFFFF",
                          "& fieldset": {
                            borderColor: "#E5E7EB",
                          },
                          "&:hover fieldset": {
                            borderColor: "#D1D5DB",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#00ADB4",
                          },
                          "& input": {
                            color: "#1F2937",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#6B7280",
                          "&.Mui-focused": {
                            color: "#00ADB4",
                          },
                        },
                      }}
                    />
                    <TextField
                      value={personalInfo.address.state}
                      onChange={(e) => handlePersonalInfoChange("address.state", e.target.value)}
                      fullWidth
                      placeholder="State"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFFFFF",
                          "& fieldset": {
                            borderColor: "#E5E7EB",
                          },
                          "&:hover fieldset": {
                            borderColor: "#D1D5DB",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#00ADB4",
                          },
                          "& input": {
                            color: "#1F2937",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#6B7280",
                          "&.Mui-focused": {
                            color: "#00ADB4",
                          },
                        },
                      }}
                    />
                    <TextField
                      value={personalInfo.address.zipCode}
                      onChange={(e) => handlePersonalInfoChange("address.zipCode", e.target.value)}
                      fullWidth
                      placeholder="ZIP Code"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFFFFF",
                          "& fieldset": {
                            borderColor: "#E5E7EB",
                          },
                          "&:hover fieldset": {
                            borderColor: "#D1D5DB",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#00ADB4",
                          },
                          "& input": {
                            color: "#1F2937",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#6B7280",
                          "&.Mui-focused": {
                            color: "#00ADB4",
                          },
                        },
                      }}
                    />
                  </Box>
                  <TextField
                    value={personalInfo.address.country}
                    onChange={(e) => handlePersonalInfoChange("address.country", e.target.value)}
                    fullWidth
                    placeholder="Country"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FFFFFF",
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        },
                        "&:hover fieldset": {
                          borderColor: "#D1D5DB",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#00ADB4",
                        },
                        "& input": {
                          color: "#1F2937",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#6B7280",
                        "&.Mui-focused": {
                          color: "#00ADB4",
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Update Profile Button */}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSavePersonalInfo}
                  disabled={saving}
                  sx={{
                    backgroundColor: "#00ADB4",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "#009DA4",
                    },
                    "&:disabled": {
                      backgroundColor: "#9CA3AF",
                    },
                  }}
                >
                  {saving ? (
                    <>
                      <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                      Saving...
                    </>
                  ) : (
                    "Save Personal Information"
                  )}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Notification Preferences Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1F2937",
            mb: 3,
          }}
        >
          Notification Preferences
        </Typography>

        <Card sx={{ 
          backgroundColor: "#FFFFFF", 
          borderRadius: 3, 
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
          width: "100%"
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* General Notifications */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationPreferences.notifications}
                    onChange={(e) => handleNotificationChange("notifications", e.target.checked)}
                    sx={{
                      color: "#00ADB4",
                      "&.Mui-checked": {
                        color: "#00ADB4",
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#374151",
                      fontWeight: 500,
                    }}
                  >
                    General Notifications
                  </Typography>
                }
              />

              {/* Email Updates */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationPreferences.emailUpdates}
                    onChange={(e) => handleNotificationChange("emailUpdates", e.target.checked)}
                    sx={{
                      color: "#00ADB4",
                      "&.Mui-checked": {
                        color: "#00ADB4",
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#374151",
                      fontWeight: 500,
                    }}
                  >
                    Email Updates
                  </Typography>
                }
              />

              {/* SMS Updates */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationPreferences.smsUpdates}
                    onChange={(e) => handleNotificationChange("smsUpdates", e.target.checked)}
                    sx={{
                      color: "#00ADB4",
                      "&.Mui-checked": {
                        color: "#00ADB4",
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#374151",
                      fontWeight: 500,
                    }}
                  >
                    SMS Updates
                  </Typography>
                }
              />

              {/* Order Updates */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationPreferences.orderUpdates}
                    onChange={(e) => handleNotificationChange("orderUpdates", e.target.checked)}
                    sx={{
                      color: "#00ADB4",
                      "&.Mui-checked": {
                        color: "#00ADB4",
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#374151",
                      fontWeight: 500,
                    }}
                  >
                    Order Updates
                  </Typography>
                }
              />

              {/* Promotional Emails */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationPreferences.promotionalEmails}
                    onChange={(e) => handleNotificationChange("promotionalEmails", e.target.checked)}
                    sx={{
                      color: "#00ADB4",
                      "&.Mui-checked": {
                        color: "#00ADB4",
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#374151",
                      fontWeight: 500,
                    }}
                  >
                    Promotional Emails
                  </Typography>
                }
              />

              {/* Save Preferences Button */}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveNotificationPreferences}
                  disabled={saving}
                  sx={{
                    backgroundColor: "#00ADB4",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "#009DA4",
                    },
                    "&:disabled": {
                      backgroundColor: "#9CA3AF",
                    },
                  }}
                >
                  {saving ? (
                    <>
                      <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                      Saving...
                    </>
                  ) : (
                    "Save Notification Preferences"
                  )}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Privacy & Security Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1F2937",
            mb: 3,
          }}
        >
          Privacy & Security
        </Typography>

        <Card sx={{ 
          backgroundColor: "#FFFFFF", 
          borderRadius: 3, 
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
          width: "100%"
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Reset Password */}
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between" 
              }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  Reset Password
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleResetPassword}
                  sx={{
                    borderColor: "#D1D5DB",
                    color: "#374151",
                    textTransform: "none",
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#9CA3AF",
                      backgroundColor: "#F9FAFB",
                    },
                  }}
                >
                  Change
                </Button>
              </Box>

              {/* Two-Factor Authentication */}
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between" 
              }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  Enable Two-Factor Authentication
                </Typography>
                <Switch
                  checked={privacySettings.twoFactorAuth}
                  onChange={handleTwoFactorAuth}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#00ADB4",
                      "&:hover": {
                        backgroundColor: "rgba(0, 173, 180, 0.08)",
                      },
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#00ADB4",
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: "#E5E7EB",
                    },
                    "& .MuiSwitch-thumb": {
                      backgroundColor: "#FFFFFF",
                    },
                  }}
                />
              </Box>

              {/* Delete Account */}
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between" 
              }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  Delete Account
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleDeleteAccount}
                  sx={{
                    borderColor: "#D1D5DB",
                    color: "#374151",
                    textTransform: "none",
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#9CA3AF",
                      backgroundColor: "#F9FAFB",
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

