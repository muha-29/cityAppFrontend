// Complaint Service using Supabase
const ComplaintService = {
    // Create new complaint
    async createComplaint(complaintData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('complaints')
                .insert([{
                    title: complaintData.title,
                    description: complaintData.description,
                    category: complaintData.category,
                    photo_url: complaintData.photoUrl || null,
                    latitude: complaintData.lat,
                    longitude: complaintData.lng,
                    location: `POINT(${complaintData.lng} ${complaintData.lat})`,
                    citizen_id: user.id
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, complaint: data };
        } catch (error) {
            throw new Error(error.message || 'Failed to create complaint');
        }
    },

    // Get all complaints with caching
    async getAllComplaints() {
        try {
            // Try to use cached version first
            const cacheKey = 'all_complaints_cache';
            const cached = sessionStorage.getItem(cacheKey);

            if (cached) {
                console.log('Using cached complaints');
                return JSON.parse(cached);
            }

            const { data, error } = await supabase
                .from('complaints')
                .select(`
                        *,
                        profiles:citizen_id (
                            name,
                            email
                        )
                    `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const response = { success: true, complaints: data };

            // Cache for 2 minutes
            sessionStorage.setItem(cacheKey, JSON.stringify(response));
            setTimeout(() => {
                sessionStorage.removeItem(cacheKey);
            }, 120000);

            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch complaints');
        }
    },

    // Get user's complaints
    async getMyComplaints() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('complaints')
                .select('*')
                .eq('citizen_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, complaints: data };
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch complaints');
        }
    },

    // Get complaint by ID
    async getComplaintById(id) {
        try {
            const { data, error } = await supabase
                .from('complaints')
                .select(`
                    *,
                    profiles:citizen_id (
                        name,
                        email,
                        phone
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return { success: true, complaint: data };
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch complaint');
        }
    },

    // Update complaint status (admin only)
    async updateComplaintStatus(id, status) {
        try {
            const { data, error } = await supabase
                .from('complaints')
                .update({ status })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { success: true, complaint: data };
        } catch (error) {
            throw new Error(error.message || 'Failed to update complaint');
        }
    },

    // Delete complaint
    async deleteComplaint(id) {
        try {
            const { error } = await supabase
                .from('complaints')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            throw new Error(error.message || 'Failed to delete complaint');
        }
    },

    // Upload photo to Supabase Storage
    async uploadPhoto(file) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('complaint-photos')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('complaint-photos')
                .getPublicUrl(fileName);

            return { success: true, url: publicUrl };
        } catch (error) {
            throw new Error(error.message || 'Failed to upload photo');
        }
    },

    // Subscribe to real-time updates
    subscribeToComplaints(callback) {
        return supabase
            .channel('complaints-channel')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'complaints' },
                callback
            )
            .subscribe();
    }
};

// Utility functions
const Utils = {
    // Show alert message
    showAlert(message, type = 'info', duration = 5000) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <span>${message}</span>
            <button class="alert-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        const container = document.querySelector('.container') || document.body;
        container.insertBefore(alertDiv, container.firstChild);

        setTimeout(() => {
            alertDiv.remove();
        }, duration);
    },

    // Format date
    formatDate(dateString) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    },

    // Get status badge HTML
    getStatusBadge(status) {
        const statusClass = {
            'Pending': 'badge-pending',
            'In Progress': 'badge-progress',
            'Resolved': 'badge-resolved'
        };
        return `<span class="badge ${statusClass[status]}">${status}</span>`;
    },

    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate coordinates
    validateCoordinates(lat, lng) {
        return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    },

    // Show loading spinner
    showLoading(element) {
        element.innerHTML = '<div class="spinner"></div>';
    },

    // Hide loading spinner
    hideLoading(element, content = '') {
        element.innerHTML = content;
    },

    // Truncate text
    truncate(text, length = 100) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }
};