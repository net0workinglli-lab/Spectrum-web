'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Eye, Users, Award, Heart, Shield, Target,
  CheckCircle, Star, Globe, Mail, Phone, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';

export default function AboutPage() {
  const { content: aboutContent, isLoading } = useContent('about-page');

  // Default content if CMS data not available
  const defaultContent = {
    title: 'About Spectrum Eyecare',
    subtitle: 'Your Vision, Our Passion',
    description: 'Since our founding, Spectrum has been dedicated to providing premium eyewear solutions that combine style, comfort, and cutting-edge technology. We believe that everyone deserves to see the world clearly while looking their best.',
    mission: 'To provide exceptional eyewear that enhances both vision and style, while maintaining our commitment to sustainability and customer satisfaction.',
    vision: 'To be the leading eyewear retailer in Vietnam, known for quality, innovation, and environmental responsibility.',
    values: [
      {
        title: 'Quality First',
        description: 'We source only the finest materials and work with premium brands to ensure exceptional quality.',
        icon: 'Shield'
      },
      {
        title: 'Customer Focus',
        description: 'Your satisfaction is our priority. We provide personalized service and expert guidance.',
        icon: 'Heart'
      },
      {
        title: 'Innovation',
        description: 'We embrace the latest technology and trends to offer cutting-edge eyewear solutions.',
        icon: 'Target'
      },
      {
        title: 'Sustainability',
        description: 'Committed to eco-friendly practices and responsible business operations.',
        icon: 'Globe'
      }
    ],
    stats: [
      { number: '10,000+', label: 'Happy Customers' },
      { number: '500+', label: 'Premium Products' },
      { number: '15+', label: 'Brand Partners' },
      { number: '5+', label: 'Years Experience' }
    ],
    team: {
      title: 'Our Expert Team',
      description: 'Meet the passionate professionals who make Spectrum exceptional.',
      members: [
        {
          name: 'Dr. Nguyen Phuoc Sang',
          role: 'Founder & CEO',
          description: 'Visionary leader with 15+ years in optical industry',
          image: '/team/ceo.jpg'
        },
        {
          name: 'Dr. Tran Minh Duc',
          role: 'Chief Optometrist',
          description: 'Expert in vision care with international certifications',
          image: '/team/optometrist.jpg'
        },
        {
          name: 'Le Thi Mai',
          role: 'Customer Experience Manager',
          description: 'Ensuring every customer receives exceptional service',
          image: '/team/manager.jpg'
        }
      ]
    }
  };

  // Use CMS content or fallback to defaults
  const content = {
    title: aboutContent?.title || defaultContent.title,
    subtitle: aboutContent?.subtitle || defaultContent.subtitle,
    description: aboutContent?.description || defaultContent.description,
    mission: aboutContent?.content || defaultContent.mission,
    vision: aboutContent?.buttonText || defaultContent.vision,
    stats: [
      { number: aboutContent?.stat1 || '10,000+', label: 'Happy Customers' },
      { number: aboutContent?.stat2 || '500+', label: 'Premium Products' },
      { number: aboutContent?.stat3 || '15+', label: 'Brand Partners' },
      { number: aboutContent?.stat4 || '5+', label: 'Years Experience' }
    ],
    values: [
      {
        title: 'Quality First',
        description: aboutContent?.value1 || 'We source only the finest materials and work with premium brands to ensure exceptional quality.',
        icon: 'Shield'
      },
      {
        title: 'Customer Focus',
        description: aboutContent?.value2 || 'Your satisfaction is our priority. We provide personalized service and expert guidance.',
        icon: 'Heart'
      },
      {
        title: 'Innovation',
        description: aboutContent?.value3 || 'We embrace the latest technology and trends to offer cutting-edge eyewear solutions.',
        icon: 'Target'
      },
      {
        title: 'Sustainability',
        description: aboutContent?.value4 || 'Committed to eco-friendly practices and responsible business operations.',
        icon: 'Globe'
      }
    ],
    team: {
      title: aboutContent?.teamTitle || defaultContent.team.title,
      description: aboutContent?.teamDescription || defaultContent.team.description,
      members: [
        {
          name: aboutContent?.member1Name || 'Dr. Nguyen Phuoc Sang',
          role: aboutContent?.member1Role || 'Founder & CEO',
          description: aboutContent?.member1Description || 'Visionary leader with 15+ years in optical industry',
          image: aboutContent?.member1Image || '/team/ceo.jpg'
        },
        {
          name: aboutContent?.member2Name || 'Dr. Tran Minh Duc',
          role: aboutContent?.member2Role || 'Chief Optometrist',
          description: aboutContent?.member2Description || 'Expert in vision care with international certifications',
          image: aboutContent?.member2Image || '/team/optometrist.jpg'
        },
        {
          name: aboutContent?.member3Name || 'Le Thi Mai',
          role: aboutContent?.member3Role || 'Customer Experience Manager',
          description: aboutContent?.member3Description || 'Ensuring every customer receives exceptional service',
          image: aboutContent?.member3Image || '/team/manager.jpg'
        }
      ]
    },
    contact: {
      address: aboutContent?.address || 'Ho Chi Minh City, Vietnam',
      phone: aboutContent?.phone || '+84 123 456 789',
      email: aboutContent?.email || 'info@spectrum.com'
    },
    cta: {
      title: aboutContent?.ctaTitle || 'Ready to Find Your Perfect Eyewear?',
      description: aboutContent?.ctaDescription || 'Visit our store or browse our collection online. Our expert team is here to help you find the perfect glasses for your style and needs.'
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'Shield': Shield,
      'Heart': Heart,
      'Target': Target,
      'Globe': Globe,
      'Eye': Eye,
      'Users': Users,
      'Award': Award
    };
    const IconComponent = icons[iconName] || Eye;
    return <IconComponent className="h-8 w-8" />;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                {content.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {content.subtitle}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {content.description}
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link href="/products">
                    <Eye className="h-5 w-5 mr-2" />
                    Explore Products
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/brands">
                    <Award className="h-5 w-5 mr-2" />
                    Our Brands
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-white rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src={aboutContent?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                  alt="Spectrum Eyecare Store"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {content.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50 relative">
        <div className="absolute inset-0 opacity-5">
          <img
            src={aboutContent?.secondaryButtonText || "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {content.mission}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {content.vision}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Spectrum
            </p>
          </motion.div>

          {/* Values Background Image */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3 h-96 opacity-10 hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1556475849-5f6a8e0c8daa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Eyewear Collection"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {content.values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      {getIcon(value.icon)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Gallery */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {aboutContent?.galleryTitle || 'Our Store & Workshop'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {aboutContent?.galleryDescription || 'Take a look inside our modern facility and professional workspace'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="md:col-span-2"
            >
              <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={aboutContent?.galleryImage1 || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                  alt="Spectrum Store Interior"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="space-y-6"
            >
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={aboutContent?.galleryImage2 || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"}
                  alt="Professional Equipment"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={aboutContent?.galleryImage3 || "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"}
                  alt="Eyewear Collection"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {content.team.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {content.team.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {content.team.members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-6 overflow-hidden">
                      {member.image && member.image !== '/team/ceo.jpg' && member.image !== '/team/optometrist.jpg' && member.image !== '/team/manager.jpg' ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : index === 0 ? (
                        <img
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : index === 1 ? (
                        <img
                          src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src="https://images.unsplash.com/photo-1494790108755-2616c6b0d5a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-600">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">{content.cta.title}</h2>
            <p className="text-xl mb-8 text-blue-100">
              {content.cta.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products">
                  <Eye className="h-5 w-5 mr-2" />
                  Browse Products
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary" asChild>
                <Link href="/brands">
                  <Award className="h-5 w-5 mr-2" />
                  Our Brands
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="mt-12 pt-8 border-t border-blue-400">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-200" />
                  <div>
                    <div className="font-medium">Visit Our Store</div>
                    <div className="text-blue-200 text-sm">{content.contact.address}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Phone className="h-5 w-5 text-blue-200" />
                  <div>
                    <div className="font-medium">Call Us</div>
                    <div className="text-blue-200 text-sm">{content.contact.phone}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Mail className="h-5 w-5 text-blue-200" />
                  <div>
                    <div className="font-medium">Email Us</div>
                    <div className="text-blue-200 text-sm">{content.contact.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Note: Metadata handled in layout.tsx for client components
