# Spectrum - Premium Eyewear E-commerce Website

A modern, responsive e-commerce website for eyewear built with Next.js, Tailwind CSS, and Firebase.

## 🚀 Features

- **Modern UI/UX**: Built with Tailwind CSS and Shadcn/ui components
- **SEO Optimized**: Next.js with App Router for excellent SEO performance
- **Responsive Design**: Mobile-first approach with beautiful responsive layouts
- **Product Management**: Complete product catalog with categories and filtering
- **Blog System**: MDX-powered blog for content marketing
- **Image Sliders**: Swiper.js integration for product showcases
- **Data Fetching**: React Query for efficient data management
- **Firebase Integration**: Firestore for data storage and management

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: Firebase Firestore
- **State Management**: React Query (TanStack Query)
- **Blog**: MDX with @next/mdx
- **Sliders**: Swiper.js
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spectrum-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── blog/              # Blog pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── Header.tsx        # Navigation header
│   ├── Footer.tsx        # Site footer
│   ├── Hero.tsx          # Hero section
│   └── ProductCard.tsx   # Product display card
├── hooks/                # Custom React hooks
│   ├── use-products.ts   # Product data hooks
│   └── use-blog.ts       # Blog data hooks
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   └── query-client.tsx  # React Query setup
└── types/                # TypeScript type definitions
    └── index.ts          # Main type definitions
```

## 🎨 Components

### Core Components
- **Header**: Responsive navigation with mobile menu
- **Footer**: Comprehensive site footer with links
- **Hero**: Dynamic slider with call-to-action sections
- **ProductCard**: Product display with hover effects and actions

### UI Components (Shadcn/ui)
- Button, Card, Badge, Input, Label
- Navigation Menu, Sheet (mobile menu)
- Avatar, Select, Textarea

## 🔥 Firebase Setup

1. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com)

2. **Enable Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Choose your region

3. **Set up collections**:
   ```javascript
   // Products collection
   products: {
     id: string,
     name: string,
     description: string,
     price: number,
     originalPrice?: number,
     images: string[],
     category: 'sunglasses' | 'eyeglasses' | 'reading-glasses' | 'contact-lenses' | 'accessories',
     brand: string,
     features: string[],
     inStock: boolean,
     createdAt: timestamp,
     updatedAt: timestamp
   }

   // Blog posts collection
   blog-posts: {
     id: string,
     title: string,
     slug: string,
     excerpt: string,
     content: string,
     featuredImage?: string,
     author: string,
     publishedAt: timestamp,
     updatedAt: timestamp,
     tags: string[],
     category: 'eye-care' | 'fashion' | 'technology' | 'lifestyle' | 'health',
     published: boolean
   }
   ```

## 📝 Blog System

The blog system supports MDX files and can be extended to load content from Firestore:

1. **MDX Files**: Place `.mdx` files in `src/content/blog/`
2. **Firestore Integration**: Blog posts are stored in Firestore for dynamic content
3. **SEO**: Each blog post has proper meta tags and structured data

## 🎯 Key Features

### Product Management
- Product categories (Sunglasses, Eyeglasses, Reading Glasses, Contact Lenses)
- Product filtering and search
- Image galleries with Swiper.js
- Shopping cart functionality (ready for implementation)

### Blog System
- MDX support for rich content
- Category filtering
- Author information
- Publication dates
- SEO optimization

### Performance
- Next.js Image optimization
- React Query for efficient data fetching
- Responsive images
- Code splitting

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables
4. Deploy!

### Firebase Hosting
1. Build the project: `npm run build`
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Login: `firebase login`
4. Initialize: `firebase init hosting`
5. Deploy: `firebase deploy`

## 🔧 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/app/globals.css` for global styles
- Customize Shadcn/ui components in `src/components/ui/`

### Content
- Update product data in Firestore
- Add blog posts via Firestore or MDX files
- Modify navigation in `src/components/Header.tsx`

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🎨 Design System

- **Colors**: Customizable via Tailwind CSS variables
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale
- **Components**: Reusable Shadcn/ui components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

Built with ❤️ for the eyewear industry