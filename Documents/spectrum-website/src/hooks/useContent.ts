import { useState, useEffect } from 'react';
import { 
  getSectionContent, 
  getSectionContentById,
  getAllSections, 
  updateSectionContent
} from '@/lib/firebase-firestore';

// Firestore document interface
interface FirestoreContentData {
  [key: string]: unknown;
  heroTitle?: string;
  heroDescription?: string;
  benefitsTitle?: string;
  statsTitle?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  logoText?: string;
  logoImage?: string;
  topBarLeft?: string;
  topBarRight?: string;
  blogLinkText?: string;
  contactLinkText?: string;
  ecoFriendlyText?: string;
  ecoFriendlyLink?: string;
  communityText?: string;
  communityLink?: string;
  searchPlaceholder?: string;
  navigationItems?: DropdownItem[];
  navigationPosition?: 'before' | 'after';
  productsDropdown?: DropdownItem[];
  brandsDropdown?: DropdownItem[];
  lensesDropdown?: DropdownItem[];
  productsDropdownTitle?: string;
  brandsDropdownTitle?: string;
  lensesDropdownTitle?: string;
  shopLinks?: DropdownItem[];
  supportLinks?: DropdownItem[];
  companyLinks?: DropdownItem[];
  legalLinks?: DropdownItem[];
  socialLinks?: DropdownItem[];
  shopTitle?: string;
  supportTitle?: string;
  companyTitle?: string;
  legalTitle?: string;
  selectedProductIds?: string[];
  maxProducts?: number;
  // About page specific fields
  stat1?: string;
  stat2?: string;
  stat3?: string;
  stat4?: string;
  value1?: string;
  value2?: string;
  value3?: string;
  value4?: string;
  teamTitle?: string;
  teamDescription?: string;
  address?: string;
  phone?: string;
  email?: string;
  galleryTitle?: string;
  galleryDescription?: string;
  galleryImage1?: string;
  galleryImage2?: string;
  galleryImage3?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  // Team members fields
  member1Name?: string;
  member1Role?: string;
  member1Description?: string;
  member1Image?: string;
  member2Name?: string;
  member2Role?: string;
  member2Description?: string;
  member2Image?: string;
  member3Name?: string;
  member3Role?: string;
  member3Description?: string;
  member3Image?: string;
  // Products page specific fields
  filterButtonText?: string;
  itemsPerPageLabel?: string;
  allCategoriesLabel?: string;
  categoryFilterLabel?: string;
  sortLabel?: string;
  displayModeLabel?: string;
  priceRangeLabel?: string;
  clearFiltersText?: string;
  noProductsTitle?: string;
  noProductsMessage?: string;
  previousPageText?: string;
  nextPageText?: string;
  // Contact page specific fields
  formTitle?: string;
  formDescription?: string;
  submitButtonText?: string;
  infoTitle?: string;
  hotline?: string;
  supportEmail?: string;
  businessHours?: string;
  weekendHours?: string;
  socialTitle?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  quickInfoTitle?: string;
  responseTime?: string;
  supportLanguage?: string;
  consultationFree?: string;
  mapTitle?: string;
  mapEmbedUrl?: string;
  mapLat?: string;
  mapLng?: string;
  mapZoom?: string;
  showMap?: boolean;
}

export interface DropdownItem {
  id: string;
  name: string;
  href: string;
  icon?: string;
  position?: 'before' | 'after';
}

export interface ContentData {
  id: string;
  name: string;
  type: 'section' | 'page';
  title: string;
  subtitle: string;
  description: string;
  content: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  images?: string[]; // Array of images for sections with multiple images
  slides?: HeroSlide[]; // For hero slider sections
  status: 'published' | 'draft';
  category: string;
  lastModified: string;
  createdAt?: string;
  updatedAt?: string;
  // Certificate Section specific fields
  badgeText?: string;
  certificateTitle?: string;
  certificateSubtitle?: string;
  certificateDate?: string;
  whatThisMeansTitle?: string;
  whatThisMeansDescription?: string;
  bottomCtaText?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  // Brands Section specific fields
  brandLogos?: string[];
  
  // Premium Partners Page specific fields
  heroTitle?: string;
  heroDescription?: string;
  benefitsTitle?: string;
  statsTitle?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  
  // ESG Certificate Page specific fields
  esgPillarsTitle?: string;
  impactMetricsTitle?: string;
  certificationDetailsTitle?: string;
  
  // Header Section specific fields
  logoText?: string;
  logoImage?: string;
  topBarLeft?: string;
  topBarRight?: string;
  blogLinkText?: string;
  contactLinkText?: string;
  ecoFriendlyText?: string;
  ecoFriendlyLink?: string;
  communityText?: string;
  communityLink?: string;
  searchPlaceholder?: string;
  // New dropdown system
  navigationItems?: DropdownItem[];
  navigationPosition?: 'before' | 'after';
  productsDropdown?: DropdownItem[];
  brandsDropdown?: DropdownItem[];
  lensesDropdown?: DropdownItem[];
  productsDropdownTitle?: string;
  brandsDropdownTitle?: string;
  lensesDropdownTitle?: string;
  
  // Footer Section specific fields
  logoImage?: string; // Footer logo
  shopLinks?: DropdownItem[];
  supportLinks?: DropdownItem[];
  companyLinks?: DropdownItem[];
  legalLinks?: DropdownItem[];
  socialLinks?: DropdownItem[];
  shopTitle?: string;
  supportTitle?: string;
  companyTitle?: string;
  legalTitle?: string;
  
  // Featured Products Section specific fields
  selectedProductIds?: string[]; // Array of product IDs to display
  maxProducts?: number; // Maximum number of products to show
  
  // About page specific fields
  stat1?: string;
  stat2?: string;
  stat3?: string;
  stat4?: string;
  value1?: string;
  value2?: string;
  value3?: string;
  value4?: string;
  teamTitle?: string;
  teamDescription?: string;
  address?: string;
  phone?: string;
  email?: string;
  galleryTitle?: string;
  galleryDescription?: string;
  galleryImage1?: string;
  galleryImage2?: string;
  galleryImage3?: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  href: string;
}

export const useContent = (sectionId?: string) => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [allSections, setAllSections] = useState<ContentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load single section content
  useEffect(() => {
    if (!sectionId) return;

    const loadContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const sectionData = await getSectionContentById(sectionId);
        
        if (sectionData) {
          // Convert Firebase data to ContentData format
          const contentData: ContentData = {
            id: sectionData.id,
            name: (sectionData as any).name || getDefaultName(sectionId),
            type: (sectionData as any).type || (sectionId.includes('page') ? 'page' : 'section'),
            title: (sectionData as any).title || '',
            subtitle: (sectionData as any).subtitle || '',
            description: (sectionData as any).description || '',
            content: (sectionData as any).content || '',
            buttonText: (sectionData as any).buttonText || '',
            buttonLink: (sectionData as any).buttonLink || '',
            imageUrl: (sectionData as any).imageUrl || '',
            images: (sectionData as any).images || [],
            slides: (sectionData as any).slides || [],
            status: (sectionData as any).status || 'draft',
            category: (sectionData as any).category || getDefaultCategory(sectionId),
            lastModified: (sectionData as any).updatedAt ? 
              new Date((sectionData as any).updatedAt.seconds ? (sectionData as any).updatedAt.seconds * 1000 : (sectionData as any).updatedAt).toISOString().split('T')[0] :
              new Date().toISOString().split('T')[0],
            // Certificate Section specific fields
            badgeText: (sectionData as any).badgeText || '',
            certificateTitle: (sectionData as any).certificateTitle || '',
            certificateSubtitle: (sectionData as any).certificateSubtitle || '',
            certificateDate: (sectionData as any).certificateDate || '',
            whatThisMeansTitle: (sectionData as any).whatThisMeansTitle || '',
            whatThisMeansDescription: (sectionData as any).whatThisMeansDescription || '',
            bottomCtaText: (sectionData as any).bottomCtaText || '',
            secondaryButtonText: (sectionData as any).secondaryButtonText || '',
            secondaryButtonLink: (sectionData as any).secondaryButtonLink || '',
            // Brands Section specific fields
            brandLogos: (sectionData as any).brandLogos || [],
            // Premium Partners Page specific fields
            heroTitle: sectionData.heroTitle || '',
            heroDescription: sectionData.heroDescription || '',
            benefitsTitle: sectionData.benefitsTitle || '',
            statsTitle: sectionData.statsTitle || '',
            ctaTitle: sectionData.ctaTitle || '',
            ctaDescription: sectionData.ctaDescription || '',
            // Header Section specific fields
            logoText: sectionData.logoText || '',
            logoImage: sectionData.logoImage || '',
            topBarLeft: sectionData.topBarLeft || '',
            topBarRight: sectionData.topBarRight || '',
            blogLinkText: sectionData.blogLinkText || '',
            contactLinkText: sectionData.contactLinkText || '',
            ecoFriendlyText: sectionData.ecoFriendlyText || '',
            ecoFriendlyLink: sectionData.ecoFriendlyLink || '',
            communityText: sectionData.communityText || '',
            communityLink: sectionData.communityLink || '',
            searchPlaceholder: sectionData.searchPlaceholder || '',
            // New dropdown system
            navigationItems: sectionData.navigationItems || [],
            navigationPosition: sectionData.navigationPosition || 'before',
            productsDropdown: sectionData.productsDropdown || [],
            brandsDropdown: sectionData.brandsDropdown || [],
            lensesDropdown: sectionData.lensesDropdown || [],
            productsDropdownTitle: sectionData.productsDropdownTitle || '',
            brandsDropdownTitle: sectionData.brandsDropdownTitle || '',
            lensesDropdownTitle: sectionData.lensesDropdownTitle || '',
            // Footer Section specific fields
            shopLinks: sectionData.shopLinks || [],
            supportLinks: sectionData.supportLinks || [],
            companyLinks: sectionData.companyLinks || [],
            legalLinks: sectionData.legalLinks || [],
            socialLinks: sectionData.socialLinks || [],
            shopTitle: sectionData.shopTitle || 'Shop',
            supportTitle: sectionData.supportTitle || 'Support',
            companyTitle: sectionData.companyTitle || 'Company',
            legalTitle: sectionData.legalTitle || 'Legal',
            // Featured Products Section specific fields
            selectedProductIds: sectionData.selectedProductIds || [],
            maxProducts: sectionData.maxProducts || 4,
            // About page specific fields
            stat1: sectionData.stat1 || '',
            stat2: sectionData.stat2 || '',
            stat3: sectionData.stat3 || '',
            stat4: sectionData.stat4 || '',
            value1: sectionData.value1 || '',
            value2: sectionData.value2 || '',
            value3: sectionData.value3 || '',
            value4: sectionData.value4 || '',
            teamTitle: sectionData.teamTitle || '',
            teamDescription: sectionData.teamDescription || '',
            address: sectionData.address || '',
            phone: sectionData.phone || '',
            email: sectionData.email || '',
            galleryTitle: sectionData.galleryTitle || '',
            galleryDescription: sectionData.galleryDescription || '',
            galleryImage1: sectionData.galleryImage1 || '',
            galleryImage2: sectionData.galleryImage2 || '',
            galleryImage3: sectionData.galleryImage3 || '',
            // Team members
            member1Name: sectionData.member1Name || '',
            member1Role: sectionData.member1Role || '',
            member1Description: sectionData.member1Description || '',
            member1Image: sectionData.member1Image || '',
            member2Name: sectionData.member2Name || '',
            member2Role: sectionData.member2Role || '',
            member2Description: sectionData.member2Description || '',
            member2Image: sectionData.member2Image || '',
            member3Name: sectionData.member3Name || '',
            member3Role: sectionData.member3Role || '',
            member3Description: sectionData.member3Description || '',
            member3Image: sectionData.member3Image || '',
            // Contact page specific fields
            formTitle: sectionData.formTitle || 'Gửi tin nhắn cho chúng tôi',
            formDescription: sectionData.formDescription || 'Điền thông tin bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể.',
            submitButtonText: sectionData.submitButtonText || 'Gửi tin nhắn',
            infoTitle: sectionData.infoTitle || 'Thông tin liên hệ',
            hotline: sectionData.hotline || 'Hotline: 1900 1234',
            supportEmail: sectionData.supportEmail || 'support@spectrum.com',
            businessHours: sectionData.businessHours || 'Thứ 2 - Thứ 6: 8:00 - 18:00',
            weekendHours: sectionData.weekendHours || 'Thứ 7: 8:00 - 12:00',
            socialTitle: sectionData.socialTitle || 'Kết nối với chúng tôi',
            facebookUrl: sectionData.facebookUrl || 'https://facebook.com/spectrum.eyecare',
            instagramUrl: sectionData.instagramUrl || 'https://instagram.com/spectrum.eyecare',
            twitterUrl: sectionData.twitterUrl || 'https://twitter.com/spectrum_eyecare',
            linkedinUrl: sectionData.linkedinUrl || 'https://linkedin.com/company/spectrum-eyecare',
            quickInfoTitle: sectionData.quickInfoTitle || 'Thông tin nhanh',
            responseTime: sectionData.responseTime || 'Phản hồi trong 24h',
            supportLanguage: sectionData.supportLanguage || 'Hỗ trợ tiếng Việt & English',
            consultationFree: sectionData.consultationFree || 'Tư vấn miễn phí',
            mapTitle: sectionData.mapTitle || 'Vị trí của chúng tôi',
            mapEmbedUrl: sectionData.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.921690491891!2d106.72869727547798!3d10.817304789333951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527844d7e6a45%3A0xedaeefbaf55796d!2sSpectrum%20Eyecare!5e0!3m2!1svi!2s!4v1758169698616!5m2!1svi!2s',
            mapLat: sectionData.mapLat || '10.8231',
            mapLng: sectionData.mapLng || '106.6297',
            mapZoom: sectionData.mapZoom || '15',
            showMap: sectionData.showMap !== false
          };
          
          setContent(contentData);
        } else {
          // If no content exists, create default structure
          const defaultContent: ContentData = {
            id: sectionId,
            name: getDefaultName(sectionId),
            type: sectionId.includes('page') ? 'page' : 'section',
            title: sectionId === 'featured-products-section' ? 'Our Most Popular Eyewear' : '',
            subtitle: '',
            description: sectionId === 'featured-products-section' ? 'Discover the eyewear that our customers love most. From classic designs to modern trends.' : '',
            content: '',
            buttonText: sectionId === 'featured-products-section' ? 'View All Products' : '',
            buttonLink: sectionId === 'featured-products-section' ? '/products' : '',
            imageUrl: '',
            images: [],
            slides: sectionId === 'hero-section' ? [
              { id: 1, title: '', subtitle: '', image: '', cta: '', href: '' },
              { id: 2, title: '', subtitle: '', image: '', cta: '', href: '' },
              { id: 3, title: '', subtitle: '', image: '', cta: '', href: '' }
            ] : [],
            status: 'draft',
            category: getDefaultCategory(sectionId),
            lastModified: new Date().toISOString().split('T')[0],
            // Certificate Section specific fields
            badgeText: sectionId === 'certificate-section' ? 'Chứng nhận ESG' : 
                      (sectionId === 'brands-section' ? '✨ Premium Partners' : 
                      (sectionId === 'featured-products-section' ? 'Featured Collection' : '')),
            certificateTitle: sectionId === 'certificate-section' ? 'Synesgy ESG Certificate' : '',
            certificateSubtitle: sectionId === 'certificate-section' ? 'Awarded to Spectrum Eyecare' : '',
            certificateDate: sectionId === 'certificate-section' ? 'May 5, 2025' : '',
            whatThisMeansTitle: sectionId === 'certificate-section' ? 'What This Means for You' : '',
            whatThisMeansDescription: sectionId === 'certificate-section' ? 'This certification demonstrates our commitment to sustainable practices, ethical business operations, and environmental responsibility in the eyewear industry.' : '',
            bottomCtaText: sectionId === 'certificate-section' ? 'Join us in our mission to create a more sustainable future for eyewear.' : (sectionId === 'brands-section' ? 'Discover our complete collection of premium eyewear from these trusted brands' : ''),
            secondaryButtonText: sectionId === 'certificate-section' ? 'View Full Report' : (sectionId === 'brands-section' ? 'View Brand Stories' : ''),
            secondaryButtonLink: sectionId === 'certificate-section' ? '/esg-certificate' : (sectionId === 'brands-section' ? '/premium-partners' : ''),
            // Brands Section specific fields
            brandLogos: sectionId === 'brands-section' ? [] : [],
            // Premium Partners Page specific fields
            heroTitle: sectionId === 'premium-partners-page' ? 'Trusted by Leading Brands' : (sectionId === 'esg-certificate-page' ? 'Among Vietnam\'s First Sustainable Eyewear Retailers' : ''),
            heroDescription: sectionId === 'premium-partners-page' ? 'We partner with the world\'s most prestigious eyewear brands to bring you the finest selection of sunglasses and eyeglasses. Our exclusive partnerships ensure you have access to the latest collections and limited editions.' : (sectionId === 'esg-certificate-page' ? 'On May 5, 2025, Spectrum Eyecare was awarded the prestigious Synesgy Environmental, Social, and Governance (ESG) Certificate, recognizing our commitment to sustainable practices and ethical business operations.' : ''),
            benefitsTitle: sectionId === 'premium-partners-page' ? 'Why Partner with Us?' : '',
            statsTitle: sectionId === 'premium-partners-page' ? 'Partnership Statistics' : '',
            ctaTitle: sectionId === 'premium-partners-page' ? 'Interested in Partnership?' : (sectionId === 'esg-certificate-page' ? 'Join Us in Our Mission' : ''),
            ctaDescription: sectionId === 'premium-partners-page' ? 'We\'re always looking for new premium brands to partner with. Join our exclusive network and reach discerning customers worldwide.' : (sectionId === 'esg-certificate-page' ? 'Together, we can create a more sustainable future for eyewear. Learn more about our initiatives and how you can contribute to positive change.' : ''),
            // ESG Certificate Page specific fields
            esgPillarsTitle: sectionId === 'esg-certificate-page' ? 'Our ESG Pillars' : '',
            impactMetricsTitle: sectionId === 'esg-certificate-page' ? 'Our Impact Metrics' : '',
            certificationDetailsTitle: sectionId === 'esg-certificate-page' ? 'Certification Details' : '',
            // About page default values
            stat1: sectionId === 'about-page' ? '10,000+' : '',
            stat2: sectionId === 'about-page' ? '500+' : '',
            stat3: sectionId === 'about-page' ? '15+' : '',
            stat4: sectionId === 'about-page' ? '5+' : '',
            value1: sectionId === 'about-page' ? 'We source only the finest materials and work with premium brands to ensure exceptional quality.' : '',
            value2: sectionId === 'about-page' ? 'Your satisfaction is our priority. We provide personalized service and expert guidance.' : '',
            value3: sectionId === 'about-page' ? 'We embrace the latest technology and trends to offer cutting-edge eyewear solutions.' : '',
            value4: sectionId === 'about-page' ? 'Committed to eco-friendly practices and responsible business operations.' : '',
            teamTitle: sectionId === 'about-page' ? 'Our Expert Team' : '',
            teamDescription: sectionId === 'about-page' ? 'Meet the passionate professionals who make Spectrum exceptional.' : '',
            address: sectionId === 'about-page' ? 'Ho Chi Minh City, Vietnam' : '',
            phone: sectionId === 'about-page' ? '+84 123 456 789' : '',
            email: sectionId === 'about-page' ? 'info@spectrum.com' : '',
            galleryTitle: sectionId === 'about-page' ? 'Our Store & Workshop' : '',
            galleryDescription: sectionId === 'about-page' ? 'Take a look inside our modern facility and professional workspace' : '',
            galleryImage1: '',
            galleryImage2: '',
            galleryImage3: '',
            // Team members defaults
            member1Name: sectionId === 'about-page' ? 'Dr. Nguyen Phuoc Sang' : '',
            member1Role: sectionId === 'about-page' ? 'Founder & CEO' : '',
            member1Description: sectionId === 'about-page' ? 'Visionary leader with 15+ years in optical industry' : '',
            member1Image: '',
            member2Name: sectionId === 'about-page' ? 'Dr. Tran Minh Duc' : '',
            member2Role: sectionId === 'about-page' ? 'Chief Optometrist' : '',
            member2Description: sectionId === 'about-page' ? 'Expert in vision care with international certifications' : '',
            member2Image: '',
            member3Name: sectionId === 'about-page' ? 'Le Thi Mai' : '',
            member3Role: sectionId === 'about-page' ? 'Customer Experience Manager' : '',
            member3Description: sectionId === 'about-page' ? 'Ensuring every customer receives exceptional service' : '',
            member3Image: '',
            // Contact page default values
            formTitle: sectionId === 'contact-page' ? 'Gửi tin nhắn cho chúng tôi' : '',
            formDescription: sectionId === 'contact-page' ? 'Điền thông tin bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể.' : '',
            submitButtonText: sectionId === 'contact-page' ? 'Gửi tin nhắn' : '',
            infoTitle: sectionId === 'contact-page' ? 'Thông tin liên hệ' : '',
            hotline: sectionId === 'contact-page' ? 'Hotline: 1900 1234' : '',
            supportEmail: sectionId === 'contact-page' ? 'support@spectrum.com' : '',
            businessHours: sectionId === 'contact-page' ? 'Thứ 2 - Thứ 6: 8:00 - 18:00' : '',
            weekendHours: sectionId === 'contact-page' ? 'Thứ 7: 8:00 - 12:00' : '',
            socialTitle: sectionId === 'contact-page' ? 'Kết nối với chúng tôi' : '',
            facebookUrl: sectionId === 'contact-page' ? 'https://facebook.com/spectrum.eyecare' : '',
            instagramUrl: sectionId === 'contact-page' ? 'https://instagram.com/spectrum.eyecare' : '',
            twitterUrl: sectionId === 'contact-page' ? 'https://twitter.com/spectrum_eyecare' : '',
            linkedinUrl: sectionId === 'contact-page' ? 'https://linkedin.com/company/spectrum-eyecare' : '',
            quickInfoTitle: sectionId === 'contact-page' ? 'Thông tin nhanh' : '',
            responseTime: sectionId === 'contact-page' ? 'Phản hồi trong 24h' : '',
            supportLanguage: sectionId === 'contact-page' ? 'Hỗ trợ tiếng Việt & English' : '',
            consultationFree: sectionId === 'contact-page' ? 'Tư vấn miễn phí' : '',
            mapTitle: sectionId === 'contact-page' ? 'Vị trí của chúng tôi' : '',
            mapEmbedUrl: sectionId === 'contact-page' ? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.921690491891!2d106.72869727547798!3d10.817304789333951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527844d7e6a45%3A0xedaeefbaf55796d!2sSpectrum%20Eyecare!5e0!3m2!1svi!2s!4v1758169698616!5m2!1svi!2s' : '',
            mapLat: sectionId === 'contact-page' ? '10.8231' : '',
            mapLng: sectionId === 'contact-page' ? '106.6297' : '',
            mapZoom: sectionId === 'contact-page' ? '15' : '',
            showMap: sectionId === 'contact-page' ? true : false
          };
          setContent(defaultContent);
        }
      } catch (err) {
        console.error('❌ Error loading content:', err);
        setError('Failed to load content');
        
        // Fallback to default content
        const defaultContent: ContentData = {
          id: sectionId,
          name: getDefaultName(sectionId),
          type: sectionId.includes('page') ? 'page' : 'section',
          title: '',
          subtitle: '',
          description: '',
          content: '',
          buttonText: '',
          buttonLink: '',
          imageUrl: '',
          images: [],
          slides: sectionId === 'hero-section' ? [
            { id: 1, title: '', subtitle: '', image: '', cta: '', href: '' },
            { id: 2, title: '', subtitle: '', image: '', cta: '', href: '' },
            { id: 3, title: '', subtitle: '', image: '', cta: '', href: '' }
          ] : [],
          status: 'draft',
          category: getDefaultCategory(sectionId),
          lastModified: new Date().toISOString().split('T')[0],
          // Certificate Section specific fields
          badgeText: sectionId === 'certificate-section' ? 'Chứng nhận ESG' : (sectionId === 'brands-section' ? '✨ Premium Partners' : ''),
          certificateTitle: sectionId === 'certificate-section' ? 'Synesgy ESG Certificate' : '',
          certificateSubtitle: sectionId === 'certificate-section' ? 'Awarded to Spectrum Eyecare' : '',
          certificateDate: sectionId === 'certificate-section' ? 'May 5, 2025' : '',
          whatThisMeansTitle: sectionId === 'certificate-section' ? 'What This Means for You' : '',
          whatThisMeansDescription: sectionId === 'certificate-section' ? 'This certification demonstrates our commitment to sustainable practices, ethical business operations, and environmental responsibility in the eyewear industry.' : '',
          bottomCtaText: sectionId === 'certificate-section' ? 'Join us in our mission to create a more sustainable future for eyewear.' : (sectionId === 'brands-section' ? 'Discover our complete collection of premium eyewear from these trusted brands' : ''),
          secondaryButtonText: sectionId === 'certificate-section' ? 'View Full Report' : (sectionId === 'brands-section' ? 'View Brand Stories' : ''),
          secondaryButtonLink: sectionId === 'certificate-section' ? '/esg-certificate' : (sectionId === 'brands-section' ? '/premium-partners' : ''),
          // Brands Section specific fields
          brandLogos: sectionId === 'brands-section' ? [] : [],
          // Premium Partners Page specific fields
          heroTitle: sectionId === 'premium-partners-page' ? 'Trusted by Leading Brands' : (sectionId === 'esg-certificate-page' ? 'Among Vietnam\'s First Sustainable Eyewear Retailers' : ''),
          heroDescription: sectionId === 'premium-partners-page' ? 'We partner with the world\'s most prestigious eyewear brands to bring you the finest selection of sunglasses and eyeglasses. Our exclusive partnerships ensure you have access to the latest collections and limited editions.' : (sectionId === 'esg-certificate-page' ? 'On May 5, 2025, Spectrum Eyecare was awarded the prestigious Synesgy Environmental, Social, and Governance (ESG) Certificate, recognizing our commitment to sustainable practices and ethical business operations.' : ''),
          benefitsTitle: sectionId === 'premium-partners-page' ? 'Why Partner with Us?' : '',
          statsTitle: sectionId === 'premium-partners-page' ? 'Partnership Statistics' : '',
          ctaTitle: sectionId === 'premium-partners-page' ? 'Interested in Partnership?' : (sectionId === 'esg-certificate-page' ? 'Join Us in Our Mission' : ''),
          ctaDescription: sectionId === 'premium-partners-page' ? 'We\'re always looking for new premium brands to partner with. Join our exclusive network and reach discerning customers worldwide.' : (sectionId === 'esg-certificate-page' ? 'Together, we can create a more sustainable future for eyewear. Learn more about our initiatives and how you can contribute to positive change.' : ''),
          // ESG Certificate Page specific fields
          esgPillarsTitle: sectionId === 'esg-certificate-page' ? 'Our ESG Pillars' : '',
          impactMetricsTitle: sectionId === 'esg-certificate-page' ? 'Our Impact Metrics' : '',
          certificationDetailsTitle: sectionId === 'esg-certificate-page' ? 'Certification Details' : '',
          // Header Section specific fields
          logoText: sectionId === 'header-section' ? 'Spectrum' : '',
            logoImage: sectionId === 'header-section' ? '' : (sectionId === 'footer-section' ? '' : ''),
          topBarLeft: sectionId === 'header-section' ? 'Free consultation and eye exam' : '',
          topBarRight: sectionId === 'header-section' ? '30-day return policy' : '',
          blogLinkText: sectionId === 'header-section' ? 'Blog' : '',
          contactLinkText: sectionId === 'header-section' ? 'Contact' : '',
          ecoFriendlyText: sectionId === 'header-section' ? 'Eco-friendly' : '',
          ecoFriendlyLink: sectionId === 'header-section' ? '/eco-friendly' : '',
          communityText: sectionId === 'header-section' ? 'Community' : '',
          communityLink: sectionId === 'header-section' ? '/community' : '',
          searchPlaceholder: sectionId === 'header-section' ? 'Search glasses, brands...' : '',
          // New dropdown system
          navigationPosition: sectionId === 'header-section' ? 'before' : 'before',
          productsDropdown: sectionId === 'header-section' ? [
            { id: 'sunglasses', name: 'Sunglasses', href: '/products?category=sunglasses', icon: 'Sun' },
            { id: 'eyeglasses', name: 'Eyeglasses', href: '/products?category=eyeglasses', icon: 'Glasses' },
            { id: 'reading', name: 'Reading Glasses', href: '/products?category=reading', icon: 'BookOpen' },
            { id: 'contact', name: 'Contact Lenses', href: '/products?category=contact', icon: 'Eye' }
          ] : [],
          brandsDropdown: sectionId === 'header-section' ? [
            { id: 'rayban', name: 'Ray-Ban', href: '/brands?brand=rayban', icon: 'Shield' },
            { id: 'oakley', name: 'Oakley', href: '/brands?brand=oakley', icon: 'Zap' },
            { id: 'persol', name: 'Persol', href: '/brands?brand=persol', icon: 'Star' },
            { id: 'warby', name: 'Warby Parker', href: '/brands?brand=warby', icon: 'Heart' },
            { id: 'tomford', name: 'Tom Ford', href: '/brands?brand=tomford', icon: 'Crown' },
            { id: 'gucci', name: 'Gucci', href: '/brands?brand=gucci', icon: 'Gem' },
            { id: 'prada', name: 'Prada', href: '/brands?brand=prada', icon: 'Diamond' },
            { id: 'versace', name: 'Versace', href: '/brands?brand=versace', icon: 'Sparkles' }
          ] : [],
          lensesDropdown: sectionId === 'header-section' ? [
            { id: 'essilor', name: 'Essilor', href: '/essilor', icon: 'Target' },
            { id: 'zeiss', name: 'Zeiss', href: '/zeiss', icon: 'Aperture' },
            { id: 'hoya', name: 'Hoya', href: '/hoya', icon: 'Circle' },
            { id: 'nikon', name: 'Nikon', href: '/nikon', icon: 'Camera' }
          ] : [],
          // Footer Section specific fields
          shopLinks: sectionId === 'footer-section' ? [
            { id: 'sunglasses', name: 'Sunglasses', href: '/products?category=sunglasses', icon: 'Sun' },
            { id: 'eyeglasses', name: 'Eyeglasses', href: '/products?category=eyeglasses', icon: 'Glasses' },
            { id: 'reading', name: 'Reading Glasses', href: '/products?category=reading-glasses', icon: 'BookOpen' },
            { id: 'contact', name: 'Contact Lenses', href: '/products?category=contact-lenses', icon: 'Eye' },
            { id: 'accessories', name: 'Accessories', href: '/products?category=accessories', icon: 'ShoppingBag' }
          ] : [],
          supportLinks: sectionId === 'footer-section' ? [
            { id: 'size-guide', name: 'Size Guide', href: '#', icon: 'Info' },
            { id: 'prescription', name: 'Prescription Guide', href: '#', icon: 'Eye' },
            { id: 'shipping', name: 'Shipping Info', href: '#', icon: 'Truck' },
            { id: 'returns', name: 'Returns', href: '#', icon: 'RotateCcw' },
            { id: 'warranty', name: 'Warranty', href: '#', icon: 'Shield' }
          ] : [],
          companyLinks: sectionId === 'footer-section' ? [
            { id: 'about', name: 'About Us', href: '#', icon: 'Info' },
            { id: 'blog', name: 'Blog', href: '/blog', icon: 'FileText' },
            { id: 'careers', name: 'Careers', href: '#', icon: 'Users' },
            { id: 'press', name: 'Press', href: '#', icon: 'FileText' },
            { id: 'contact', name: 'Contact', href: '#', icon: 'Phone' }
          ] : [],
          legalLinks: sectionId === 'footer-section' ? [
            { id: 'privacy', name: 'Privacy Policy', href: '#', icon: 'Shield' },
            { id: 'terms', name: 'Terms of Service', href: '#', icon: 'FileText' },
            { id: 'cookies', name: 'Cookie Policy', href: '#', icon: 'Shield' },
            { id: 'accessibility', name: 'Accessibility', href: '#', icon: 'Info' }
          ] : [],
          socialLinks: sectionId === 'footer-section' ? [
            { id: 'facebook', name: 'Facebook', href: '#', icon: 'Facebook' },
            { id: 'twitter', name: 'Twitter', href: '#', icon: 'Twitter' },
            { id: 'instagram', name: 'Instagram', href: '#', icon: 'Instagram' },
            { id: 'youtube', name: 'YouTube', href: '#', icon: 'Youtube' }
          ] : [],
          shopTitle: sectionId === 'footer-section' ? 'Shop' : '',
          supportTitle: sectionId === 'footer-section' ? 'Support' : '',
          companyTitle: sectionId === 'footer-section' ? 'Company' : '',
          legalTitle: sectionId === 'footer-section' ? 'Legal' : '',
          // Featured Products Section specific fields
          selectedProductIds: sectionId === 'featured-products-section' ? [] : [],
          maxProducts: sectionId === 'featured-products-section' ? 4 : undefined
        };
        setContent(defaultContent);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [sectionId]);

  // Load all sections
  useEffect(() => {
    const loadAllSections = async () => {
      try {
        const sections = await getAllSections();
        setAllSections(sections as ContentData[]);
      } catch (err) {
        console.error('Error loading all sections:', err);
      }
    };

    loadAllSections();
  }, []);

  const saveContent = async (contentData: Partial<ContentData>) => {
    if (!sectionId) return;

    try {
      setIsSaving(true);
      setError(null);

      // Check if document exists by trying to get it first
      const existingContent = await getSectionContentById(sectionId);
      
      if (existingContent) {
        // Update existing content
        await updateSectionContent(sectionId, {
          ...contentData,
          updatedAt: new Date()
        });
      } else {
        // Create new content using updateSectionContent with setDoc
        await updateSectionContent(sectionId, {
          ...contentData,
          id: sectionId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setContent({ ...contentData, id: sectionId } as ContentData);
      }

      // Update local state
      setContent(prev => prev ? { ...prev, ...contentData } : null);
      
      return true;
    } catch (err) {
      console.error('Error saving content:', err);
      setError('Failed to save content');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = (updates: Partial<ContentData>) => {
    setContent(prev => prev ? { ...prev, ...updates } : null);
  };

  return {
    content,
    allSections,
    isLoading,
    isSaving,
    error,
    saveContent,
    updateContent,
    setError
  };
};

// Helper functions
const getDefaultName = (sectionId: string): string => {
  const nameMap: { [key: string]: string } = {
    'hero-section': 'Hero Section',
    'featured-products-section': 'Featured Products Section',
    'stats-section': 'Stats Section',
    'brands-section': 'Brands Section',
    'certificate-section': 'Certificate Section',
    'categories-section': 'Categories Section',
    'lenses-section': 'Lenses Section',
    'cta-section': 'CTA Section',
    'about-page': 'About Page',
    'contact-page': 'Contact Page',
    'products-page': 'Products Page',
    'blog-page': 'Blog Page',
    'premium-partners-page': 'Premium Partners Page',
    'esg-certificate-page': 'ESG Certificate Page',
    'header-section': 'Header Section',
    'footer-section': 'Footer Section'
  };
  return nameMap[sectionId] || 'Unknown Content';
};

const getDefaultCategory = (sectionId: string): string => {
  if (sectionId.includes('page')) return 'pages';
  if (sectionId.includes('hero') || sectionId.includes('brands') || sectionId.includes('certificate')) {
    return 'homepage';
  }
  if (sectionId.includes('header') || sectionId.includes('footer')) {
    return 'global';
  }
  return 'global';
};
