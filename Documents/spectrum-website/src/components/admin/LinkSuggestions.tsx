'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Home,
  ShoppingBag,
  Users,
  Info,
  Mail,
  Phone,
  MapPin,
  FileText,
  Shield,
  Star,
  Heart,
  Zap,
  Crown,
  Gem,
  Target,
  Camera,
  Clock,
  Square,
  Sun,
  Glasses,
  BookOpen,
  Eye,
  Diamond,
  Sparkles,
  Aperture,
  Circle,
  Hexagon,
  Triangle,
  Settings,
  Truck,
  RotateCcw,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  Globe
} from 'lucide-react';

interface LinkSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  category?: 'products' | 'brands' | 'lenses' | 'general' | 'social';
}

// Link suggestions organized by category - Updated with actual website pages
const linkSuggestions = {
  products: [
    { label: 'All Products', href: '/products', icon: 'ShoppingBag' },
    { label: 'Sunglasses', href: '/products?category=sunglasses', icon: 'Sun' },
    { label: 'Eyeglasses', href: '/products?category=eyeglasses', icon: 'Glasses' },
    { label: 'Reading Glasses', href: '/products?category=reading', icon: 'BookOpen' },
    { label: 'Contact Lenses', href: '/products?category=contact', icon: 'Eye' },
    { label: 'Product Details', href: '/product-detail', icon: 'Info' },
    { label: 'Premium Partners', href: '/premium-partners', icon: 'Crown' },
    { label: 'All Brands', href: '/brands', icon: 'Shield' },
  ],
  brands: [
    { label: 'All Brands', href: '/brands', icon: 'Shield' },
    { label: 'ZEISS', href: '/zeiss', icon: 'Target' },
    { label: 'HOYA', href: '/hoya', icon: 'Gem' },
    { label: 'Nikon', href: '/nikon', icon: 'Camera' },
    { label: 'Essilor', href: '/essilor', icon: 'Eye' },
    { label: 'Premium Partners', href: '/premium-partners', icon: 'Crown' },
  ],
  lenses: [
    { label: 'ZEISS Lenses', href: '/zeiss', icon: 'Target' },
    { label: 'HOYA Lenses', href: '/hoya', icon: 'Gem' },
    { label: 'Nikon Lenses', href: '/nikon', icon: 'Camera' },
    { label: 'Essilor Lenses', href: '/essilor', icon: 'Eye' },
    { label: 'All Brands', href: '/brands', icon: 'Shield' },
  ],
  general: [
    { label: 'Home', href: '/', icon: 'Home' },
    { label: 'Products', href: '/products', icon: 'ShoppingBag' },
    { label: 'Brands', href: '/brands', icon: 'Shield' },
    { label: 'Blog', href: '/blog', icon: 'FileText' },
    { label: 'Blog Detail', href: '/blog-detail', icon: 'BookOpen' },
    { label: 'Community', href: '/community', icon: 'Users' },
    { label: 'Eco-Friendly', href: '/eco-friendly', icon: 'Heart' },
    { label: 'ESG Certificate', href: '/esg-certificate', icon: 'Shield' },
    { label: 'Premium Partners', href: '/premium-partners', icon: 'Crown' },
    { label: 'Profile', href: '/profile', icon: 'Users' },
    { label: 'Settings', href: '/settings', icon: 'Settings' },
    { label: 'ZEISS', href: '/zeiss', icon: 'Target' },
    { label: 'HOYA', href: '/hoya', icon: 'Gem' },
    { label: 'Nikon', href: '/nikon', icon: 'Camera' },
    { label: 'Essilor', href: '/essilor', icon: 'Eye' },
  ],
  social: [
    { label: 'Facebook Page', href: 'https://facebook.com/spectrum', icon: 'Facebook' },
    { label: 'Instagram', href: 'https://instagram.com/spectrum', icon: 'Instagram' },
    { label: 'Twitter', href: 'https://twitter.com/spectrum', icon: 'Twitter' },
    { label: 'YouTube Channel', href: 'https://youtube.com/spectrum', icon: 'Youtube' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/spectrum', icon: 'Linkedin' },
    { label: 'GitHub', href: 'https://github.com/spectrum', icon: 'Github' },
    { label: 'Email Contact', href: 'mailto:support@spectrum.com', icon: 'Mail' },
    { label: 'Phone Contact', href: 'tel:+84123456789', icon: 'Phone' },
    { label: 'Store Location', href: 'https://maps.google.com', icon: 'MapPin' },
    { label: 'Official Website', href: 'https://spectrum.com', icon: 'Globe' },
  ]
};

// Icon component to render the correct icon based on name
const IconRenderer = ({ iconName, className = "h-4 w-4" }: { iconName: string; className?: string }) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'Home': Home,
    'ShoppingBag': ShoppingBag,
    'Users': Users,
    'Info': Info,
    'Mail': Mail,
    'Phone': Phone,
    'MapPin': MapPin,
    'FileText': FileText,
    'Shield': Shield,
    'Star': Star,
    'Heart': Heart,
    'Zap': Zap,
    'Crown': Crown,
    'Gem': Gem,
    'Target': Target,
    'Camera': Camera,
    'Clock': Clock,
    'Square': Square,
    'Sun': Sun,
    'Glasses': Glasses,
    'BookOpen': BookOpen,
    'Eye': Eye,
    'Diamond': Diamond,
    'Sparkles': Sparkles,
    'Aperture': Aperture,
    'Circle': Circle,
    'Hexagon': Hexagon,
    'Triangle': Triangle,
    'Settings': Settings,
    'Truck': Truck,
    'RotateCcw': RotateCcw,
    'Facebook': Facebook,
    'Twitter': Twitter,
    'Instagram': Instagram,
    'Youtube': Youtube,
    'Linkedin': Linkedin,
    'Github': Github,
    'Globe': Globe,
  };

  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

export default function LinkSuggestions({ 
  value, 
  onChange, 
  placeholder = "Enter or select a link",
  category = 'general' 
}: LinkSuggestionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const suggestions = linkSuggestions[category] || linkSuggestions.general;
  
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestion.href.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuggestionClick = (href: string) => {
    try {
      console.log('[LinkSuggestions] handleSuggestionClick', { href, hasOnChange: typeof onChange === 'function' });
      if (typeof onChange === 'function') {
        onChange(href);
      } else {
        console.error('LinkSuggestions: onChange prop is not a function', onChange);
      }
      setIsExpanded(false);
      setSearchTerm('');
    } catch (error) {
      console.error('LinkSuggestions: Error in handleSuggestionClick:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newValue = e.target.value;
      console.log('[LinkSuggestions] handleInputChange', { length: newValue.length, hasOnChange: typeof onChange === 'function' });
      if (typeof onChange === 'function') {
        onChange(newValue);
      } else {
        console.error('LinkSuggestions: onChange prop is not a function', onChange);
      }
      setSearchTerm(newValue);
    } catch (error) {
      console.error('LinkSuggestions: Error in handleInputChange:', error);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Link</Label>
      <div className="relative">
        <Input
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Suggested Links
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2 text-left hover:bg-gray-50"
                  onClick={() => handleSuggestionClick(suggestion.href)}
                >
                  <div className="flex items-center gap-2 w-full">
                    {suggestion.icon && (
                      <IconRenderer iconName={suggestion.icon} className="h-4 w-4 text-gray-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {suggestion.label}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {suggestion.href}
                      </div>
                    </div>
                    <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  </div>
                </Button>
              ))}
              {filteredSuggestions.length === 0 && (
                <div className="text-center py-4 text-sm text-gray-500">
                  No suggestions found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}