// Role utilities
const RoleUtils = {
    // Get role badge
    getRoleBadge(role) {
        const badges = {
            'admin': '<span class="admin-badge">👑 Admin</span>',
            'citizen': '<span class="citizen-badge">👤 Citizen</span>'
        };
        return badges[role] || '<span class="citizen-badge">👤 Unknown</span>';
    },

    // Get role icon
    getRoleIcon(role) {
        return role === 'admin' ? '👑' : '👤';
    },

    // Get role display name
    getRoleDisplayName(role) {
        return role.charAt(0).toUpperCase() + role.slice(1);
    },

    // Format user info with role
    formatUserInfo(user) {
        return {
            name: user.name,
            email: user.email,
            role: this.getRoleDisplayName(user.role),
            icon: this.getRoleIcon(user.role),
            badge: this.getRoleBadge(user.role)
        };
    },

    // Check permission
    hasPermission(userRole, requiredPermission) {
        const permissions = {
            'admin': ['view_complaints', 'update_status', 'delete_complaint', 'manage_users', 'view_analytics'],
            'citizen': ['create_complaint', 'view_own_complaints', 'update_own_profile']
        };
        
        return permissions[userRole]?.includes(requiredPermission) || false;
    }
};

// Add CSS for role badges
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .admin-badge {
        padding: 8px 15px;
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white;
        border-radius: 20px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9em;
    }

    .citizen-badge {
        padding: 8px 15px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-radius: 20px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9em;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.2em;
    }
`;
document.head.appendChild(styleSheet);