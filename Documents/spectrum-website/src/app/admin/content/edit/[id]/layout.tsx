// Generate static params for dynamic route
export async function generateStaticParams() {
  return [
    // Homepage Sections
    { id: 'hero-section' },
    { id: 'featured-products-section' },
    { id: 'stats-section' },
    { id: 'certificate-section' },
    { id: 'categories-section' },
    { id: 'brands-section' },
    { id: 'lenses-section' },
    { id: 'cta-section' },
    // Pages
    { id: 'about-page' },
    { id: 'contact-page' },
    { id: 'products-page' },
    { id: 'blog-page' },
    { id: 'esg-certificate-page' },
    { id: 'premium-partners-page' },
    // Global Sections
    { id: 'header-section' },
    { id: 'footer-section' }
  ];
}

export default function EditContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
