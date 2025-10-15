import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  CloudUpload as CloudUploadIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import listingService from '../../services/listingService.js';
import { SERVICE_CATEGORIES, PRICING_TYPES, CATEGORY_LABELS, PRICING_TYPE_LABELS } from '../../constants/listingConstants.js';
import ProviderAuthGuard from './ProviderAuthGuard.jsx';

const AddNewListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    pricing: {
      type: PRICING_TYPES.FIXED,
      amount: '',
      currency: 'USD',
      description: ''
    },
    availability: {
      schedule: '',
      responseTime: ''
    },
    location: {
      coverage: '',
      serviceRadius: 50
    },
    contactInfo: {
      email: '',
      phone: '',
      preferredContact: 'both'
    },
    tags: []
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleNestedInputChange = (parentField, childField) => (event) => {
    setFormData({
      ...formData,
      [parentField]: {
        ...formData[parentField],
        [childField]: event.target.value,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!formData.title || !formData.category || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.pricing.amount) {
        throw new Error('Please enter a price amount');
      }

      if (!formData.location.coverage) {
        throw new Error('Please specify location coverage');
      }

      // Validate that at least one image is selected
      if (selectedFiles.length === 0) {
        throw new Error('Please select at least one image for your listing.');
      }

      // Create listing data
      const listingData = {
        ...formData,
        pricing: {
          ...formData.pricing,
          amount: parseFloat(formData.pricing.amount)
        },
        location: {
          ...formData.location,
          serviceRadius: parseInt(formData.location.serviceRadius)
        }
      };

      // Create listing with images
      const response = await listingService.createListingWithImages(listingData, selectedFiles);
      
      setSuccess('Listing created successfully!');
      
      // Navigate back to listing management after a short delay
      setTimeout(() => {
        navigate('/provider-dashboard/listing-management');
      }, 2000);

    } catch (error) {
      console.error('Error creating listing:', error);
      
      // Handle specific authentication errors
      if (error.message && error.message.includes('No token provided')) {
        setError('Your session has expired. Please sign in again to create listings.');
      } else {
        setError(error.message || 'Failed to create listing. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setError(null);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        URL.revokeObjectURL(URL.createObjectURL(file));
      });
    };
  }, [selectedFiles]);

  return (
    <ProviderAuthGuard>
      <Box sx={{ p: 3, backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/provider-dashboard')}
          sx={{
            color: '#6B7280',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Dashboard
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/provider-dashboard/listing-management')}
          sx={{
            color: '#6B7280',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Listing Management
        </Link>
        <Typography variant="body2" color="text.primary">
          Add New Listing
        </Typography>
      </Breadcrumbs>

      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: '#1F2937',
            fontSize: '1.875rem',
            mb: 1,
          }}
        >
          Manage Listings
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: '#6B7280',
            fontSize: '1.125rem',
          }}
        >
          Add New Listing
        </Typography>
      </Box>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: 800 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3, maxWidth: 800 }}>
          {success}
        </Alert>
      )}

      {/* Form Container */}
      <Paper
        sx={{
          p: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB',
          maxWidth: 800,
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          {/* Title of Service */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: '#374151',
                mb: 1,
                fontSize: '0.875rem',
              }}
            >
              Title of Service
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g., Custom Portrait Painting"
              value={formData.title}
              onChange={handleInputChange('title')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ADB4',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.5,
                  fontSize: '0.875rem',
                  color: '#1F2937',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#9CA3AF',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Category */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: '#374151',
                mb: 1,
                fontSize: '0.875rem',
              }}
            >
              Category
            </Typography>
            <FormControl fullWidth>
              <Select
                value={formData.category}
                onChange={handleInputChange('category')}
                displayEmpty
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ADB4',
                  },
                  '& .MuiSelect-select': {
                    py: 1.5,
                    fontSize: '0.875rem',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select a category
                </MenuItem>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: '#374151',
                mb: 1,
                fontSize: '0.875rem',
              }}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange('description')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ADB4',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.5,
                  fontSize: '0.875rem',
                  color: '#1F2937',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#9CA3AF',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Upload Photo Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: '#374151',
                mb: 1,
                fontSize: '0.875rem',
              }}
            >
              Upload Photo
            </Typography>
            <Box
              sx={{
                border: '2px dashed #D1D5DB',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                backgroundColor: '#F9FAFB',
                '&:hover': {
                  borderColor: '#00ADB4',
                  backgroundColor: '#F0FDFF',
                },
              }}
            >
              <CloudUploadIcon
                sx={{
                  fontSize: 48,
                  color: '#9CA3AF',
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  mb: 1,
                  fontSize: '1rem',
                }}
              >
                Upload Photos <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6B7280',
                  mb: 2,
                  fontSize: '0.875rem',
                }}
              >
                Drag and drop or browse to upload photos of your service. At least one image is required.
              </Typography>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  '&:hover': {
                    borderColor: '#00ADB4',
                    backgroundColor: '#F0FDFF',
                  },
                }}
              >
                Browse
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
          </Box>

          {/* Pricing Type */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: '#374151',
                mb: 1,
                fontSize: '0.875rem',
              }}
            >
              Pricing Type
            </Typography>
            <FormControl fullWidth>
              <Select
                value={formData.pricing.type}
                onChange={handleNestedInputChange('pricing', 'type')}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ADB4',
                  },
                  '& .MuiSelect-select': {
                    py: 1.5,
                    fontSize: '0.875rem',
                  },
                }}
              >
                {Object.entries(PRICING_TYPE_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Price Amount */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: '#374151',
                mb: 1,
                fontSize: '0.875rem',
              }}
            >
              Price Amount ($)
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="Enter price"
              value={formData.pricing.amount}
              onChange={handleNestedInputChange('pricing', 'amount')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ADB4',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.5,
                  fontSize: '0.875rem',
                  color: '#1F2937',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#9CA3AF',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Service Availability */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: '#374151',
                mb: 1,
                fontSize: '0.875rem',
              }}
            >
              Service Availability
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g., Available on weekends"
              value={formData.availability.schedule}
              onChange={handleNestedInputChange('availability', 'schedule')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ADB4',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.5,
                  fontSize: '0.875rem',
                  color: '#1F2937',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#9CA3AF',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Location Coverage */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: '#374151',
                mb: 1,
                fontSize: '0.875rem',
              }}
            >
              Location Coverage
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g., Local area, nationwide"
              value={formData.location.coverage}
              onChange={handleNestedInputChange('location', 'coverage')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ADB4',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.5,
                  fontSize: '0.875rem',
                  color: '#1F2937',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#9CA3AF',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Contact Info */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: '#374151',
                mb: 1,
                fontSize: '0.875rem',
              }}
            >
              Contact Info
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g., Email, phone number"
              value={formData.contactInfo.email}
              onChange={handleNestedInputChange('contactInfo', 'email')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ADB4',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.5,
                  fontSize: '0.875rem',
                  color: '#1F2937',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#9CA3AF',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: '#374151',
                  mb: 1,
                  fontSize: '0.875rem',
                }}
              >
                Selected Images ({selectedFiles.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {selectedFiles.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      border: '1px solid #E5E7EB',
                      borderRadius: 2,
                      overflow: 'hidden',
                      backgroundColor: '#F9FAFB',
                      width: 120,
                      height: 120,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Button
                      size="small"
                      onClick={() => removeFile(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        minWidth: 'auto',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#DC2626',
                        },
                      }}
                    >
                      ×
                    </Button>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        p: 0.5,
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: '0.7rem',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {file.name}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                backgroundColor: '#00ADB4',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: '#009DA4',
                },
                '&:disabled': {
                  backgroundColor: '#9CA3AF',
                },
              }}
            >
              {isSubmitting ? 'Creating Listing...' : 'Submit Listing'}
            </Button>
          </Box>
        </Box>
      </Paper>
      </Box>
    </ProviderAuthGuard>
  );
};

export default AddNewListing;
