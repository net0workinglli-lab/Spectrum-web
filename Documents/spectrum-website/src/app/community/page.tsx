'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Users, 
  MapPin, 
  Gift, 
  ArrowRight,
  Calendar,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import { useContent } from '@/hooks/useContent';

export default function CommunityPage() {
  const { content, isLoading } = useContent('community-page');

  // Default data fallback
  const defaultData = {
    badgeText: 'Community Outreach Program',
    title: 'NÂNG NIU ĐÔI MẮT, THẮP SÁNG TƯƠNG LAI',
    description: 'Thông qua chương trình "CHĂM SÓC ĐÔI MẮT CỦA BẠN, TƯƠI SÁNG TƯƠNG LAI", chúng tôi cố gắng tạo ra tác động tích cực đến những người không có điều kiện tiếp cận dịch vụ chăm sóc mắt và chỉnh sửa thị lực.',
    howItWorksTitle: 'Cách Thức Hoạt Động',
    howItWorksSubtitle: 'Biến Những Chiếc Kính Cũ Của Bạn Thành 500.000 VND Và Món Quà Thị Giác Cho Những Người Cần',
    howItWorksNote: '*(Chỉ nhận kính còn sử dụng được)',
    steps: [
      {
        icon: 'Gift',
        title: '1. Quyên Góp Kính',
        description: 'Mang kính cũ còn sử dụng được đến cửa hàng của chúng tôi'
      },
      {
        icon: 'Heart',
        title: '2. Nhận 500.000 VND',
        description: 'Nhận ngay 500.000 VND và món quà thị giác từ chúng tôi'
      },
      {
        icon: 'Users',
        title: '3. Giúp Đỡ Cộng Đồng',
        description: 'Kính của bạn sẽ được trao cho những người cần hỗ trợ'
      }
    ],
    locationTitle: 'Nơi Thu Nhận:',
    locationAddress: 'Spectrum Eyecare\n192 Nguyễn Văn Hưởng, Thảo Điền, Thủ Đức, Hồ Chí Minh 700000, Việt Nam',
    locationLink: 'https://maps.google.com/maps?q=Spectrum+Eyecare+192+Nguyễn+Văn+Hưởng,+Thảo+Điền,+Thủ+Đức,+Hồ+Chí+Minh+700000,+Việt+Nam',
    activitiesTitle: 'Các Hoạt Động Của Chúng Tôi',
    activitiesDescription: 'Trong hành trình đầu tiên thực hiện ước mơ cho thế hệ kế tiếp, Spectrum Eyecare đã đồng hành cùng Trường Từ Thiện Phước Thiện với hy vọng trực tiếp truyền đạt kiến thức và nguồn lực chuyên môn đến những người cần hỗ trợ nhất.',
    activitiesImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
    activitiesFeatures: [
      {
        title: 'Kiểm tra mắt toàn diện:',
        description: '36 học sinh được kiểm tra, 15 em gặp vấn đề về khúc xạ'
      },
      {
        title: 'Kính tùy chỉnh:',
        description: 'Chế tác kính phù hợp với nhu cầu thị lực cụ thể của từng em'
      },
      {
        title: 'Hỗ trợ học tập:',
        description: 'Cung cấp vở, bút chì và các vật dụng học tập cần thiết'
      }
    ],
    coreValuesTitle: 'Cốt Lõi',
    values: [
      {
        icon: 'Heart',
        title: 'Tính Bền Vững',
        description: 'Chúng tôi tích cực thúc đẩy việc tái chế những gọng kính cũ được quyên góp, đảm bảo rằng chúng được tái sử dụng để mang lại lợi ích cho những người cần giúp đỡ.'
      },
      {
        icon: 'Users',
        title: 'Hỗ Trợ Cộng Đồng',
        description: 'Thông qua các đối tác cung cấp đáng tin cậy như Essilor, chúng tôi có thể tài trợ cho những chiếc kính chất lượng xuất sắc, từ đó nâng cao trải nghiệm thị giác.'
      }
    ],
    recentActivitiesTitle: 'Hoạt Động Gần Đây',
    activities: [
      {
        id: '1',
        title: 'Trung Thu Bên Em - Ninh Thuận',
        date: 'October 22, 2024',
        description: 'Spectrum tiếp tục chặng đường "Nâng Niu Đôi Mắt, Thắp Sáng Tương Lai" tại tỉnh Ninh Thuận',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
        status: 'completed'
      },
      {
        id: '2',
        title: 'Phước Thiện Charity School - Round 2',
        date: 'September 11, 2024',
        description: 'Spectrum continues to carry out the mission "Care for Your Eyes, Shine for Your Future"',
        image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop',
        status: 'completed'
      }
    ],
    cta: {
      title: 'Hãy Cùng Chúng Tôi Tạo Ra Sự Khác Biệt',
      description: 'Để chương trình ý nghĩa này có thể lan tỏa xa hơn nữa, Spectrum vẫn tiếp tục nhận kính cũ tại cửa hàng. Hãy quyên góp những gọng kính cũ và nhận 500.000 VND cùng với món quà thị giác của mình.',
      button1Text: 'Quyên Góp Ngay',
      button1Icon: 'Gift',
      button2Text: 'Xem Địa Chỉ',
      button2Icon: 'MapPin'
    }
  };

  // Use Firebase data if available, otherwise use default data
  const data = content || defaultData;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading community page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground mb-6">
          <Heart className="h-4 w-4" />
          {data.badgeText}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {data.title}
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* How It Works Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {data.howItWorksTitle}
        </h2>
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {data.howItWorksSubtitle}
            </h3>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              {data.howItWorksNote}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(data.steps || []).map((step, index) => {
              const IconComponent = step.icon === 'Gift' ? Gift : step.icon === 'Heart' ? Heart : Users;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-700 mb-4">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">{data.locationTitle}</span>
            </div>
            <a 
              href={data.locationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 underline"
            >
              <strong>Spectrum Eyecare</strong><br />
              {data.locationAddress.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < data.locationAddress.split('\n').length - 1 && <br />}
                </span>
              ))}
            </a>
          </div>
        </div>
      </div>

      {/* Our Activities Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {data.activitiesTitle}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Trường Từ Thiện Phước Thiện
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {data.activitiesDescription}
            </p>
            
            <div className="space-y-4">
              {(data.activitiesFeatures || []).map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>{feature.title}</strong> {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <Image
              src={data.activitiesImage || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop"}
              alt="Community outreach activities"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {data.coreValuesTitle}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(data.values || []).map((value, index) => {
            const IconComponent = value.icon === 'Heart' ? Heart : Users;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent className="h-8 w-8 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                  </div>
                  <p className="text-gray-700">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {data.recentActivitiesTitle}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(data.activities || []).map((activity) => (
            <Card key={activity.id} className="group hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90">
                    <Calendar className="h-3 w-3 mr-1" />
                    {activity.date}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.title}</h3>
                <p className="text-gray-600 mb-4">{activity.description}</p>
                <Button variant="outline" className="w-full">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-100 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {data.cta?.title || 'Hãy Cùng Chúng Tôi Tạo Ra Sự Khác Biệt'}
        </h2>
        <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
          {data.cta?.description || 'Để chương trình ý nghĩa này có thể lan tỏa xa hơn nữa, Spectrum vẫn tiếp tục nhận kính cũ tại cửa hàng. Hãy quyên góp những gọng kính cũ và nhận 500.000 VND cùng với món quà thị giác của mình.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Gift className="h-5 w-5 mr-2" />
            {data.cta?.button1Text || 'Quyên Góp Ngay'}
          </Button>
          <Button size="lg" variant="outline">
            <MapPin className="h-5 w-5 mr-2" />
            {data.cta?.button2Text || 'Xem Địa Chỉ'}
          </Button>
        </div>
      </div>
    </div>
  );
}
