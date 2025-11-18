'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { Heart, Eye, GitCompare } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface ProductCardProps {
  product: Product;
  onToggleWishlist?: (product: Product) => void;
  onAddToComparison?: (product: Product) => void;
  isInComparison?: boolean;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onAddToComparison, isInComparison, onQuickView }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col w-full">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images?.[0] || '/placeholder-glasses.jpg'}
          alt={product.name}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
        

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full"
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full"
            asChild
          >
            <Link href={`/product-detail?id=${product.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant={isInComparison ? "default" : "secondary"}
            className="h-8 w-8 rounded-full"
            onClick={() => onAddToComparison?.(product)}
          >
            <GitCompare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 flex-grow flex flex-col min-w-0">
        <div className="space-y-2 flex-grow min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs shrink-0">
              {product.brand}
            </Badge>
            <Badge variant="secondary" className="text-xs shrink-0">
              {product.category}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors break-words">
            {product.name}
          </h3>
          
          <p className="text-xs text-muted-foreground line-clamp-2 break-words">
            {product.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            className="flex-1" 
            asChild
          >
            <Link href={`/product-detail?id=${product.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              See Details
            </Link>
          </Button>
          {onQuickView && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuickView(product)}
              className="shrink-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={handleWishlistToggle}
            className="shrink-0"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
          </Button>
          {onAddToComparison && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onAddToComparison(product)}
              className={`shrink-0 ${isInComparison ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <GitCompare className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
      </Card>
    </motion.div>
  );
}
