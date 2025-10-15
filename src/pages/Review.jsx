"use client"
import { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Card,
  Avatar,
  Rating,
  Pagination,
  Button,
  Drawer,
  IconButton,
  Collapse,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material"
import { Search, ExpandLess, ExpandMore, FilterList, Close, Star, AccessTime } from "@mui/icons-material"
import { feedbackAPI } from "../services/apiService"
import { useUser } from "../contexts/UserContext"

const ReviewsPage = () => {
  const { user } = useUser()
  const [selectedFilters, setSelectedFilters] = useState(["All"])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [filtersExpanded, setFiltersExpanded] = useState(true)
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [totalPages, setTotalPages] = useState(1)

  const serviceFilters = [
    { name: "All", checked: true },
    { name: "Plumbing", checked: false },
    { name: "Electrician", checked: false },
    { name: "Roofing", checked: false },
    { name: "Gardener", checked: false },
    { name: "Home Care", checked: false },
    { name: "Cleaning", checked: false },
  ]

  // Fetch user's feedback
  useEffect(() => {
    console.log('Review useEffect triggered, user:', user)
    console.log('User UID:', user?.uid)
    
    const fetchFeedbacks = async () => {
      if (!user?.uid) {
        console.log('No user UID, skipping feedback fetch')
        return
      }
      
      console.log('Starting to fetch feedbacks...')
      try {
        setLoading(true)
        setError("")
        
        const response = await feedbackAPI.getClientFeedbacks(currentPage, 10)
        console.log('Feedback API response:', response)
        
        if (response.success) {
          setFeedbacks(response.data || [])
          setTotalPages(response.pagination?.totalPages || 1)
          console.log('Feedbacks set:', response.data)
        } else {
          setError(response.message || "Failed to fetch feedback")
        }
      } catch (err) {
        console.error("Error fetching feedback:", err)
        setError("Failed to fetch your reviews")
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [user?.uid, currentPage])


  const handleFilterChange = (filterName) => {
    setSelectedFilters((prev) =>
      prev.includes(filterName) ? prev.filter((f) => f !== filterName) : [...prev, filterName],
    )
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  const toggleMobileFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen)
  }

  const FilterContent = () => (
    <Card
      sx={{
        p: 3,
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        height: "fit-content",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          cursor: "pointer",
        }}
        onClick={() => setFiltersExpanded(!filtersExpanded)}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
          Service Filter
        </Typography>
        {filtersExpanded ? <ExpandLess sx={{ color: "#666" }} /> : <ExpandMore sx={{ color: "#666" }} />}
      </Box>
      <Collapse in={filtersExpanded}>
        <FormGroup>
          {serviceFilters.map((filter) => (
            <FormControlLabel
              key={filter.name}
              control={
                <Checkbox
                  checked={filter.checked}
                  onChange={() => handleFilterChange(filter.name)}
                  sx={{
                    color: "#e0e0e0",
                    "&.Mui-checked": {
                      color: "#4db6ac",
                    },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: "0.9rem", color: "#666" }}>{filter.name}</Typography>}
              sx={{ mb: 1 }}
            />
          ))}
        </FormGroup>
      </Collapse>
    </Card>
  )

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: { xs: 2, md: 3 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "#F4F4F4",
            py: { xs: 2, md: 2 },
            px: { xs: 2, md: 3 },
            mb: { xs: 3, md: 4 },
            borderRadius: "8px",
            mx: { xs: -2, sm: -3, md: -4 },
            width: "calc(100% + 32px)",
            "@media (min-width: 600px)": {
              width: "calc(100% + 48px)",
            },
            "@media (min-width: 900px)": {
              width: "calc(100% + 64px)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: { xs: 2, md: 0 },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  mb: 0.5,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.3,
                }}
              >
                My Reviews ({feedbacks.length})
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: "0.9rem",
                }}
              >
                View and manage all your submitted reviews
              </Typography>
            </Box>
            <TextField
              placeholder="Search your reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: { xs: "100%", md: "350px" },
                maxWidth: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  backgroundColor: "white",
                  fontSize: "0.9rem",
                  height: "44px",
                  "& fieldset": {
                    borderColor: "#d0d0d0",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#bbb",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4db6ac",
                    borderWidth: "1px",
                  },
                  "& input": {
                    padding: "12px 14px",
                    "&::placeholder": {
                      color: "#999",
                      opacity: 1,
                    },
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search sx={{ color: "#999", fontSize: "1.2rem" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Mobile Filter Button */}
        <Box sx={{ display: { xs: "block", lg: "none" }, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={toggleMobileFilter}
            sx={{
              borderColor: "#4db6ac",
              color: "#4db6ac",
              "&:hover": {
                borderColor: "#4db6ac",
                backgroundColor: "rgba(77, 182, 172, 0.04)",
              },
            }}
          >
            Filters
          </Button>
        </Box>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={mobileFilterOpen}
          onClose={toggleMobileFilter}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              width: 280,
              p: 2,
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
            <IconButton onClick={toggleMobileFilter}>
              <Close />
            </IconButton>
          </Box>
          <FilterContent />
        </Drawer>

        <Box sx={{ display: "flex", gap: { xs: 0, lg: 4 }, flexDirection: { xs: "column", lg: "row" } }}>
          {/* Desktop Sidebar - Service Filter */}
          <Box sx={{ width: { lg: 280 }, flexShrink: 0, display: { xs: "none", lg: "block" } }}>
            <FilterContent />
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>

            {/* Promotional Banner */}
            <Card
              sx={{
                backgroundColor: "#4db6ac",
                color: "white",
                p: { xs: 2.5, md: 3 },
                mb: 4,
                borderRadius: "12px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  lineHeight: 1.3,
                }}
              >
                See what others are saying before you buy – real reviews from happy customers!
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: "0.875rem", md: "0.9rem" },
                  lineHeight: 1.4,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </Typography>
            </Card>

            {/* Debug Info */}
            <Box sx={{ mb: 2, p: 2, backgroundColor: "#f0f0f0", borderRadius: 1 }}>
              <Typography variant="body2">
                Debug: User UID: {user?.uid || "No user"}, Loading: {loading.toString()}, 
                Feedbacks: {feedbacks.length}, Error: {error || "None"}
              </Typography>
            </Box>

            {/* User's Reviews Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                }}
              >
                Your Submitted Reviews
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              ) : feedbacks.length === 0 ? (
                <Card
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: "12px",
                    border: "1px solid #e0e0e0",
                    backgroundColor: "white",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: "#666" }}>
                    No reviews yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#999" }}>
                    You haven't submitted any reviews yet. Complete a service to leave a review!
                  </Typography>
                </Card>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                    },
                    gap: { xs: 2, sm: 2.5, md: 3 },
                  }}
                >
                  {feedbacks.map((feedback) => (
                    <Card
                      key={feedback.id}
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: "12px",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        backgroundColor: "white",
                        "&:hover": {
                          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      {/* Service Info */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: "1rem",
                            color: "#333",
                            mb: 0.5,
                          }}
                        >
                          {feedback.serviceName || "Service"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            fontSize: "0.85rem",
                          }}
                        >
                          Provider: {feedback.providerName || "Provider"}
                        </Typography>
                      </Box>

                      {/* Rating */}
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Rating
                          value={feedback.rating}
                          readOnly
                          sx={{
                            "& .MuiRating-iconFilled": {
                              color: "#ffc107",
                            },
                            "& .MuiSvgIcon-root": {
                              fontSize: "1.1rem",
                            },
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            ml: 1,
                            color: "#666",
                            fontWeight: 500,
                          }}
                        >
                          {feedback.rating}/5
                        </Typography>
                      </Box>

                      {/* Comment */}
                      {feedback.comment && (
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            lineHeight: 1.6,
                            color: "#666",
                            fontSize: "0.9rem",
                            fontStyle: "italic",
                            backgroundColor: "#f8f9fa",
                            p: 2,
                            borderRadius: "8px",
                          }}
                        >
                          "{feedback.comment}"
                        </Typography>
                      )}

                      {/* Date */}
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AccessTime sx={{ fontSize: "0.9rem", color: "#999", mr: 0.5 }} />
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#999",
                              fontSize: "0.75rem",
                            }}
                          >
                            {feedback.createdAt ? new Date(feedback.createdAt.toDate ? feedback.createdAt.toDate() : feedback.createdAt).toLocaleDateString() : "Unknown date"}
                          </Typography>
                        </Box>
                        <Chip
                          label="Submitted"
                          size="small"
                          sx={{
                            backgroundColor: "#e8f5e8",
                            color: "#2e7d32",
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4, pb: { xs: 2, md: 0 } }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                size={window.innerWidth < 600 ? "small" : "medium"}
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "6px",
                    fontSize: { xs: "0.8rem", md: "0.9rem" },
                    fontWeight: 500,
                    minWidth: { xs: "32px", md: "40px" },
                    height: { xs: "32px", md: "40px" },
                    margin: { xs: "0 2px", md: "0 4px" },
                    color: "#333",
                    backgroundColor: "transparent",
                    border: "none",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#333 !important",
                    color: "white !important",
                    "&:hover": {
                      backgroundColor: "#555 !important",
                    },
                  },
                  "& .MuiPaginationItem-previousNext": {
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    color: "#333",
                  },
                }}
              />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default ReviewsPage
