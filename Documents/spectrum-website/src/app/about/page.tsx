'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Car, BatteryCharging, Leaf, Users, Award, Heart, Shield, Target,
  CheckCircle, Star, Globe, Mail, Phone, MapPin, Zap, Gauge, Truck,
  Sparkles, Rocket, Compass, Lightbulb, TrendingUp, Factory, Package
} from 'lucide-react';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';
import Image from 'next/image';
import { useEffect } from 'react';

export default function AboutPage() {
  const { content: aboutContent, isLoading } = useContent('about-page');

  // Update page title
  useEffect(() => {
    document.title = 'About Us | SUNNY AUTO - Industrial & Logistics Solutions';
  }, []);

  // Default content for Sunny Auto EV Motors
  const defaultContent = {
    title: 'Pioneering Solutions for Industrial & Logistics Excellence',
    subtitle: 'Established under the esteemed umbrella of Leong Lee International Limited, SUNNY AUTO emerges as a pioneering solution provider in the realm of transportation and equipment, specializing in serving the industrial and logistics sectors.',
    description: 'As a prominent member of the Leong Lee Group, SUNNY AUTO is driven by a steadfast commitment to innovation, sustainability, and unparalleled service excellence. At SUNNY AUTO, our primary focus lies in the dynamic landscape of electric vehicles (EVs), where we harness cutting-edge technology to deliver next-generation solutions. With an unwavering dedication to advancing the EV segment, we proudly offer a comprehensive range of EV products, including electric trucks, electric forklifts, state-of-the-art charging station systems, and a diverse array of battery types.',
    vision: {
      title: 'OUR VISION',
      content: 'To pioneer innovative logistics solutions, providing cutting-edge, sustainable transportation and services that meet client needs and contribute to a greener planet.'
    },
    mission: {
      title: 'OUR MISSION',
      content: 'Leading the electric vehicle revolution with efficient, eco-friendly, and accessible transportation solutions, we aim to create a sustainable future for all.'
    },
    products: [
      {
        title: 'Electric Trucks',
        description: 'Heavy-duty electric trucks designed for industrial and logistics operations',
        icon: 'Truck'
      },
      {
        title: 'Electric Forklifts',
        description: 'State-of-the-art electric forklifts for warehouse and material handling',
        icon: 'Package'
      },
      {
        title: 'Charging Stations',
        description: 'Advanced charging station systems for efficient EV infrastructure',
        icon: 'BatteryCharging'
      },
      {
        title: 'Battery Solutions',
        description: 'Diverse array of battery types for various industrial applications',
        icon: 'Zap'
      }
    ],
    values: [
      {
        title: 'Innovation',
        description: 'We harness cutting-edge technology to deliver next-generation solutions that transform industrial and logistics operations.',
        icon: 'Lightbulb'
      },
      {
        title: 'Sustainability',
        description: 'Committed to eco-friendly solutions that contribute to a greener planet while meeting client needs.',
        icon: 'Leaf'
      },
      {
        title: 'Excellence',
        description: 'Unparalleled service excellence driven by our steadfast commitment to quality and customer satisfaction.',
        icon: 'Award'
      }
    ],
    story: {
      title: 'About SUNNY AUTO',
      content: 'Established under the esteemed umbrella of Leong Lee International Limited, SUNNY AUTO emerges as a pioneering solution provider in the realm of transportation and equipment, specializing in serving the industrial and logistics sectors. As a prominent member of the Leong Lee Group, we are driven by a steadfast commitment to innovation, sustainability, and unparalleled service excellence.',
      milestones: [
        { year: '2020', event: 'Company Founded' },
        { year: '2021', event: 'First EV Products' },
        { year: '2022', event: 'Industrial Expansion' },
        { year: '2023', event: 'Logistics Solutions' },
        { year: '2024', event: 'Market Leadership' }
      ]
    },
    team: {
      title: 'Core Management Team',
      description: 'Sunny Auto boasts unique DNA with a strong and diverse management team.',
      members: [
        {
          name: 'Nguyen Phuoc Sang',
          role: 'Chairman & CEO',
          description: 'Responsible for the overall strategic planning, organizational development, and management operations.',
          image: '/team/ceo.jpg'
        },
        {
          name: 'Tran Minh Duc',
          role: 'President',
          description: 'Responsible for the company\'s product planning, product portfolio management and sales operations.',
          image: '/team/president.jpg'
        },
        {
          name: 'Le Thi Mai',
          role: 'Vice President',
          description: 'Responsible for the company\'s strategy, finance, fundraising, investments, and globalization efforts.',
          image: '/team/vp.jpg'
        }
      ]
    },
    global: {
      title: 'Global Footprint & Diverse Talent Base',
      description: 'We are supported by a team of passionate, diverse, and talented employees with experience across the technology, finance, and automotive industry working across hubs in Vietnam, China, and Southeast Asia. Together, we are building our international presence as the explorer of future mobility.',
      factories: {
        title: 'Smart Manufacturing',
        description: 'Built to Industrial 4.0 standards with a sustainable philosophy, our self-built facilities are equipped with advanced automation for assembly and battery pack production - open and transparent, with real-time monitoring to ensure quality and efficiency.',
        capacity: 'Our maximum designed future production capacity could reach 100,000 cars annually with smart factories in Ho Chi Minh City and Hanoi.'
      }
    },
    esg: {
      title: 'ESG Commitment',
      description: 'As part of our commitment to ESG, we have curated an innovative core concept of S-SEG (Smart, Sustainable and Green) that guides the establishment and operations of our factories and underpins all major aspects of our business operations.',
      achievements: [
        'Zero-emission vehicle production',
        'Carbon-neutral operations',
        'Sustainable supply chain',
        'Community engagement programs'
      ]
    }
  };

  // Use CMS content or fallback to defaults
  const content = {
    title: aboutContent?.title || defaultContent.title,
    subtitle: aboutContent?.subtitle || defaultContent.subtitle,
    description: aboutContent?.description || defaultContent.description,
    imageUrl: aboutContent?.imageUrl || '',
    vision: {
      title: aboutContent?.visionTitle || defaultContent.vision.title,
      content: aboutContent?.visionContent || defaultContent.vision.content
    },
    mission: {
      title: aboutContent?.missionTitle || defaultContent.mission.title,
      content: aboutContent?.missionContent || defaultContent.mission.content
    },
    products: [
      {
        title: 'Electric Trucks',
        description: aboutContent?.product1Description || defaultContent.products[0].description,
        icon: 'Truck'
      },
      {
        title: 'Electric Forklifts',
        description: aboutContent?.product2Description || defaultContent.products[1].description,
        icon: 'Package'
      },
      {
        title: 'Charging Stations',
        description: aboutContent?.product3Description || defaultContent.products[2].description,
        icon: 'BatteryCharging'
      },
      {
        title: 'Battery Solutions',
        description: aboutContent?.product4Description || defaultContent.products[3].description,
        icon: 'Zap'
      }
    ],
    values: [
      {
        title: 'Innovation',
        description: aboutContent?.value1 || defaultContent.values[0].description,
        icon: 'Lightbulb'
      },
      {
        title: 'Sustainability',
        description: aboutContent?.value2 || defaultContent.values[1].description,
        icon: 'Leaf'
      },
      {
        title: 'Excellence',
        description: aboutContent?.value3 || defaultContent.values[2].description,
        icon: 'Award'
      }
    ],
    story: {
      title: aboutContent?.storyTitle || defaultContent.story.title,
      content: aboutContent?.storyContent || defaultContent.story.content,
      milestones: defaultContent.story.milestones
    },
    stats: [
      { 
        number: aboutContent?.stat1 || '500+', 
        label: aboutContent?.stat1Label || 'EVs Delivered' 
      },
      { 
        number: aboutContent?.stat2 || '1000+', 
        label: aboutContent?.stat2Label || 'Charging Stations' 
      },
      { 
        number: aboutContent?.stat3 || '50K+', 
        label: aboutContent?.stat3Label || 'Tons CO₂ Saved' 
      },
      { 
        number: aboutContent?.stat4 || '10K+', 
        label: aboutContent?.stat4Label || 'Happy Owners' 
      }
    ],
    team: {
      title: aboutContent?.teamTitle || defaultContent.team.title,
      description: aboutContent?.teamDescription || defaultContent.team.description,
      members: [
        {
          name: aboutContent?.member1Name || defaultContent.team.members[0].name,
          role: aboutContent?.member1Role || defaultContent.team.members[0].role,
          description: aboutContent?.member1Description || defaultContent.team.members[0].description,
          image: aboutContent?.member1Image || defaultContent.team.members[0].image
        },
        {
          name: aboutContent?.member2Name || defaultContent.team.members[1].name,
          role: aboutContent?.member2Role || defaultContent.team.members[1].role,
          description: aboutContent?.member2Description || defaultContent.team.members[1].description,
          image: aboutContent?.member2Image || defaultContent.team.members[1].image
        },
        {
          name: aboutContent?.member3Name || defaultContent.team.members[2].name,
          role: aboutContent?.member3Role || defaultContent.team.members[2].role,
          description: aboutContent?.member3Description || defaultContent.team.members[2].description,
          image: aboutContent?.member3Image || defaultContent.team.members[2].image
        }
      ]
    },
    gallery: {
      title: aboutContent?.galleryTitle || 'Our Facilities',
      description: aboutContent?.galleryDescription || 'Showroom & Service Center',
      images: [
        aboutContent?.galleryImage1 || '',
        aboutContent?.galleryImage2 || '',
        aboutContent?.galleryImage3 || ''
      ]
    },
    global: defaultContent.global,
    esg: defaultContent.esg
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'Lightbulb': Lightbulb,
      'Rocket': Rocket,
      'Sparkles': Sparkles,
      'Car': Car,
      'BatteryCharging': BatteryCharging,
      'Leaf': Leaf,
      'Shield': Shield,
      'Heart': Heart,
      'Target': Target,
      'Globe': Globe,
      'Zap': Zap,
      'Gauge': Gauge,
      'Truck': Truck,
      'Factory': Factory,
      'TrendingUp': TrendingUp,
      'Package': Package,
      'Award': Award
    };
    const IconComponent = icons[iconName] || Car;
    return <IconComponent className="h-8 w-8" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 overflow-hidden">
        {content.imageUrl && (
          <div className="absolute inset-0">
                <img
              src={content.imageUrl}
              alt="Hero"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
        )}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              {content.title}
            </h1>
            <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed mb-6 max-w-3xl mx-auto">
              {content.subtitle}
            </p>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              {content.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-2xl p-8 lg:p-12"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                    {content.vision.title}
                  </h2>
                </div>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {content.vision.content}
                </p>
            </motion.div>

              {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl p-8 lg:p-12"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center">
                    <Rocket className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                    {content.mission.title}
                  </h2>
                </div>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {content.mission.content}
                </p>
            </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Our Product Range
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive EV solutions for industrial and logistics sectors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {content.products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  {getIcon(product.icon)}
                    </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {product.title}
                    </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {product.description}
                    </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section - Three Columns */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              What drives us forward
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {content.values.map((value, index) => (
            <motion.div
                key={index}
              initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
            >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {getIcon(value.icon)}
              </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {value.description}
                </p>
            </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Story Section */}
      <section className="py-20 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">
                {content.story.title}
              </h2>
              <p className="text-xl text-slate-700 leading-relaxed mb-12">
                {content.story.content}
              </p>

              {/* Timeline */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {content.story.milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-emerald-600 mb-2">
                      {milestone.year}
                    </div>
                    <div className="text-slate-600 text-sm">
                      {milestone.event}
              </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {content.gallery.images.some(img => img) && (
        <section className="py-20 lg:py-32 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                {content.gallery.title}
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                {content.gallery.description}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {content.gallery.images.map((imageUrl, index) => (
                imageUrl && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={imageUrl}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Core Management Team */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              {content.team.title}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {content.team.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {content.team.members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-slate-100 rounded-full mx-auto mb-6 overflow-hidden">
                  {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <Users className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {member.name}
                    </h3>
                <p className="text-emerald-600 font-semibold mb-4">
                      {member.role}
                    </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                      {member.description}
                    </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Footprint Section */}
      <section className="py-20 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
          >
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                {content.global.title}
              </h2>
              <p className="text-xl text-slate-700 leading-relaxed max-w-3xl">
                {content.global.description}
            </p>
            </motion.div>

            {/* Smart Manufacturing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Factory className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
                  {content.global.factories.title}
                </h3>
                  </div>
              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                {content.global.factories.description}
              </p>
              <p className="text-slate-600">
                {content.global.factories.capacity}
              </p>
            </motion.div>
                  </div>
                </div>
      </section>

      {/* ESG Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-emerald-50 to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                {content.esg.title}
              </h2>
              <p className="text-xl text-slate-700 leading-relaxed max-w-3xl mx-auto mb-8">
                {content.esg.description}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.esg.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <CheckCircle className="h-8 w-8 text-emerald-600 mb-4" />
                  <p className="text-slate-700 font-medium">
                    {achievement}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
