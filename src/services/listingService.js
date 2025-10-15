// Frontend listing service for API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4050/api';

class ListingService {
  // Get auth token from localStorage
  getAuthToken() {
    // First try to get the Firebase token (primary method)
    const firebaseToken = localStorage.getItem('firebaseToken');
    if (firebaseToken) {
      return firebaseToken;
    }
    
    // Fallback to user.token if firebaseToken is not available
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || null;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getAuthToken();
    if (!token) {
      console.error('No authentication token found. Please sign in again.');
      throw new Error('No token provided or invalid format');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get form data headers for file uploads
  getFormDataHeaders() {
    const token = this.getAuthToken();
    if (!token) {
      console.error('No authentication token found. Please sign in again.');
      throw new Error('No token provided or invalid format');
    }
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  // Make API request
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all listings with optional filters
  async getListings(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `/listings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest(url);
  }

  // Search listings
  async searchListings(searchTerm, filters = {}) {
    const queryParams = new URLSearchParams();
    queryParams.append('q', searchTerm);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `/listings/search?${queryParams.toString()}`;
    return this.makeRequest(url);
  }

  // Get listing by ID
  async getListingById(id) {
    return this.makeRequest(`/listings/${id}`);
  }

  // Get listings by provider
  async getListingsByProvider(providerId, filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `/listings/provider/${providerId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest(url);
  }

  // Create new listing
  async createListing(listingData) {
    return this.makeRequest('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData)
    });
  }

  // Update listing
  async updateListing(id, updateData) {
    return this.makeRequest(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  // Update listing status
  async updateListingStatus(id, status) {
    return this.makeRequest(`/listings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // Delete listing
  async deleteListing(id) {
    return this.makeRequest(`/listings/${id}`, {
      method: 'DELETE'
    });
  }

  // Upload images for a listing
  async uploadListingImages(listingId, files) {
    const formData = new FormData();
    
    // Add files to FormData
    Array.from(files).forEach((file, index) => {
      formData.append('images', file);
    });

    const token = this.getAuthToken();
    
    try {
      const response = await fetch(`${API_BASE_URL}/listings/${listingId}/images`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  }

  // Delete image from listing
  async deleteListingImage(listingId, imageId) {
    return this.makeRequest(`/listings/${listingId}/images/${imageId}`, {
      method: 'DELETE'
    });
  }

  // Get current provider's listings
  async getMyListings(filters = {}) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.uid) {
      // Clear invalid user data
      localStorage.removeItem('user');
      throw new Error('Please sign in to view your listings');
    }
    
    return this.getListingsByProvider(user.uid, filters);
  }

  // Create listing with images
  async createListingWithImages(listingData, imageFiles = []) {
    try {
      // Check authentication first
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.uid) {
        localStorage.removeItem('user');
        throw new Error('Please sign in to create listings');
      }

      // First create the listing without images
      const listingResponse = await this.createListing({
        ...listingData,
        images: [] // Start with empty images array
      });

      const listing = listingResponse.data;

      // If there are images, upload them
      if (imageFiles && imageFiles.length > 0) {
        const imageResponse = await this.uploadListingImages(listing.id, imageFiles);
        return {
          ...listingResponse,
          data: imageResponse.data.listing
        };
      }

      return listingResponse;
    } catch (error) {
      console.error('Error creating listing with images:', error);
      throw error;
    }
  }
}

export default new ListingService();
