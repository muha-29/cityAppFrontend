# 🌍 Civic Complaint Tracker - Supabase Edition

A beautiful, elegant, and fully-functional web application for reporting and tracking civic issues built with Supabase as the backend.

## ✨ Features

### 🔐 Authentication
- Secure JWT-based authentication with Supabase Auth
- User registration with role selection (Citizen/Admin)
- Session management
- Protected routes

### 📝 Complaint Management
- Create complaints with title, description, category, and location
- Upload photo evidence to Supabase Storage
- Real-time status tracking (Pending → In Progress → Resolved)
- Delete own pending complaints
- View all complaints or filter by user

### 🗺️ Interactive Map
- View all complaints on an interactive Leaflet.js map
- Color-coded markers by status
- Click markers to see complaint details
- Get current location with geolocation API
- Filter complaints by status

### 👑 Admin Features
- Comprehensive admin dashboard
- Manage all complaints
- Update complaint status
- Delete any complaint
- View user statistics
- Search and filter functionality

### 🔔 Real-time Updates
- Live updates using Supabase Realtime
- Automatic refresh when complaints change
- No page reload needed

### 📱 Responsive Design
- Beautiful gradient UI
- Smooth animations
- Mobile-friendly
- Modern design patterns

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Maps**: Leaflet.js
- **Styling**: Custom CSS with gradients and animations
- **Database**: PostgreSQL with PostGIS for geolocation

## 📁 Project Structure
CITY-WEB/
├── index.html # Landing page with stats
├── login.html # Login page
├── register.html # Registration page
├── dashboard.html # User dashboard
├── create-complaint.html # Create new complaint
├── map.html # Interactive map view
├── profile.html # User profile page
├── admin.html # Admin dashboard
├── css/
│ └── styles.css # Global styles
└── js/
├── supabase-config.js # Supabase configuration
├── auth.js # Authentication service
└── utils.js # Utility functions & ComplaintService


## 🚀 Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be provisioned
4. Note your **Project URL** and **Anon Public Key** from Settings > API

### 2. Set Up Database

1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the entire SQL schema from the setup section above
3. Run the SQL to create tables, policies, and triggers

### 3. Configure Storage

1. Go to Storage in Supabase dashboard
2. Create a new bucket named `complaint-photos`
3. Make it **public**
4. Add the storage policies from the setup section

### 4. Configure the Application

Update `js/supabase-config.js`:

```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_PROJECT_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
};


You can use any static file server:

Option 1: Python


# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

Option 2: Node.js

npx http-server -p 8000


Option 3: VS Code Live Server

Install "Live Server" extension
Right-click on index.html
Select "Open with Live Server"
6. Access the Application

Option 3: VS Code Live Server

Install "Live Server" extension
Right-click on index.html
Select "Open with Live Server"
6. Access the Application

http://localhost:8000




AuthService
- register(userData)
- login(credentials)
- getCurrentUser()
- isAuthenticated()
- isAdmin()
- logout()
- updateProfile(userId, updates)


ComplaintService
- createComplaint(complaintData)
- getAllComplaints()
- getMyComplaints()
- getComplaintById(id)
- updateComplaintStatus(id, status)
- deleteComplaint(id)
- uploadPhoto(file)
- subscribeToComplaints(callback)

Utils
- showAlert(message, type, duration)
- formatDate(dateString)
- getStatusBadge(status)
- validateEmail(email)
- validateCoordinates(lat, lng)
- truncate(text, length)    


🔄 Real-time Features
The application uses Supabase Realtime to provide live updates:

Dashboard: Auto-updates when complaints change
Map View: Markers update in real-time
Admin Dashboard: Live complaint status changes
🌍 Geolocation
Features
Get current location with HTML5 Geolocation API
Manual coordinate entry
PostGIS for spatial queries
Location validation
Distance calculations (future feature)
📸 Photo Upload
Supported Formats
JPEG (.jpg, .jpeg)
PNG (.png)
GIF (.gif)
Limitations
Maximum file size: 5MB
Stored in Supabase Storage
Automatic URL generation
🐛 Troubleshooting
Common Issues
1. "Failed to load complaints"

Check your Supabase configuration
Verify RLS policies are set correctly
Check browser console for errors
2. "Authentication failed"

Verify Supabase URL and anon key
Check if user is confirmed (check email)
Clear browser cache and try again
3. "Photo upload failed"

Check file size (must be < 5MB)
Verify storage bucket is public
Check storage policies
4. "Location not working"

Allow location permissions in browser
Check if using HTTPS (required for geolocation)
Try manual coordinate entry
5. "Real-time not working"

Check if Realtime is enabled in Supabase
Verify table permissions
Check browser console for errors




┌─────────────────────────────────────────────────────────┐
│                    LOGIN PAGE                           │
│                                                         │
│  Email: user@example.com                               │
│  Password: ••••••••••                                   │
│  [Login Button]                                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  Authenticate      │
        │  (Supabase Auth)   │
        └────────┬───────────┘
                 │
        ┌────────▼───────────┐
        │ Login Successful?  │
        └────────┬───────────┘
                 │
        ┌────────▼──────────────┐
        │ Fetch User Profile    │
        │ & Get Role from DB    │
        └────────┬──────────────┘
                 │
        ┌────────▼──────────────────┐
        │  Check User Role          │
        └────────┬───────────────────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼─────┐    ┌─────▼─────┐
    │   ADMIN   │    │  CITIZEN  │
    └────┬─────┘    └─────┬─────┘
         │                │
    ┌────▼─────────┐  ┌───▼──────────────┐
    │ Redirect to  │  │  Redirect to     │
    │ /admin.html  │  │ /dashboard.html  │
    └──────────────┘  └──────────────────┘