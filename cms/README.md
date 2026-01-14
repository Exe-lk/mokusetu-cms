# MokuSetu CMS

A modern, responsive Content Management System built for MokuSetu Group G.K., a business consultancy firm connecting international businesses with opportunities in the Japanese market.

## Features

### 📊 Dashboard
- Real-time statistics and analytics
- Page views, published posts, and pending inquiries tracking
- Recent activity feed
- Latest blog updates overview

### ✍️ Blog Management
- Comprehensive blog post management
- Filter by status (Published/Draft)
- Search functionality
- Responsive table view with edit and delete actions
- Pagination support

### 📄 Page Content Editor
- Visual content editor for the home page
- Hero section customization
- Statistics bar management
- Drag-and-drop sections
- Live preview panel
- Auto-save functionality
- Image upload support

### 💼 Services Management
- Service offerings overview
- Add, edit, and manage services
- Status tracking

### 👥 Team Management
- Team member directory
- Role and permission management
- Contact information

### ⚙️ Settings
- Site configuration
- Email notifications toggle
- Auto-save preferences
- Data export functionality
- Cache management

### 🔐 Authentication
- Secure login page
- Remember me functionality
- Password visibility toggle
- Responsive design

## Responsive Design

All pages are fully responsive and optimized for:
- 📱 **Mobile devices** (320px - 767px)
- 📱 **Tablets** (768px - 1023px)
- 💻 **Desktop** (1024px+)

### Responsive Features:
- Collapsible sidebar navigation with mobile menu
- Adaptive tables that hide columns on smaller screens
- Touch-friendly buttons and controls
- Flexible grid layouts
- Optimized typography and spacing
- Mobile-optimized forms

## Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **UI:** React 19.2.3
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript 5
- **Fonts:** Geist Sans & Geist Mono

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
cms/
├── app/
│   ├── components/       # Reusable UI components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── StatCard.tsx
│   │   └── ActivityFeed.tsx
│   ├── data/            # Mock data and configurations
│   │   └── mockData.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── dashboard/       # Dashboard page
│   ├── blog/           # Blog management page
│   ├── pages/          # Page content editor
│   ├── services/       # Services management
│   ├── team/           # Team management
│   ├── settings/       # Settings page
│   ├── login/          # Authentication page
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page (redirects to login)
│   └── globals.css     # Global styles
├── public/             # Static assets
└── package.json        # Dependencies
```

## Pages Overview

### 1. Login (`/login`)
- Email and password authentication
- Remember me functionality
- Forgot password link
- Beautiful split-screen design

### 2. Dashboard (`/dashboard`)
- Statistics cards (Page Views, Published Posts, Pending Inquiries)
- Latest blog updates table
- Recent activity feed
- Responsive grid layout

### 3. Blog Management (`/blog`)
- Post statistics overview
- Search and filter functionality
- Comprehensive post listing
- Edit and delete actions
- Status badges

### 4. Page Editor (`/pages`)
- Hero section editor
- Statistics bar customization
- Services overview
- Why Choose Us section
- Live preview panel
- Drag-and-drop interface

### 5. Services (`/services`)
- Service cards grid
- Add new services
- Edit existing services
- Status indicators

### 6. Team (`/team`)
- Team member table
- Add new members
- Role management
- Contact information

### 7. Settings (`/settings`)
- Site configuration
- Notification preferences
- Auto-save settings
- Cache management
- Data export

## Color Scheme

- **Primary:** Red (#DC2626)
- **Dark:** Slate (#1E293B)
- **Background:** Gray-50 (#F9FAFB)
- **Text:** Gray-900 (#111827)
- **Accents:** Blue, Orange, Green

## Customization

### Adding New Pages

1. Create a new folder in `app/`
2. Add a `page.tsx` file
3. Update navigation in `app/components/Sidebar.tsx`

### Modifying Data

Mock data is located in `app/data/mockData.ts`. Update this file to change:
- Blog posts
- Statistics
- Activities
- User information

### Styling

Tailwind CSS is used for all styling. Modify `app/globals.css` for global styles.

## Future Enhancements

- Real API integration
- Database connectivity
- Image upload functionality
- Rich text editor for blog posts
- Analytics dashboard
- Multi-language support
- Dark mode
- User authentication system
- Role-based access control

## License

© 2025 MokuSetu Group G.K. All rights reserved.

## Support

For support, contact: support@mokusetu.com
