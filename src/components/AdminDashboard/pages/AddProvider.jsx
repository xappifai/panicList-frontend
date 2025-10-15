// src/components/AdminDashboard/pages/AddProvider.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  IconButton,
  Chip,
  Grid,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

const AddProvider = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    paymentMethod: "",
    package: "",
  });
  
  const [selectedServices, setSelectedServices] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const services = [
    "Plumbing",
    "Electric",
    "Septic pumping",
    "Grease trap",
    "Porta Potty",
    "Dumpster roll off"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => 
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files);
    }
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Selected Services:", selectedServices);
    console.log("Is Featured:", isFeatured);
    console.log("Uploaded Images:", uploadedImages);
    // Handle form submission here
  };

  const handleCancel = () => {
    navigate("/admin-dashboard/providers");
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{
            borderColor: "#D1D5DB",
            color: "#6B7280",
            textTransform: "none",
            "&:hover": {
              borderColor: "#9CA3AF",
              backgroundColor: "#F9FAFB"
            }
          }}
        >
          Back to Providers
        </Button>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
            fontSize: "1.875rem",
          }}
        >
          Add Provider
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Upload Images Section */}
        <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1F2937",
                fontSize: "1.125rem",
                mb: 3
              }}
            >
              Upload Images
            </Typography>
            
            {/* Drag & Drop Zone */}
            <Box
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: `2px dashed ${dragActive ? "#00ADB4" : "#D1D5DB"}`,
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                backgroundColor: dragActive ? "#F0FDFF" : "#F9FAFB",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#00ADB4",
                  backgroundColor: "#F0FDFF"
                }
              }}
            >
              <CloudUploadIcon 
                sx={{ 
                  fontSize: 48, 
                  color: dragActive ? "#00ADB4" : "#9CA3AF",
                  mb: 2 
                }} 
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1F2937",
                  fontSize: "1.125rem",
                  mb: 1
                }}
              >
                Drag and drop images here
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  fontSize: "0.875rem"
                }}
              >
                or click to browse
              </Typography>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </Box>

            {/* Image Previews */}
            {uploadedImages.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#374151",
                    mb: 2
                  }}
                >
                  Uploaded Images ({uploadedImages.length})
                </Typography>
                <Grid container spacing={2}>
                  {uploadedImages.map((image) => (
                    <Grid item key={image.id}>
                      <Box sx={{ position: "relative" }}>
                        <Box
                          component="img"
                          src={image.preview}
                          alt="Preview"
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: 2,
                            objectFit: "cover",
                            border: "2px solid #E5E7EB"
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(image.id)}
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            backgroundColor: "#EF4444",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#DC2626"
                            },
                            width: 24,
                            height: 24
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1F2937",
                fontSize: "1.125rem",
                mb: 3
              }}
            >
              Provider Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  placeholder="Sophia Clark"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F9FAFB",
                      "&:hover": {
                        backgroundColor: "#F3F4F6",
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="sophia.clark@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F9FAFB",
                      "&:hover": {
                        backgroundColor: "#F3F4F6",
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact"
                  placeholder="+1 (555) 123-4567"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F9FAFB",
                      "&:hover": {
                        backgroundColor: "#F3F4F6",
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="HUADICHA"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F9FAFB",
                      "&:hover": {
                        backgroundColor: "#F3F4F6",
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Payment Method"
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F9FAFB",
                      "&:hover": {
                        backgroundColor: "#F3F4F6",
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Package"
                  value={formData.package}
                  onChange={(e) => handleInputChange("package", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F9FAFB",
                      "&:hover": {
                        backgroundColor: "#F3F4F6",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1F2937",
                fontSize: "1.125rem",
                mb: 3
              }}
            >
              Services
            </Typography>
            
            <Grid container spacing={2}>
              {services.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedServices.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        sx={{
                          color: "#D1D5DB",
                          "&.Mui-checked": {
                            color: "#00ADB4",
                          },
                        }}
                      />
                    }
                    label={service}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                        color: "#374151",
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Featured Section */}
        <Card sx={{ mb: 4, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                    fontSize: "1.125rem",
                    mb: 1
                  }}
                >
                  Featured
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                    fontSize: "0.875rem"
                  }}
                >
                  Enable to feature this provider on the homepage
                </Typography>
              </Box>
              <Switch
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
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
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              borderColor: "#D1D5DB",
              color: "#374151",
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              "&:hover": {
                borderColor: "#9CA3AF",
                backgroundColor: "#F9FAFB"
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#00ADB4",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              "&:hover": {
                backgroundColor: "#009DA4",
              },
            }}
          >
            Save & Publish
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddProvider;
