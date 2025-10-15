// src/components/ReviewModal.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Rating,
  Alert,
  CircularProgress,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { feedbackAPI } from '../services/apiService';

const ReviewModal = ({ open, onClose, orderData, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Debug order data
  React.useEffect(() => {
    if (orderData) {
      console.log('ReviewModal - Order data:', orderData);
      console.log('ReviewModal - Service title:', orderData.serviceDetails?.title);
      console.log('ReviewModal - Provider name:', orderData.providerName);
      console.log('ReviewModal - Provider ID:', orderData.providerId);
    }
  }, [orderData]);

  const handleClose = () => {
    if (!loading) {
      setRating(0);
      setComment('');
      setError('');
      setSuccess('');
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!orderData?.id) {
      setError('Order information is missing');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const feedbackData = {
        orderId: orderData.id,
        rating: rating,
        comment: comment.trim()
      };

      const response = await feedbackAPI.createFeedback(feedbackData);

      if (response.success) {
        setSuccess('Review submitted successfully!');
        setTimeout(() => {
          handleClose();
          if (onReviewSubmitted) {
            onReviewSubmitted(response.data);
          }
        }, 1500);
      } else {
        setError(response.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    if (error) setError('');
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    if (error) setError('');
  };

  const getRatingLabel = (value) => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return labels[value] || '';
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        background: 'linear-gradient(135deg, #00ADB5 0%, #009DA5 100%)',
        color: 'white',
        fontSize: '1.25rem',
        fontWeight: 600
      }}>
        Rate Your Experience
        <IconButton 
          onClick={handleClose} 
          disabled={loading}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {orderData && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#6B7280' }}>
              Service: {orderData.serviceDetails?.title || orderData.serviceName || orderData.title || 'Service'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#6B7280' }}>
              Provider: {orderData.providerName || orderData.providerDetails?.fullName || `Provider ${orderData.providerId?.slice(-8)}` || 'Provider'}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#1F2937' }}>
            How would you rate this service? *
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Rating
              value={rating}
              onChange={handleRatingChange}
              size="large"
              icon={<StarIcon sx={{ color: '#FFD700' }} />}
              emptyIcon={<StarBorderIcon sx={{ color: '#E0E0E0' }} />}
              disabled={loading}
            />
            {rating > 0 && (
              <Typography variant="body1" color="primary" sx={{ fontWeight: 600 }}>
                {getRatingLabel(rating)}
              </Typography>
            )}
          </Box>
          
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            Click on a star to rate from 1 (Poor) to 5 (Excellent)
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#1F2937' }}>
            Share your experience (Optional)
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={handleCommentChange}
            placeholder="Tell others about your experience with this service..."
            variant="outlined"
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#00ADB5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00ADB5',
                },
              },
              '& .MuiInputBase-input': {
                color: '#1F2937',
                '&::placeholder': {
                  color: '#6B7280',
                  opacity: 1,
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#D1D5DB',
              },
            }}
            inputProps={{
              maxLength: 1000
            }}
          />
          <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#6B7280' }}>
            {comment.length}/1000 characters
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ 
            color: 'text.secondary',
            mr: 1
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || rating === 0}
          variant="contained"
          sx={{
            backgroundColor: '#00ADB5',
            color: 'white',
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#009DA5',
            },
            '&:disabled': {
              backgroundColor: '#E0E0E0',
              color: '#9E9E9E',
            },
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;
