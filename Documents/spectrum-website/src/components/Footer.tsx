'use client';

import Link from 'next/link';
import { Glasses, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { useContent } from '@/hooks/useContent';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { content: footerContent, isLoading } = useContent('footer-section');

  // Default fallback data
  const defaultFooterLinks = {
    shop: [
      { name: 'Sunglasses', href: '/products?category=sunglasses' },
      { name: 'Eyeglasses', href: '/products?category=eyeglasses' },
      { name: 'Reading Glasses', href: '/products?category=reading-glasses' },
      { name: 'Contact Lenses', href: '/products?category=contact-lenses' },
      { name: 'Accessories', href: '/products?category=accessories' },
    ],
    support: [
      { name: 'Size Guide', href: '#' },
      { name: 'Prescription Guide', href: '#' },
      { name: 'Shipping Info', href: '#' },
      { name: 'Returns', href: '#' },
      { name: 'Warranty', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Accessibility', href: '#' },
    ],
  };

  const defaultSocialLinks = [
    { id: 'facebook', name: 'Facebook', href: '#', icon: Facebook },
    { id: 'twitter', name: 'Twitter', href: '#', icon: Twitter },
    { id: 'instagram', name: 'Instagram', href: '#', icon: Instagram },
    { id: 'youtube', name: 'YouTube', href: '#', icon: Youtube },
  ];

  // Use content from CMS or fallback to defaults
  const brandName = footerContent?.title;
  const brandLogo = footerContent?.logoImage;
  const brandDescription = footerContent?.description || 'Discover the perfect eyewear that complements your style and protects your vision. From trendy sunglasses to prescription glasses, we have everything you need.';
  const newsletterTitle = footerContent?.subtitle || 'Stay Updated';
  const newsletterDescription = footerContent?.content || 'Subscribe to our newsletter for the latest trends and exclusive offers.';
  const copyrightText = footerContent?.buttonText || `© ${currentYear} Spectrum. All rights reserved.`;
  const bottomText = footerContent?.secondaryButtonText || 'Made with ❤️ for your vision';

  // Use footer links from CMS or fallback to defaults
  const footerLinks = {
    shop: footerContent?.shopLinks || defaultFooterLinks.shop,
    support: footerContent?.supportLinks || defaultFooterLinks.support,
    company: footerContent?.companyLinks || defaultFooterLinks.company,
    legal: footerContent?.legalLinks || defaultFooterLinks.legal,
  };
  
  // Helper function to get icon component from name
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'Facebook': Facebook,
      'Twitter': Twitter,
      'Instagram': Instagram,
      'Youtube': Youtube,
      'YouTube': Youtube,
      'Linkedin': Linkedin,
      'Github': Github,
      'Mail': Mail,
      'Phone': Phone,
      'MapPin': MapPin,
      'Globe': Globe,
    };
    return iconMap[iconName] || Facebook;
  };

  // Process social links to ensure icons are properly mapped
  const socialLinks = (footerContent?.socialLinks || defaultSocialLinks).map(link => ({
    ...link,
    icon: typeof link.icon === 'string' ? getIconComponent(link.icon) : link.icon
  }));

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {brandLogo ? (
                <img 
                  src={brandLogo} 
                  alt={brandName || 'Logo'} 
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <Glasses className="h-8 w-8 text-primary" />
              )}
              {brandName && (
                <span className="text-2xl font-bold">{brandName}</span>
              )}
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              {brandDescription}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.id || social.name}
                    href={social.href || '#'}
                    className="p-2 rounded-full bg-white hover:bg-primary hover:text-white transition-colors"
                  >
                    {IconComponent && <IconComponent className="h-5 w-5" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.id || link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.id || link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.id || link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.id || link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t pt-8 mt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold mb-2">{newsletterTitle}</h3>
            <p className="text-muted-foreground mb-4">
              {newsletterDescription}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  // Newsletter subscription logic here
                  console.log('Newsletter subscription clicked');
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            {copyrightText}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{bottomText}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
