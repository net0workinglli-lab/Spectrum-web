'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher, MobileLanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Search,
  User, 
  Heart, 
  Menu,
  Glasses,
  Sun,
  Eye,
  Contact,
  ChevronDown,
  Award,
  Users,
  Leaf,
  Shield,
  Zap,
  Star,
  Crown,
  Gem,
  Diamond,
  Sparkles,
  Target,
  Aperture,
  Circle,
  Camera,
  Hexagon,
  Triangle,
  Clock,
  Square,
  BookOpen
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import { WishlistDropdown } from './WishlistDropdown';
import { UserDropdown } from './UserDropdown';
import { LoginModal } from './LoginModal';
import { useApp } from '@/contexts/AppContext';
import { useContent } from '@/hooks/useContent';

// Icon component to render the correct icon based on name
const IconRenderer = ({ iconName, className = "h-4 w-4" }: { iconName: string; className?: string }) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'Sun': Sun,
    'Glasses': Glasses,
    'BookOpen': BookOpen,
    'Eye': Eye,
    'Shield': Shield,
    'Zap': Zap,
    'Star': Star,
    'Heart': Heart,
    'Crown': Crown,
    'Gem': Gem,
    'Diamond': Diamond,
    'Sparkles': Sparkles,
    'Target': Target,
    'Aperture': Aperture,
    'Circle': Circle,
    'Camera': Camera,
    'Hexagon': Hexagon,
    'Triangle': Triangle,
    'Clock': Clock,
    'Square': Square,
  };

  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

export function Header() {
  const { 
    wishlistItems, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    isUserOpen, 
    setIsUserOpen,
    isLoggedIn,
    user,
    logout,
    removeFromWishlist
  } = useApp();

  const { content: headerContent, isLoading } = useContent('header-section');

  const isAdmin = user?.email === 'admin@spectrum.com' || user?.email === 'nguyenphuocsang@gmail.com';
  
  // Translations
  const t = useTranslations();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navigation = [
    { name: headerContent?.ecoFriendlyText || t('navigation.ecoFriendly'), href: headerContent?.ecoFriendlyLink || '/eco-friendly', icon: Leaf },
    { name: headerContent?.communityText || t('navigation.community'), href: headerContent?.communityLink || '/community', icon: Users },
  ];

  // Convert dropdown items to navigation format
  const categories = (headerContent?.productsDropdown || []).map((item) => {
    return {
      name: item.name,
      href: item.href,
      icon: item.icon || 'Glasses'
    };
  });

  const brands = (headerContent?.brandsDropdown || []).map((item) => {
    return {
      name: item.name,
      href: item.href,
      icon: item.icon || 'Award'
    };
  });

  const lensBrands = (headerContent?.lensesDropdown || []).map((item) => {
    return {
      name: item.name,
      href: item.href,
      icon: item.icon || 'Eye'
    };
  });

  if (isLoading) {
    return (
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="hidden lg:flex items-center gap-8">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-64 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <span>{headerContent?.topBarLeft || t('header.topBarLeft')}</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">{headerContent?.topBarRight || t('header.topBarRight')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="hover:text-primary">
              {headerContent?.blogLinkText || t('navigation.blog')}
            </Link>
            <Link href="/contact" prefetch={false} className="hover:text-primary">
              {headerContent?.contactLinkText || t('navigation.contact')}
            </Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {headerContent?.logoImage ? (
              <img 
                src={headerContent.logoImage} 
                alt="Logo" 
                className="h-10 w-auto object-contain"
              />
            ) : (
              <Glasses className="h-10 w-10 text-primary" />
            )}
            {headerContent?.logoText && (
              <span className="text-2xl font-bold">{headerContent.logoText}</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:text-primary">
                  <Glasses className="h-4 w-4" />
                  {t('navigation.products')}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.name} asChild>
                    <Link href={category.href} className="flex items-center gap-2">
                      <IconRenderer iconName={category.icon} className="h-4 w-4" />
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Brands Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:text-primary">
                  <Award className="h-4 w-4" />
                  {t('navigation.brands')}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {brands.map((brand) => (
                  <DropdownMenuItem key={brand.name} asChild>
                    <Link href={brand.href} className="flex items-center gap-2">
                      <IconRenderer iconName={brand.icon} className="h-4 w-4" />
                      {brand.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Lenses Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:text-primary">
                  <Contact className="h-4 w-4" />
                  {t('navigation.lenses')}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {lensBrands.map((lensBrand) => (
                  <DropdownMenuItem key={lensBrand.name} asChild>
                    <Link href={lensBrand.href} className="flex items-center gap-2">
                      <IconRenderer iconName={lensBrand.icon} className="h-4 w-4" />
                      {lensBrand.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search Bar */}
          <SearchBar placeholder={headerContent?.searchPlaceholder || t('common.searchPlaceholder')} />

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setIsWishlistOpen(!isWishlistOpen)}
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
              <WishlistDropdown
                isOpen={isWishlistOpen}
                onClose={() => setIsWishlistOpen(false)}
                wishlistItems={wishlistItems}
                onRemoveFromWishlist={removeFromWishlist}
              />
            </div>

            {/* User */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsUserOpen(!isUserOpen)}
              >
                <User className="h-5 w-5" />
              </Button>
              <UserDropdown
                isOpen={isUserOpen}
                onClose={() => setIsUserOpen(false)}
                isLoggedIn={isLoggedIn}
                user={user}
                onLogin={() => setIsLoginModalOpen(true)}
                onLogout={logout}
                isAdmin={isAdmin}
              />
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  {/* Mobile Search */}
                  <div className="flex items-center relative">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t('common.searchPlaceholder')}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 hover:text-primary transition-colors py-2"
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                    
                    {/* Mobile Categories */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <Glasses className="h-4 w-4" />
                        {t('navigation.products')}
                      </div>
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="flex items-center gap-3 hover:text-primary transition-colors py-2 pl-4"
                        >
                          <IconRenderer iconName={category.icon} className="h-4 w-4" />
                          {category.name}
                        </Link>
                      ))}
                    </div>

                    {/* Mobile Brands */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        {t('navigation.brands')}
                      </div>
                      {brands.map((brand) => (
                        <Link
                          key={brand.name}
                          href={brand.href}
                          className="flex items-center gap-3 hover:text-primary transition-colors py-2 pl-4"
                        >
                          <IconRenderer iconName={brand.icon} className="h-4 w-4" />
                          {brand.name}
                        </Link>
                      ))}
                    </div>

                    {/* Mobile Lenses */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <Contact className="h-4 w-4" />
                        {t('navigation.lenses')}
                      </div>
                      {lensBrands.map((lensBrand) => (
                        <Link
                          key={lensBrand.name}
                          href={lensBrand.href}
                          className="flex items-center gap-3 hover:text-primary transition-colors py-2 pl-4"
                        >
                          <IconRenderer iconName={lensBrand.icon} className="h-4 w-4" />
                          {lensBrand.name}
                        </Link>
                      ))}
                    </div>
                  </nav>

                  {/* Mobile Actions */}
                  <div className="flex flex-col gap-4 pt-4 border-t">
                    <Link href="/blog" className="hover:text-primary">
                      {t('navigation.blog')}
                    </Link>
                    <Link href="/contact" prefetch={false} className="hover:text-primary">
                      {t('navigation.contact')}
                    </Link>
                    
                    {/* Mobile Language Switcher */}
                    <MobileLanguageSwitcher />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {}}
      />
    </motion.header>
  );
}
