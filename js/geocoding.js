// Geocoding Service
const GeocodingService = {
    // Cache for addresses to reduce API calls
    addressCache: {},

    // Get address from coordinates
    async getAddress(lat, lng) {
        const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
        
        // Return from cache if available
        if (this.addressCache[cacheKey]) {
            return this.addressCache[cacheKey];
        }

        try {
            // Use Nominatim API (OpenStreetMap)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Geocoding request failed');

            const data = await response.json();
            
            if (data && data.address) {
                const address = this.formatAddress(data.address);
                this.addressCache[cacheKey] = address;
                return address;
            }
            
            return 'Address not found';
        } catch (error) {
            console.error('Geocoding error:', error);
            return 'Unable to fetch address';
        }
    },

    // Format address from Nominatim data
    formatAddress(addressData) {
        const parts = [];

        // Add street address
        if (addressData.road) {
            parts.push(addressData.road);
        }

        // Add house number if available
        if (addressData.house_number && parts.length > 0) {
            parts[0] = `${addressData.house_number}, ${parts[0]}`;
        }

        // Add suburb/village
        if (addressData.suburb) {
            parts.push(addressData.suburb);
        } else if (addressData.village) {
            parts.push(addressData.village);
        }

        // Add city
        if (addressData.city) {
            parts.push(addressData.city);
        } else if (addressData.town) {
            parts.push(addressData.town);
        }

        // Add state
        if (addressData.state) {
            parts.push(addressData.state);
        }

        // Add country
        if (addressData.country) {
            parts.push(addressData.country);
        }

        // Add postal code
        if (addressData.postcode) {
            parts.push(addressData.postcode);
        }

        return parts.length > 0 ? parts.join(', ') : 'Address not available';
    },

    // Get coordinates from address (forward geocoding)
    async getCoordinates(address) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Geocoding request failed');

            const data = await response.json();
            
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    address: data[0].display_name
                };
            }
            
            return null;
        } catch (error) {
            console.error('Forward geocoding error:', error);
            return null;
        }
    },

    // Get nearby places
    async getNearbyPlaces(lat, lng, radius = 1000) {
        try {
            // This would require additional APIs like Overpass API
            // For now, we'll return empty array
            return [];
        } catch (error) {
            console.error('Error getting nearby places:', error);
            return [];
        }
    }
};