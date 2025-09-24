import { Metadata } from 'next'

const baseUrl = 'https://spec-9233a.web.app'
const siteName = 'Spectrum - Premium Eyewear & Sunglasses'

export const defaultMetadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: 'Discover the perfect eyewear that complements your style and protects your vision. From trendy sunglasses to prescription glasses, we have everything you need.',
  keywords: [
    'eyewear',
    'sunglasses',
    'eyeglasses',
    'prescription glasses',
    'contact lenses',
    'optical',
    'vision care',
    'eye health',
    'fashion glasses',
    'designer eyewear',
  ],
  authors: [{ name: 'Spectrum Team' }],
  creator: 'Spectrum',
  publisher: 'Spectrum',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: siteName,
    description: 'Discover the perfect eyewear that complements your style and protects your vision.',
    siteName: siteName,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: 'Discover the perfect eyewear that complements your style and protects your vision.',
    images: ['/og-image.jpg'],
    creator: '@spectrum_eyewear',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export function generateProductMetadata(product: {
  name: string
  description: string
  price: number
  images: string[]
  category: string
  brand: string
}) {
  return {
    title: `${product.name} - ${product.brand}`,
    description: product.description,
    keywords: [
      product.name,
      product.brand,
      product.category,
      'eyewear',
      'glasses',
      'sunglasses',
      'prescription',
    ],
    openGraph: {
      title: `${product.name} - ${product.brand}`,
      description: product.description,
      images: product.images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${product.brand}`,
      description: product.description,
      images: product.images,
    },
  } satisfies Metadata
}

export function generateBlogMetadata(post: {
  title: string
  excerpt: string
  featuredImage?: string
  publishedAt: Date
  tags: string[]
}) {
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : undefined,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  } satisfies Metadata
}
