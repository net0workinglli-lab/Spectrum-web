'use client';

import Link from 'next/link';
import { Truck, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, Mail, Phone, MapPin, Globe } from 'lucide-react';
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
  const brandDescription = footerContent?.description || 'Leading provider of electric commercial vehicles. Experience zero-emission transportation with our premium electric trucks designed for efficiency and sustainability.';
  const newsletterTitle = footerContent?.subtitle || 'Stay Updated';
  const newsletterDescription = footerContent?.content || 'Subscribe to our newsletter for the latest EV truck models, charging infrastructure updates, and exclusive offers.';
  const copyrightText = footerContent?.buttonText || `© ${currentYear} Sunny Auto EV Motors. All rights reserved.`;
  const bottomText = footerContent?.secondaryButtonText || 'Driving the future of sustainable transportation';

  // Use footer links from CMS or fallback to defaults
  const footerLinks = {
    shop: footerContent?.shopLinks || defaultFooterLinks.shop,
    support: footerContent?.supportLinks || defaultFooterLinks.support,
    company: footerContent?.companyLinks || defaultFooterLinks.company,
    legal: footerContent?.legalLinks || defaultFooterLinks.legal,
  };

  // Menu titles - can be customized from CMS
  const menuTitles = {
    shop: footerContent?.shopTitle || 'Shop',
    support: footerContent?.supportTitle || 'Support',
    company: footerContent?.companyTitle || 'Company',
    legal: footerContent?.legalTitle || 'Legal',
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
    <footer className="bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 py-12 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {brandLogo ? (
                <img 
                  src={brandLogo} 
                  alt={brandName || 'Logo'} 
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <Truck className="h-12 w-12 text-emerald-600" />
              )}
              {brandName && (
                <span className="text-xl font-bold text-slate-900">{brandName}</span>
              )}
            </Link>
            <p className="text-sm text-slate-600 mb-6 max-w-md">
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
                    className="p-2 rounded-full bg-slate-100 hover:bg-emerald-600 hover:text-white transition-colors text-slate-700"
                  >
                    {IconComponent && <IconComponent className="h-5 w-5" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Shop */}
          {footerLinks.shop && footerLinks.shop.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-slate-900">{menuTitles.shop}</h3>
              <ul className="space-y-2">
                {footerLinks.shop.map((link, index) => (
                  <li key={(link as any).id || link.name || index}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Support */}
          {footerLinks.support && footerLinks.support.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4 text-slate-900">{menuTitles.support}</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link, index) => (
                  <li key={(link as any).id || link.name || index}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Company */}
          {footerLinks.company && footerLinks.company.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4 text-slate-900">{menuTitles.company}</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={(link as any).id || link.name || index}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal */}
          {footerLinks.legal && footerLinks.legal.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4 text-slate-900">{menuTitles.legal}</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link, index) => (
                  <li key={(link as any).id || link.name || index}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">
            {copyrightText}
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="/privacy-policy" className="hover:text-emerald-600 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-400">|</span>
            <Link href="/cookie-policy" className="hover:text-emerald-600 transition-colors">
              Cookie Policy
            </Link>
            {bottomText && (
              <>
                <span className="text-slate-400">|</span>
                <span>{bottomText}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
