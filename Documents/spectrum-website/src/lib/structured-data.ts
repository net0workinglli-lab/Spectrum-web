export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sunny Auto',
    description: 'Electric vehicle innovator delivering zero-emission mobility with advanced battery technology and a seamless charging ecosystem.',
    url: 'https://sunnyauto.vn',
    logo: 'https://sunnyauto.vn/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-28-8888-6868',
      contactType: 'customer service',
      areaServed: 'VN',
      availableLanguage: ['English']
    },
    sameAs: [
      'https://facebook.com/sunnyauto',
      'https://twitter.com/sunnyautoev',
      'https://www.youtube.com/@SunnyAutoEV',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '12 D5 Street, Hi-Tech Park',
      addressLocality: 'Thu Duc City',
      addressRegion: 'Ho Chi Minh City',
      postalCode: '700000',
      addressCountry: 'VN'
    }
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sunny Auto',
    url: 'https://sunnyauto.vn',
    description: "Explore Sunny Auto's electric ecosystem featuring zero-emission SUVs, solid-state batteries, and smart charging services.",
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://sunnyauto.vn/search?q={search_term_string}',
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
      priceCurrency: 'VND',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Sunny Auto'
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
      name: 'Sunny Auto',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sunnyauto.vn/logo.png'
      }
    },
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    keywords: post.tags.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sunnyauto.vn/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`
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
