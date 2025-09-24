export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Spectrum',
    description: 'Premium eyewear and sunglasses retailer',
    url: 'https://spec-9233a.web.app',
    logo: 'https://spec-9233a.web.app/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: 'English'
    },
    sameAs: [
      'https://facebook.com/spectrum-eyewear',
      'https://twitter.com/spectrum_eyewear',
      'https://instagram.com/spectrum_eyewear',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main Street',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US'
    }
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Spectrum - Premium Eyewear',
    url: 'https://spec-9233a.web.app',
    description: 'Discover the perfect eyewear that complements your style and protects your vision.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://spec-9233a.web.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }
}

export function generateProductSchema(product: {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  brand: string
  inStock: boolean
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Spectrum'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150'
    }
  }
}

export function generateBlogPostSchema(post: {
  title: string
  description: string
  featuredImage?: string
  author: string
  publishedAt: Date
  updatedAt: Date
  tags: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.featuredImage,
    author: {
      '@type': 'Person',
      name: post.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Spectrum',
      logo: {
        '@type': 'ImageObject',
        url: 'https://spec-9233a.web.app/logo.png'
      }
    },
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    keywords: post.tags.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://spec-9233a.web.app/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`
    }
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}
