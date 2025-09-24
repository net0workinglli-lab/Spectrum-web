'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Eye, Shield, Zap, Award } from 'lucide-react';

const lensBrands = [
  {
    id: 'essilor',
    name: 'Essilor',
    description: 'Pioneer in Varifocal Technology',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    href: '/essilor',
    features: ['Varifocal Technology', 'Blue Light Protection', 'Anti-Reflective'],
    color: 'bg-blue-500'
  },
  {
    id: 'zeiss',
    name: 'Zeiss',
    description: 'German Precision Engineering',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop',
    href: '/zeiss',
    features: ['Precision Optics', 'Durability', 'Clarity'],
    color: 'bg-gray-800'
  },
  {
    id: 'hoya',
    name: 'Hoya',
    description: 'Innovative Lens Solutions',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop',
    href: '/hoya',
    features: ['UV Protection', 'Scratch Resistant', 'Lightweight'],
    color: 'bg-green-600'
  },
  {
    id: 'nikon',
    name: 'Nikon',
    description: 'Advanced Optical Technology',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
    href: '/nikon',
    features: ['High Index', 'Digital Lenses', 'Premium Quality'],
    color: 'bg-purple-600'
  }
];

const features = [
  {
    icon: Eye,
    title: 'Crystal Clear Vision',
    description: 'Advanced lens technology for optimal clarity'
  },
  {
    icon: Shield,
    title: 'UV Protection',
    description: '100% UV protection for eye health'
  },
  {
    icon: Zap,
    title: 'Blue Light Filter',
    description: 'Reduce digital eye strain and fatigue'
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Manufactured to the highest standards'
  }
];

export function LensesSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-gray-600 border-gray-200">
            <Eye className="h-4 w-4 mr-2" />
            Premium Lenses
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
            Discover Our Premium Lens Brands
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Experience the world through crystal-clear vision with our carefully selected 
            collection of premium lens brands. Each brand offers unique technologies 
            designed to enhance your visual experience.
          </p>
        </motion.div>

        {/* Lens Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {lensBrands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <Link
                href={brand.href}
                className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${brand.color}`} />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-gray-700 transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {brand.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {brand.features.map((feature, featureIndex) => (
                      <Badge
                        key={featureIndex}
                        variant="secondary"
                        className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <feature.icon className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" asChild className="bg-gray-900 hover:bg-gray-800">
            <Link href="/brands">
              Explore All Lens Brands
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
