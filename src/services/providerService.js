// Provider service for fetching providers and their listings
import { userAPI, listingAPI, authAPI } from './apiService';

class ProviderService {
  // Get all providers with their active listings
  async getProvidersWithListings(filters = {}) {
    try {
      // Prefer public providers endpoint (no auth) to avoid admin-only routes
      const providersResponse = await authAPI.getPublicProviders(filters.service || null, filters.page || 1, filters.limit || 20);
      
      if (!providersResponse.success) {
        throw new Error('Failed to fetch providers');
      }

      const providers = providersResponse.data || [];
      
      // Get listings for each provider
      const providersWithListings = await Promise.all(
        providers.map(async (provider) => {
          try {
            // Get active listings for this provider
            const listingsResponse = await listingAPI.getListingsByProvider(provider.uid, {
              status: 'active',
              limit: 5 // Limit to 5 most recent listings per provider
            });
            
            return {
              ...provider,
              listings: listingsResponse.success ? listingsResponse.data.listings : [],
              totalListings: listingsResponse.success ? listingsResponse.data.total : 0
            };
          } catch (error) {
            console.error(`Error fetching listings for provider ${provider.uid}:`, error);
            return {
              ...provider,
              listings: [],
              totalListings: 0
            };
          }
        })
      );

      return {
        success: true,
        data: providersWithListings,
        pagination: providersResponse.pagination
      };
    } catch (error) {
      console.error('Error fetching providers with listings:', error);
      throw error;
    }
  }

  // Get providers by service category
  async getProvidersByService(service, filters = {}) {
    try {
      const providersResponse = await userAPI.getProvidersByService(service, filters.page || 1, filters.limit || 20);
      
      if (!providersResponse.success) {
        throw new Error('Failed to fetch providers by service');
      }

      const providers = providersResponse.data || [];
      
      // Get listings for each provider that match the service
      const providersWithListings = await Promise.all(
        providers.map(async (provider) => {
          try {
            const listingsResponse = await listingAPI.getListingsByProvider(provider.uid, {
              status: 'active',
              category: service,
              limit: 5
            });
            
            return {
              ...provider,
              listings: listingsResponse.success ? listingsResponse.data.listings : [],
              totalListings: listingsResponse.success ? listingsResponse.data.total : 0
            };
          } catch (error) {
            console.error(`Error fetching listings for provider ${provider.uid}:`, error);
            return {
              ...provider,
              listings: [],
              totalListings: 0
            };
          }
        })
      );

      return {
        success: true,
        data: providersWithListings,
        pagination: providersResponse.pagination
      };
    } catch (error) {
      console.error('Error fetching providers by service:', error);
      throw error;
    }
  }

  // Search providers and their listings
  async searchProvidersWithListings(searchTerm, filters = {}) {
    try {
      // Search providers
      const providersResponse = await userAPI.searchUsers(searchTerm, 'provider');
      
      if (!providersResponse.success) {
        throw new Error('Failed to search providers');
      }

      const providers = providersResponse.data || [];
      
      // Get listings for each provider
      const providersWithListings = await Promise.all(
        providers.map(async (provider) => {
          try {
            const listingsResponse = await listingAPI.getListingsByProvider(provider.uid, {
              status: 'active',
              limit: 3
            });
            
            return {
              ...provider,
              listings: listingsResponse.success ? listingsResponse.data.listings : [],
              totalListings: listingsResponse.success ? listingsResponse.data.total : 0
            };
          } catch (error) {
            console.error(`Error fetching listings for provider ${provider.uid}:`, error);
            return {
              ...provider,
              listings: [],
              totalListings: 0
            };
          }
        })
      );

      return {
        success: true,
        data: providersWithListings,
        searchTerm
      };
    } catch (error) {
      console.error('Error searching providers with listings:', error);
      throw error;
    }
  }

  // Get featured providers (providers with featured listings)
  async getFeaturedProviders(filters = {}) {
    try {
      // Get featured listings first
      const featuredListingsResponse = await listingAPI.getListings({
        status: 'active',
        featured: true,
        limit: 20
      });
      
      if (!featuredListingsResponse.success) {
        throw new Error('Failed to fetch featured listings');
      }

      const featuredListings = featuredListingsResponse.data.listings || [];
      
      // Group listings by provider
      const providerMap = new Map();
      
      featuredListings.forEach(listing => {
        if (!providerMap.has(listing.providerId)) {
          providerMap.set(listing.providerId, {
            providerId: listing.providerId,
            listings: []
          });
        }
        providerMap.get(listing.providerId).listings.push(listing);
      });

      // Get provider details for each provider with featured listings
      const featuredProviders = await Promise.all(
        Array.from(providerMap.values()).map(async ({ providerId, listings }) => {
          try {
            const providerResponse = await userAPI.getUserById(providerId);
            
            if (providerResponse.success) {
              return {
                ...providerResponse.data,
                listings,
                totalListings: listings.length
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching provider ${providerId}:`, error);
            return null;
          }
        })
      );

      // Filter out null results
      const validProviders = featuredProviders.filter(provider => provider !== null);

      return {
        success: true,
        data: validProviders
      };
    } catch (error) {
      console.error('Error fetching featured providers:', error);
      throw error;
    }
  }

  // Get top rated providers
  async getTopRatedProviders(filters = {}) {
    try {
      const providersResponse = await userAPI.getProviders(filters.page || 1, filters.limit || 20);
      
      if (!providersResponse.success) {
        throw new Error('Failed to fetch providers');
      }

      const providers = providersResponse.data || [];
      
      // Get listings for each provider and calculate average rating
      const providersWithRatings = await Promise.all(
        providers.map(async (provider) => {
          try {
            const listingsResponse = await listingAPI.getListingsByProvider(provider.uid, {
              status: 'active',
              limit: 10
            });
            
            const listings = listingsResponse.success ? listingsResponse.data.listings : [];
            
            // Calculate average rating from listings
            const totalRating = listings.reduce((sum, listing) => sum + (listing.statistics?.rating || 0), 0);
            const averageRating = listings.length > 0 ? totalRating / listings.length : 0;
            
            return {
              ...provider,
              listings: listings.slice(0, 3), // Show top 3 listings
              totalListings: listings.length,
              averageRating
            };
          } catch (error) {
            console.error(`Error fetching listings for provider ${provider.uid}:`, error);
            return {
              ...provider,
              listings: [],
              totalListings: 0,
              averageRating: 0
            };
          }
        })
      );

      // Sort by average rating
      const sortedProviders = providersWithRatings
        .filter(provider => provider.averageRating > 0)
        .sort((a, b) => b.averageRating - a.averageRating);

      return {
        success: true,
        data: sortedProviders,
        pagination: providersResponse.pagination
      };
    } catch (error) {
      console.error('Error fetching top rated providers:', error);
      throw error;
    }
  }
}

export default new ProviderService();
