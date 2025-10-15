import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import listingService from '../../services/listingService.js';
import { LISTING_STATUS } from '../../constants/listingConstants.js';
import ProviderAuthGuard from './ProviderAuthGuard.jsx';

const ListingManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    location: '',
    plan: ''
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Fetch listings on component mount
  useEffect(() => {
    fetchListings();
  }, [filters, currentPage]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await listingService.getMyListings({
        ...filters,
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE
      });
      const data = response.data || response;
      setListings(data.listings || []);
      setTotalCount(Number(data.total || (data.listings ? data.listings.length : 0)));
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const response = await listingService.searchListings(searchTerm, { ...filters, limit: PAGE_SIZE, offset: 0 });
        const data = response.data || response;
        setListings(data.listings || []);
        setTotalCount(Number(data.total || (data.listings ? data.listings.length : 0)));
        setCurrentPage(1);
      } catch (error) {
        console.error('Error searching listings:', error);
        setError('Search failed');
      } finally {
        setLoading(false);
      }
    } else {
      fetchListings();
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await listingService.deleteListing(listingId);
      setListings(prev => prev.filter(listing => listing.id !== listingId));
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError('Failed to delete listing');
    }
  };

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      await listingService.updateListingStatus(listingId, newStatus);
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: newStatus }
          : listing
      ));
      setToast({ open: true, message: `Listing set to ${getStatusLabel(newStatus)}`, severity: 'success' });
      handleMenuClose();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update listing status');
      setToast({ open: true, message: 'Failed to update listing status', severity: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case LISTING_STATUS.ACTIVE:
        return '#E3F2FD'; // Light blue
      case LISTING_STATUS.PENDING_REVIEW:
        return '#F5F5F5'; // Light gray
      case LISTING_STATUS.DRAFT:
        return '#FFF3CD'; // Light yellow
      case LISTING_STATUS.INACTIVE:
        return '#F8D7DA'; // Light red
      default:
        return '#F5F5F5';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case LISTING_STATUS.ACTIVE:
        return '#1976D2'; // Blue text
      case LISTING_STATUS.PENDING_REVIEW:
        return '#757575'; // Gray text
      case LISTING_STATUS.DRAFT:
        return '#856404'; // Yellow text
      case LISTING_STATUS.INACTIVE:
        return '#721C24'; // Red text
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case LISTING_STATUS.ACTIVE:
        return 'Active';
      case LISTING_STATUS.PENDING_REVIEW:
        return 'Pending Review';
      case LISTING_STATUS.DRAFT:
        return 'Draft';
      case LISTING_STATUS.INACTIVE:
        return 'Inactive';
      default:
        return status;
    }
  };

  // Normalize status from varying backend shapes; default to Active when in doubt
  const normalizeStatus = (listing) => {
    let s = listing?.status
      || listing?.listingStatus
      || listing?.approvalStatus
      || (listing?.isActive === true ? LISTING_STATUS.ACTIVE : (listing?.isActive === false ? LISTING_STATUS.INACTIVE : null))
      || (listing?.published === true ? LISTING_STATUS.ACTIVE : null);
    if (typeof s === 'string') s = s.toLowerCase();
    if (s === 'approved') s = LISTING_STATUS.ACTIVE;
    if (s === 'pending' || s === 'under_review') s = LISTING_STATUS.PENDING_REVIEW;
    if (!s) s = LISTING_STATUS.ACTIVE; // prefer Active over Draft as fallback
    return s;
  };

  return (
    <ProviderAuthGuard>
      <Box sx={{ p: 3, backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: '#1F2937',
            fontSize: '1.875rem',
          }}
        >
          Listing Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/provider-dashboard/add-listing')}
          sx={{
            backgroundColor: '#00ADB4',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#009DA4',
            },
          }}
        >
          Add Service
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#6B7280' }} />
              </InputAdornment>
            ),
          }}
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
            },
          }}
        />
      </Box>

      {/* Filter Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {['Service Category', 'Location', 'Status', 'Plan'].map((filter) => (
          <FormControl key={filter} size="small" sx={{ minWidth: 150 }}>
            <Select
              value=""
              displayEmpty
              IconComponent={KeyboardArrowDownIcon}
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
                  py: 1,
                  fontSize: '0.875rem',
                  color: '#6B7280',
                },
              }}
            >
              <MenuItem value="" disabled>
                {filter}
              </MenuItem>
            </Select>
          </FormControl>
        ))}
      </Box>

      {/* Services Table */}
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.875rem',
                  py: 2,
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                Service Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.875rem',
                  py: 2,
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                Price
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.875rem',
                  py: 2,
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.875rem',
                  py: 2,
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                Orders
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.875rem',
                  py: 2,
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress 
                      size={32} 
                      sx={{ 
                        color: '#00ADB4',
                        mb: 1
                      }} 
                    />
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#6B7280',
                        fontWeight: 500
                      }}
                    >
                      Loading your listings...
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#9CA3AF',
                        fontSize: '0.875rem'
                      }}
                    >
                      This will just take a moment
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: '#FEF2F2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '2rem',
                          color: '#EF4444',
                        }}
                      >
                        ⚠️
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#1F2937',
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      Oops! Something went wrong
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6B7280',
                        maxWidth: 400,
                        textAlign: 'center',
                        mb: 2
                      }}
                    >
                      We couldn't load your listings right now. This might be a temporary issue.
                    </Typography>
                    <Button 
                      variant="contained"
                      onClick={fetchListings}
                      sx={{
                        backgroundColor: '#00ADB4',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: '#009DA4',
                        },
                      }}
                    >
                      Try Again
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: '#F0FDFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '2rem',
                          color: '#00ADB4',
                        }}
                      >
                        📝
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#1F2937',
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      You don't have any listings
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6B7280',
                        maxWidth: 400,
                        textAlign: 'center',
                        mb: 2
                      }}
                    >
                      Add a listing to see it here
                    </Typography>
                    <Button 
                      variant="contained"
                      onClick={() => navigate('/provider-dashboard/add-listing')}
                      sx={{
                        backgroundColor: '#00ADB4',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: '#009DA4',
                        },
                      }}
                    >
                      Create Your First Listing
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              listings.map((listing) => (
                <TableRow
                  key={listing.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      color: '#1F2937',
                      fontSize: '0.875rem',
                      py: 2,
                      borderBottom: '1px solid #F3F4F6',
                    }}
                  >
                    {listing.title}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#1F2937',
                      fontSize: '0.875rem',
                      py: 2,
                      borderBottom: '1px solid #F3F4F6',
                      fontWeight: 600,
                    }}
                  >
                    ${listing.pricing?.amount || 0}
                  </TableCell>
                  <TableCell
                    sx={{
                      py: 2,
                      borderBottom: '1px solid #F3F4F6',
                    }}
                  >
                    <Chip
                      label={getStatusLabel(normalizeStatus(listing))}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(normalizeStatus(listing)),
                        color: getStatusTextColor(normalizeStatus(listing)),
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        height: 24,
                        borderRadius: 1.5,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#1F2937',
                      fontSize: '0.875rem',
                      py: 2,
                      borderBottom: '1px solid #F3F4F6',
                    }}
                  >
                    {listing.statistics?.bookings || 0}
                  </TableCell>
                  <TableCell
                    sx={{
                      py: 2,
                      borderBottom: '1px solid #F3F4F6',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, listing.id)}
                      sx={{
                        color: '#6B7280',
                        '&:hover': {
                          backgroundColor: '#F3F4F6',
                        },
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Stack spacing={2}>
          <Pagination
            count={Math.max(1, Math.ceil(totalCount / PAGE_SIZE))}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#6B7280',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&.Mui-selected': {
                  backgroundColor: '#00ADB4',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#009DA4',
                  },
                },
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
              },
            }}
          />
        </Stack>
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB',
            minWidth: 150,
            bgcolor: '#FFFFFF',
            color: '#111827',
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem', py: 1, color: '#111827', '&:hover': { bgcolor: '#F3F4F6' } }}>
          Edit Listing
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem', py: 1, color: '#111827', '&:hover': { bgcolor: '#F3F4F6' } }}>
          View Details
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusChange(selectedRow, LISTING_STATUS.ACTIVE)} 
          sx={{ fontSize: '0.875rem', py: 1, color: '#111827', '&:hover': { bgcolor: '#F0FDFF' } }}
        >
          Activate
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusChange(selectedRow, LISTING_STATUS.INACTIVE)} 
          sx={{ fontSize: '0.875rem', py: 1, color: '#111827', '&:hover': { bgcolor: '#FDF2F8' } }}
        >
          Deactivate
        </MenuItem>
        <MenuItem 
          onClick={() => handleDeleteListing(selectedRow)} 
          sx={{ fontSize: '0.875rem', py: 1, color: '#EF4444', '&:hover': { bgcolor: '#FEF2F2' } }}
        >
          Delete
        </MenuItem>
      </Menu>
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast(t => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast(t => ({ ...t, open: false }))}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      </Box>
    </ProviderAuthGuard>
  );
};

export default ListingManagement;
