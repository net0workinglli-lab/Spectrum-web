// Generate static params for dynamic route
export async function generateStaticParams() {
  // For now, return default static sections
  // Custom pages will be handled dynamically at runtime
  return [
    { id: 'hero-section' },
    { id: 'about-page' },
    { id: 'contact-page' },
    { id: 'products-page' },
    { id: 'blog-page' },
    { id: 'footer-section' },
    { id: 'featured-products-section' },
    { id: 'stats-section' },
    { id: 'secondary-hero-section' },
    { id: 'image-gallery-section' },
    { id: 'categories-section' },
    { id: 'lenses-section' },
    { id: 'cta-section' },
    { id: 'esg-certificate-page' },
    { id: 'header-section' }
  ];
}
