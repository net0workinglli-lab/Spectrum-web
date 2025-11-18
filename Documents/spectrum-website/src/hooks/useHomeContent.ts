import { useState, useEffect } from 'react';
import { getSectionContentById } from '@/lib/firebase-firestore';

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  video?: string;
  cta: string;
  href: string;
}

export interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    imageUrl: string;
    images?: string[]; // For hero slider images
    slides?: HeroSlide[]; // For hero slider slides
  };
  brands: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    images?: string[]; // For brand logos
    badgeText?: string;
    bottomCtaText?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    brandLogos?: string[]; // For brand logos from CMS
  };
  certificate: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    imageUrl: string;
    images?: string[]; // For additional certificate images
  };
}

const defaultContent: HomeContent = {
  hero: {
    title: "Discover Premium Eyewear",
    subtitle: "Experience the perfect blend of style and functionality",
    description: "Find your perfect pair of glasses from our curated collection of premium brands, designed for the modern lifestyle.",
    buttonText: "Shop Now",
    buttonLink: "/products",
    imageUrl: "/images/hero-glasses.jpg",
    slides: [
      {
        id: 1,
        title: "Discover Premium Eyewear",
        subtitle: "Experience the perfect blend of style and functionality",
        image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=600&fit=crop",
        cta: "Shop Now",
        href: "/products"
      },
      {
        id: 2,
        title: "Prescription Made Simple",
        subtitle: "Get your vision corrected with our expert optometrists",
        image: "https://images.unsplash.com/photo-1506629905607-3b4a0a0b0b0b?w=1200&h=600&fit=crop",
        cta: "Book Appointment",
        href: "/appointment"
      },
      {
        id: 3,
        title: "Premium Brands",
        subtitle: "From Ray-Ban to Oakley, we have it all",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&h=600&fit=crop",
        cta: "View Brands",
        href: "/brands"
      }
    ]
  },
  brands: {
    title: "Discover Our Premium Lens Brands",
    subtitle: "Trusted by millions worldwide",
    description: "Discover our exclusive collection of premium lens brands, each offering unique technologies and superior quality.",
    buttonText: "Shop All Brands",
    buttonLink: "/products",
    badgeText: "✨ Premium Partners",
    bottomCtaText: "Discover our complete collection of premium eyewear from these trusted brands",
    secondaryButtonText: "View Brand Stories",
    secondaryButtonLink: "/premium-partners",
    brandLogos: []
  },
  certificate: {
    title: "ESG Certified Excellence",
    subtitle: "Committed to sustainable practices",
    description: "Our commitment to environmental, social, and governance excellence is recognized through our ESG certification.",
    buttonText: "Learn About Our Impact",
    buttonLink: "/esg-certificate",
    imageUrl: "/images/esg-certificate.jpg"
  }
};

export const useHomeContent = () => {
  const [content, setContent] = useState<HomeContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [heroData, brandsData, certificateData] = await Promise.all([
          getSectionContentById('hero-section'),
          getSectionContentById('brands-section'),
          getSectionContentById('certificate-section')
        ]);

        const newContent: HomeContent = {
          hero: {
            title: heroData?.title || defaultContent.hero.title,
            subtitle: heroData?.subtitle || defaultContent.hero.subtitle,
            description: heroData?.description || defaultContent.hero.description,
            buttonText: heroData?.buttonText || defaultContent.hero.buttonText,
            buttonLink: heroData?.buttonLink || defaultContent.hero.buttonLink,
            imageUrl: heroData?.imageUrl || defaultContent.hero.imageUrl,
            images: heroData?.images || defaultContent.hero.images,
            slides: heroData?.slides || defaultContent.hero.slides
          },
          brands: {
            title: brandsData?.title || defaultContent.brands.title,
            subtitle: brandsData?.subtitle || defaultContent.brands.subtitle,
            description: brandsData?.description || defaultContent.brands.description,
            buttonText: brandsData?.buttonText || defaultContent.brands.buttonText,
            buttonLink: brandsData?.buttonLink || defaultContent.brands.buttonLink,
            images: brandsData?.images || defaultContent.brands.images,
            badgeText: brandsData?.badgeText || defaultContent.brands.badgeText,
            bottomCtaText: brandsData?.bottomCtaText || defaultContent.brands.bottomCtaText,
            secondaryButtonText: brandsData?.secondaryButtonText || defaultContent.brands.secondaryButtonText,
            secondaryButtonLink: brandsData?.secondaryButtonLink || defaultContent.brands.secondaryButtonLink,
            brandLogos: brandsData?.brandLogos || defaultContent.brands.brandLogos
          },
          certificate: {
            title: certificateData?.title || defaultContent.certificate.title,
            subtitle: certificateData?.subtitle || defaultContent.certificate.subtitle,
            description: certificateData?.description || defaultContent.certificate.description,
            buttonText: certificateData?.buttonText || defaultContent.certificate.buttonText,
            buttonLink: certificateData?.buttonLink || defaultContent.certificate.buttonLink,
            imageUrl: certificateData?.imageUrl || defaultContent.certificate.imageUrl,
            images: certificateData?.images || defaultContent.certificate.images
          }
        };

        setContent(newContent);
      } catch (err) {
        setError('Failed to load content');
        // Keep default content on error
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeContent();
  }, []);

  return { content, isLoading, error };
};
