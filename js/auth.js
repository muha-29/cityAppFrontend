// Authentication Service using Supabase
const AuthService = {
    // Register new user
    async register(userData) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        name: userData.name,
                        role: userData.role || 'citizen',
                        phone: userData.phone || null,
                        address: userData.address || null
                    }
                }
            });

            if (error) throw error;

            // Update profile with additional info
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        phone: userData.phone,
                        address: userData.address
                    })
                    .eq('id', data.user.id);

                if (profileError) console.error('Profile update error:', profileError);
            }

            return { success: true, user: data.user, session: data.session };
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    },

    // Login user
    async login(credentials) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password
            });

            if (error) throw error;

            // Get user profile with role
            const profile = await this.getUserProfile(data.user.id);

            // Store user data
            if (profile) {
                localStorage.setItem('userData', JSON.stringify(profile));

                // Store role in session for quick access
                sessionStorage.setItem('userRole', profile.role);
            }

            return {
                success: true,
                user: data.user,
                profile: profile,
                session: data.session
            };
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    },

    // Get user profile with role
    async getUserProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const profile = await this.getUserProfile(user.id);
                return profile;
            }

            return null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    // Get current user role
    async getCurrentUserRole() {
        try {
            // First check session storage (faster)
            const cachedRole = sessionStorage.getItem('userRole');
            if (cachedRole) {
                return cachedRole;
            }

            // Fallback to fetching from database
            const user = await this.getCurrentUser();
            if (user && user.role) {
                sessionStorage.setItem('userRole', user.role);
                return user.role;
            }

            return null;
        } catch (error) {
            console.error('Error getting user role:', error);
            return null;
        }
    },

    // Check if user is authenticated
    async isAuthenticated() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return !!session;
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    },

    // Check if user is admin
    async isAdmin() {
        try {
            const role = await this.getCurrentUserRole();
            return role === 'admin';
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    },

    // Check if user is citizen
    async isCitizen() {
        try {
            const role = await this.getCurrentUserRole();
            return role === 'citizen';
        } catch (error) {
            console.error('Error checking citizen status:', error);
            return false;
        }
    },

    // Get appropriate dashboard URL based on role
    async getDashboardUrl() {
        try {
            const role = await this.getCurrentUserRole();

            if (role === 'admin') {
                return '/admin.html';
            } else if (role === 'citizen') {
                return '/dashboard.html';
            }

            return '/dashboard.html'; // Default to citizen dashboard
        } catch (error) {
            console.error('Error getting dashboard URL:', error);
            return '/dashboard.html';
        }
    },

    // Logout
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            localStorage.removeItem('userData');
            sessionStorage.removeItem('userRole');
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    // Update profile
    async updateProfile(userId, updates) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;

            // Update local storage
            localStorage.setItem('userData', JSON.stringify(data));

            return { success: true, profile: data };
        } catch (error) {
            throw new Error(error.message || 'Profile update failed');
        }
    },

    // Send password reset email
    async sendPasswordResetEmail(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password.html`
            });

            if (error) throw error;

            return { success: true, message: 'Password reset email sent successfully' };
        } catch (error) {
            throw new Error(error.message || 'Failed to send password reset email');
        }
    },

    // Update password
    async updatePassword(newPassword) {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            return { success: true, message: 'Password updated successfully' };
        } catch (error) {
            throw new Error(error.message || 'Failed to update password');
        }
    },

    // Listen to auth state changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }
};

// Protect routes - call this on protected pages
async function protectRoute(requireAdmin = false, requireCitizen = false) {
    const isAuth = await AuthService.isAuthenticated();

    if (!isAuth) {
        window.location.href = '/login.html';
        return false;
    }

    if (requireAdmin) {
        const isAdminUser = await AuthService.isAdmin();
        if (!isAdminUser) {
            alert('Access denied. Admin only.');
            window.location.href = '/dashboard.html';
            return false;
        }
    }

    if (requireCitizen) {
        const isCitizenUser = await AuthService.isCitizen();
        if (!isCitizenUser) {
            alert('Access denied. Citizens only.');
            window.location.href = '/admin.html';
            return false;
        }
    }

    return true;
}

// Redirect to appropriate dashboard based on role
async function redirectToDashboard() {
    const dashboardUrl = await AuthService.getDashboardUrl();
    window.location.href = dashboardUrl;
}