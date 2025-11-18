# SUNNY AUTO - Industrial & Logistics EV Solutions Website

A modern, responsive website for SUNNY AUTO, a pioneering solution provider in transportation and equipment for industrial and logistics sectors, established under Leong Lee International Limited.

🌐 **Live Website**: [sunnyauto.vn](https://sunnyauto.vn)

## 🚀 Features

### Frontend Features
- **Modern UI/UX**: Clean, professional design with Tailwind CSS and Shadcn/ui components
- **SEO Optimized**: Next.js 15 with App Router for excellent SEO performance
- **Fully Responsive**: Mobile-first approach with beautiful responsive layouts
- **PWA Support**: Progressive Web App with offline capabilities
- **Fast Performance**: Optimized images, code splitting, and efficient data fetching

### Content Management
- **Dynamic CMS**: Firebase-powered content management system
- **Admin Panel**: Comprehensive admin dashboard for managing content
- **Content Sections**: Manageable sections including:
  - Hero sections
  - Featured products
  - Company statistics
  - News/Blog posts
  - Image galleries
  - About page content

### Product Management
- **Product Catalog**: Complete product listing with categories
- **Product Details**: Detailed product pages with specifications
- **Product Filtering**: Filter by category, brand, and features
- **Image Galleries**: Swiper.js integration for product showcases

### Test Ride Booking
- **Book Test Ride Modal**: User-friendly form for booking test drives
- **Admin Management**: Admin panel to view and manage test ride bookings
- **Status Tracking**: Track bookings from pending to completed
- **Email Integration**: Contact information for follow-up

### Blog & News
- **Blog System**: Dynamic blog posts with categories
- **News Section**: Latest updates and company news
- **Rich Content**: Editor.js integration for rich text editing
- **SEO Optimized**: Proper meta tags and structured data

### Additional Features
- **Contact Forms**: Contact page with form submission
- **Privacy Policy**: Comprehensive privacy policy page
- **Cookie Policy**: GDPR-compliant cookie policy
- **Brand Pages**: Dedicated pages for partner brands
- **About Page**: Company information, vision, mission, and team

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15.5.2**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript 5**: Full type safety

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework
- **Shadcn/ui**: High-quality React components
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icon library

### Backend & Database
- **Firebase Firestore**: NoSQL database for content and data
- **Firebase Authentication**: User authentication system
- **Firebase Storage**: Image and file storage
- **Firebase Hosting**: Website hosting and deployment

### Content Management
- **Editor.js**: Block-style editor for rich content
- **MDX Support**: Markdown with JSX support
- **React Query**: Efficient data fetching and caching

### Additional Libraries
- **Swiper.js**: Touch slider for product galleries
- **Sonner**: Toast notifications
- **Zod**: Schema validation

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd spectrum-website
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 4: Configure Firebase
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database (production mode)
3. Enable Firebase Authentication (Email/Password)
4. Enable Firebase Storage
5. Set up Firestore security rules (see `firestore.rules`)
6. Configure Firebase Hosting (see `firebase.json`)

### Step 5: Run Development Server
```bash
npm run dev
```

The website will be available at [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
spectrum-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── about/             # About page
│   │   ├── admin/             # Admin panel
│   │   │   ├── analytics/     # Analytics dashboard
│   │   │   ├── blog/          # Blog management
│   │   │   ├── categories/    # Category management
│   │   │   ├── contacts/      # Contact messages
│   │   │   ├── content/       # CMS content editor
│   │   │   ├── products/      # Product management
│   │   │   ├── test-rides/    # Test ride bookings
│   │   │   └── users/         # User management
│   │   ├── blog/              # Blog listing page
│   │   ├── blog-detail/       # Blog detail page
│   │   ├── contact/           # Contact page
│   │   ├── products/          # Product listing
│   │   ├── product-detail/    # Product detail page
│   │   ├── privacy-policy/    # Privacy policy
│   │   ├── cookie-policy/     # Cookie policy
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn/ui components
│   │   ├── Header.tsx        # Navigation header
│   │   ├── Footer.tsx        # Site footer
│   │   ├── BookTestRideModal.tsx  # Test ride booking modal
│   │   └── ...               # Other components
│   ├── hooks/                # Custom React hooks
│   │   ├── useContent.ts     # Content management hook
│   │   ├── useHomeContent.ts # Home page content hook
│   │   └── useStoreSettings.ts # Store settings hook
│   ├── lib/                  # Utility libraries
│   │   ├── firebase.ts       # Firebase configuration
│   │   ├── firebase-firestore.ts  # Firestore operations
│   │   ├── firebase-auth.ts  # Authentication
│   │   ├── firebase-storage.ts # File storage
│   │   └── structured-data.ts # SEO structured data
│   ├── contexts/             # React contexts
│   │   └── AppContext.tsx    # Global app context
│   └── types/                # TypeScript definitions
│       └── index.ts          # Type definitions
├── public/                   # Static assets
├── firebase.json             # Firebase configuration
├── firestore.rules          # Firestore security rules
└── package.json             # Dependencies
```

## 🔥 Firebase Setup

### Firestore Collections

#### Products Collection
```javascript
products: {
  id: string,
  name: string,
  description: string,
  price: number,
  originalPrice?: number,
  images: string[],
  category: string,
  brand: string,
  features: string[],
  specifications: object,
  inStock: boolean,
  featured: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Blog Posts Collection
```javascript
blogPosts: {
  id: string,
  title: string,
  slug: string,
  excerpt: string,
  content: string, // Editor.js JSON
  featuredImage?: string,
  author: string,
  publishedAt: timestamp,
  updatedAt: timestamp,
  tags: string[],
  category: string,
  published: boolean
}
```

#### Test Rides Collection
```javascript
testRides: {
  id: string,
  fullName: string,
  email: string,
  phone: string,
  preferredDate: string,
  preferredTime: string,
  productInterest: string,
  productId: string,
  location: string,
  notes: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Content Sections Collection
```javascript
sections: {
  id: string, // e.g., 'hero-section', 'stats-section'
  data: object, // Section-specific data
  updatedAt: timestamp
}
```

### Firestore Security Rules
See `firestore.rules` for complete security rules. Key points:
- Public read access for products, blog posts, and content sections
- Authenticated write access for admin users
- Test rides: authenticated read/write for admins, public write for submissions

## 📝 Admin Panel

### Access
1. Navigate to `/login`
2. Login with admin credentials:
   - Email: `admin@spectrum.com` or `nguyenphuocsang@gmail.com`
   - Password: (set in Firebase Authentication)

### Features
- **Dashboard**: Overview of users, products, blog posts, and contacts
- **Product Management**: Create, edit, and delete products
- **Blog Management**: Create and manage blog posts with Editor.js
- **Content Management**: Edit homepage sections and about page
- **Test Ride Bookings**: View and manage test ride requests
- **User Management**: View registered users
- **Analytics**: View website statistics
- **Category Management**: Manage product categories

## 🎯 Key Features Guide

### Homepage Sections
The homepage consists of manageable sections:
1. **Hero Section**: Main banner with CTA
2. **Featured Products**: Showcase featured products
3. **Company Statistics**: Key metrics and achievements
4. **Secondary Hero**: Additional promotional section
5. **Image Gallery**: Visual showcase
6. **Latest News**: Blog posts preview
7. **Product Categories**: Category navigation

All sections can be edited via Admin Panel → Content Management.

### Test Ride Booking
1. Users click "Book a Test Ride" button on product detail page
2. Modal opens with booking form
3. User fills in required information
4. Submission saved to Firestore
5. Admin can view and manage bookings in Admin Panel → Test Ride Bookings

### Blog System
- Create blog posts via Admin Panel → Blog → Create New Post
- Use Editor.js for rich content editing
- Posts support categories, tags, and featured images
- SEO optimized with proper meta tags

## 🚀 Deployment

### Firebase Hosting (Current Setup)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting
   ```

3. **Deploy everything** (hosting + functions)
   ```bash
   firebase deploy
   ```

### Environment Setup for Production
- Ensure all environment variables are set in Firebase Hosting settings
- Configure custom domain in Firebase Console
- Set up SSL certificates (automatic with Firebase)

### Build Configuration
- Output directory: `out/` (static export)
- Build command: `npm run build`
- Node version: 18+

## 🔧 Customization

### Styling
- **Theme Colors**: Modify `tailwind.config.js` or `globals.css`
- **Components**: Customize Shadcn/ui components in `src/components/ui/`
- **Global Styles**: Update `src/app/globals.css`

### Content
- **Homepage**: Edit via Admin Panel → Content Management
- **About Page**: Edit via Admin Panel → Content Management → About Page
- **Navigation**: Update `src/components/Header.tsx`
- **Footer**: Update `src/components/Footer.tsx`

### Domain Configuration
- Current domain: `sunnyauto.vn`
- Update domain in:
  - `src/app/layout.tsx` (meta tags)
  - `src/lib/structured-data.ts` (Schema.org data)
  - Firebase Hosting settings

## 📱 Responsive Design

Breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components are mobile-first and fully responsive.

## 🎨 Design System

- **Colors**: Emerald/Teal primary colors for EV theme
- **Typography**: System fonts with clean, modern styling
- **Spacing**: Consistent spacing scale (Tailwind defaults)
- **Components**: Reusable Shadcn/ui components
- **Animations**: Framer Motion for smooth transitions

## 🔐 Security

- **Firestore Rules**: Secure database access
- **Authentication**: Firebase Auth for admin access
- **Input Validation**: Client and server-side validation
- **HTTPS**: Automatic SSL with Firebase Hosting
- **CSP Headers**: Content Security Policy configured

## 📊 Performance

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Caching**: React Query for efficient data caching
- **Lazy Loading**: Components and images loaded on demand
- **PWA**: Service worker for offline support

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed sample data (if available)
```

### Development Tips
- Use `npm run dev` with Turbopack for faster development
- Hot reload is enabled by default
- Check browser console for Firebase connection issues
- Use React DevTools for component debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support & Troubleshooting

### Common Issues

**Firebase Connection Errors**
- Check environment variables in `.env.local`
- Verify Firebase project configuration
- Ensure Firestore is enabled

**Build Errors**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

**Admin Access Issues**
- Verify user email in Firebase Authentication
- Check Firestore security rules
- Ensure user has admin role

### Getting Help
- Check Firebase Console for errors
- Review browser console for client-side errors
- Check Next.js build logs for build issues
- Review Firestore rules and indexes

## 📞 Contact

For support and questions:
- Website: [sunnyauto.vn](https://sunnyauto.vn)
- Email: info@sunnyautoev.com

---

**Built with ❤️ for SUNNY AUTO - Pioneering Industrial & Logistics EV Solutions**

*Part of Leong Lee International Limited*


Deploy lên production 

Chạy sever