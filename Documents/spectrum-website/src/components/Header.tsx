'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Search,
  Heart, 
  Menu,
  Glasses,
  Sun,
  Eye,
  Contact,
  ChevronDown,
  Award,
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
    removeFromWishlist
  } = useApp();

  const { content: headerContent, isLoading } = useContent('header-section');
  const pathname = usePathname();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if we're on homepage
  const isHomePage = pathname === '/';

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // For non-homepage, always show solid background
  const shouldBeTransparent = isHomePage && !isScrolled;

  // Memoize navigation items to prevent unnecessary re-renders
  const navigation = useMemo(() => 
    (headerContent?.navigationItems || []).map((item) => ({
      name: item.name,
      href: item.href,
      icon: item.icon || 'Leaf'
    })), 
    [headerContent?.navigationItems]
  );

  const categories = useMemo(() => 
    (headerContent?.productsDropdown || []).map((item) => ({
      name: item.name,
      href: item.href,
      icon: item.icon || 'Glasses'
    })), 
    [headerContent?.productsDropdown]
  );

  const brands = useMemo(() => 
    (headerContent?.brandsDropdown || []).map((item) => ({
      name: item.name,
      href: item.href,
      icon: item.icon || 'Award'
    })), 
    [headerContent?.brandsDropdown]
  );

  const lensBrands = useMemo(() => 
    (headerContent?.lensesDropdown || []).map((item) => ({
      name: item.name,
      href: item.href,
      icon: item.icon || 'Eye'
    })), 
    [headerContent?.lensesDropdown]
  );

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
      className={`${isHomePage ? 'fixed top-0 left-0 right-0' : 'sticky top-0'} z-50 w-full transition-all duration-300 ${
        shouldBeTransparent
          ? 'border-b border-white/10 bg-transparent backdrop-blur-sm' 
          : 'border-b border-slate-200/50 bg-white/95 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Main header - All in one row */}
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
            {headerContent?.logoImage ? (
              <img 
                src={headerContent.logoImage} 
                alt="Sunny Auto Logo" 
                className="h-10 w-auto object-contain"
                loading="eager"
              />
            ) : (
              <Glasses className={`h-10 w-10 ${shouldBeTransparent ? 'text-white' : 'text-emerald-600'}`} />
            )}
            {headerContent?.logoText && (
              <span className={`text-lg md:text-xl font-bold hidden sm:inline ${shouldBeTransparent ? 'text-white' : 'text-slate-900'}`}>
                {headerContent.logoText}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  shouldBeTransparent
                    ? 'text-white/90 hover:text-white' 
                    : 'text-slate-700 hover:text-emerald-600'
                }`}
              >
                <IconRenderer iconName={item.icon} className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            
            {/* Categories Dropdown - Only show if has items */}
            {categories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    shouldBeTransparent
                      ? 'text-white/90 hover:text-white' 
                      : 'text-slate-700 hover:text-emerald-600'
                  }`}>
                    <Glasses className="h-4 w-4" />
                    {headerContent?.productsDropdownTitle || 'Products'}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.name} asChild>
                      <Link href={category.href} className="flex items-center gap-2 cursor-pointer">
                        <IconRenderer iconName={category.icon} className="h-4 w-4" />
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Brands Dropdown - Only show if has items */}
            {brands.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    shouldBeTransparent
                      ? 'text-white/90 hover:text-white' 
                      : 'text-slate-700 hover:text-emerald-600'
                  }`}>
                    <Award className="h-4 w-4" />
                    {headerContent?.brandsDropdownTitle || 'Brands'}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {brands.map((brand) => (
                    <DropdownMenuItem key={brand.name} asChild>
                      <Link href={brand.href} className="flex items-center gap-2 cursor-pointer">
                        <IconRenderer iconName={brand.icon} className="h-4 w-4" />
                        {brand.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Lenses Dropdown - Only show if has items */}
            {lensBrands.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    shouldBeTransparent
                      ? 'text-white/90 hover:text-white' 
                      : 'text-slate-700 hover:text-emerald-600'
                  }`}>
                    <Contact className="h-4 w-4" />
                    {headerContent?.lensesDropdownTitle || 'Lenses'}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {lensBrands.map((lensBrand) => (
                    <DropdownMenuItem key={lensBrand.name} asChild>
                      <Link href={lensBrand.href} className="flex items-center gap-2 cursor-pointer">
                        <IconRenderer iconName={lensBrand.icon} className="h-4 w-4" />
                        {lensBrand.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Top bar info - hidden on mobile, shown on desktop */}
          <div className={`hidden xl:flex items-center gap-2 text-xs transition-colors flex-shrink-0 ${
            shouldBeTransparent
              ? 'text-white/70' 
              : 'text-slate-600'
          }`}>
            <span className="hidden 2xl:inline">{headerContent?.topBarLeft || 'Free consultation'}</span>
            <span className={`hidden 2xl:inline ${shouldBeTransparent ? 'text-white/30' : 'text-slate-300'}`}>|</span>
            <span className="hidden 2xl:inline">{headerContent?.topBarRight || '30-day return'}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search Bar - Next to wishlist */}
            <SearchBar 
              placeholder={headerContent?.searchPlaceholder || 'Search vehicles, models...'} 
              isScrolled={!shouldBeTransparent}
            />
            {/* Wishlist */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`relative transition-colors ${
                  shouldBeTransparent
                    ? 'hover:bg-white/10 hover:text-white text-white/90' 
                    : 'hover:bg-emerald-50 hover:text-emerald-600 text-slate-700'
                }`}
                onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-emerald-600 hover:bg-emerald-700"
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


            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`lg:hidden transition-colors ${
                    shouldBeTransparent
                      ? 'hover:bg-white/10 hover:text-white text-white/90' 
                      : 'hover:bg-emerald-50 hover:text-emerald-600 text-slate-700'
                  }`}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                
                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-1 mt-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-slate-700 font-medium"
                      >
                        <IconRenderer iconName={item.icon} className="h-5 w-5 flex-shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    
                    {/* Mobile Categories */}
                    {categories.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-3 flex items-center gap-2">
                          <Glasses className="h-4 w-4" />
                          {headerContent?.productsDropdownTitle || 'Products'}
                        </div>
                        {categories.map((category) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-slate-600 pl-8"
                          >
                            <IconRenderer iconName={category.icon} className="h-4 w-4 flex-shrink-0" />
                            <span>{category.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Mobile Brands */}
                    {brands.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-3 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          {headerContent?.brandsDropdownTitle || 'Brands'}
                        </div>
                        {brands.map((brand) => (
                          <Link
                            key={brand.name}
                            href={brand.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-slate-600 pl-8"
                          >
                            <IconRenderer iconName={brand.icon} className="h-4 w-4 flex-shrink-0" />
                            <span>{brand.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Mobile Lenses - Only show if has items */}
                    {lensBrands.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-3 flex items-center gap-2">
                          <Contact className="h-4 w-4" />
                          {headerContent?.lensesDropdownTitle || 'Lenses'}
                        </div>
                        {lensBrands.map((lensBrand) => (
                          <Link
                            key={lensBrand.name}
                            href={lensBrand.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-slate-600 pl-8"
                          >
                            <IconRenderer iconName={lensBrand.icon} className="h-4 w-4 flex-shrink-0" />
                            <span>{lensBrand.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </nav>
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
