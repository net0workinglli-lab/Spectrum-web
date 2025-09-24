'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle, 
  AlertCircle, User, MessageSquare, Building2,
  Globe, Facebook, Twitter, Instagram, Linkedin
} from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { toast } from 'sonner';
import SimpleMap from '@/components/SimpleMap';
import { submitContactForm } from '@/lib/contactService';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  inquiryType: string;
}

export default function ContactPage() {
  const { content: contactContent, isLoading: contentLoading } = useContent('contact-page');
  
  // Debug: Check if imageUrl is loaded
  console.log('🖼️ Contact Content Debug:', {
    imageUrl: contactContent?.imageUrl,
    hasImage: !!contactContent?.imageUrl,
    contentLoaded: !contentLoading
  });
  
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inquiryTypes = [
    { value: 'general', label: 'Thông tin chung' },
    { value: 'products', label: 'Sản phẩm & Dịch vụ' },
    { value: 'support', label: 'Hỗ trợ kỹ thuật' },
    { value: 'partnership', label: 'Hợp tác kinh doanh' },
    { value: 'complaint', label: 'Khiếu nại' },
    { value: 'other', label: 'Khác' }
  ];

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to Firebase
      const submissionId = await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        subject: formData.subject,
        message: formData.message,
        inquiryType: formData.inquiryType
      });
      
      console.log('✅ Contact form submitted successfully with ID:', submissionId);
      toast.success('Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.');
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      console.error('❌ Error submitting contact form:', error);
      toast.error('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (contentLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Background Section */}
      {contactContent?.imageUrl && (
        <section className="relative h-64 md:h-80 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={contactContent.imageUrl}
              alt="Contact Hero Background"
              className="w-full h-full object-cover"
              onLoad={() => console.log('✅ Hero background image loaded:', contactContent.imageUrl)}
              onError={(e) => console.log('❌ Hero background image failed:', e)}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20"></div>
          </div>
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-center max-w-3xl mx-auto text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {contactContent?.title || 'Liên hệ với chúng tôi'}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                {contactContent?.description || 'Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi để được tư vấn tốt nhất.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section (No Background) */}
      {!contactContent?.imageUrl && (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {contactContent?.title || 'Liên hệ với chúng tôi'}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {contactContent?.description || 'Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi để được tư vấn tốt nhất.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  {contactContent?.formTitle || 'Gửi tin nhắn cho chúng tôi'}
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  {contactContent?.formDescription || 'Điền thông tin bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể.'}
                </p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Cảm ơn bạn đã liên hệ!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                    >
                      Gửi tin nhắn khác
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Inquiry Type */}
                    <div className="space-y-2">
                      <Label htmlFor="inquiryType">Loại yêu cầu *</Label>
                      <select
                        id="inquiryType"
                        value={formData.inquiryType}
                        onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Nhập họ và tên"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="name@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone and Company */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="0123 456 789"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Công ty</Label>
                        <Input
                          id="company"
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Tên công ty"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Tiêu đề *</Label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Nhập tiêu đề tin nhắn"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Tin nhắn *</Label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Nhập nội dung tin nhắn..."
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {contactContent?.submitButtonText || 'Gửi tin nhắn'}
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                      * Thông tin bắt buộc
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    {contactContent?.infoTitle || 'Thông tin liên hệ'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Địa chỉ</h3>
                      <p className="text-gray-600">
                        {contactContent?.address || '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh, Việt Nam'}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Điện thoại</h3>
                      <p className="text-gray-600">
                        {contactContent?.phone || '(+84) 123 456 789'}
                      </p>
                      <p className="text-gray-600">
                        {contactContent?.hotline || 'Hotline: 1900 1234'}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">
                        {contactContent?.email || 'info@spectrum.com'}
                      </p>
                      <p className="text-gray-600">
                        {contactContent?.supportEmail || 'support@spectrum.com'}
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Giờ làm việc</h3>
                      <p className="text-gray-600">
                        {contactContent?.businessHours || 'Thứ 2 - Thứ 6: 8:00 - 18:00'}
                      </p>
                      <p className="text-gray-600">
                        {contactContent?.weekendHours || 'Thứ 7: 8:00 - 12:00'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-4 w-4 text-blue-600" />
                    {contactContent?.socialTitle || 'Kết nối với chúng tôi'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href={contactContent?.facebookUrl || 'https://facebook.com/spectrum.eyecare'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="text-xs w-full">
                        <Facebook className="h-4 w-4 mr-1 text-blue-600" />
                        Facebook
                      </Button>
                    </a>
                    <a 
                      href={contactContent?.instagramUrl || 'https://instagram.com/spectrum.eyecare'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="text-xs w-full">
                        <Instagram className="h-4 w-4 mr-1 text-pink-600" />
                        Instagram
                      </Button>
                    </a>
                    <a 
                      href={contactContent?.twitterUrl || 'https://twitter.com/spectrum_eyecare'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="text-xs w-full">
                        <Twitter className="h-4 w-4 mr-1 text-blue-400" />
                        Twitter
                      </Button>
                    </a>
                    <a 
                      href={contactContent?.linkedinUrl || 'https://linkedin.com/company/spectrum-eyecare'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="text-xs w-full">
                        <Linkedin className="h-4 w-4 mr-1 text-blue-700" />
                        LinkedIn
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="bg-blue-50 border-blue-200 shadow-lg">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                    {contactContent?.quickInfoTitle || 'Thông tin nhanh'}
                  </h3>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="w-full justify-start text-xs py-1">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                      {contactContent?.responseTime || 'Phản hồi trong 24h'}
                    </Badge>
                    <Badge variant="secondary" className="w-full justify-start text-xs py-1">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                      {contactContent?.supportLanguage || 'Hỗ trợ tiếng Việt & English'}
                    </Badge>
                    <Badge variant="secondary" className="w-full justify-start text-xs py-1">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                      {contactContent?.consultationFree || 'Tư vấn miễn phí'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {contactContent?.showMap !== false && (
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  {contactContent?.mapTitle || 'Vị trí của chúng tôi'}
                </h2>
                <p className="text-gray-600">
                  {contactContent?.address || '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh'}
                </p>
              </div>
              <Card className="shadow-lg border-0 overflow-hidden">
                {/* Direct iframe fallback if SimpleMap fails */}
                <div className="aspect-[21/9] relative">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '300px' }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={contactContent?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.921690491891!2d106.72869727547798!3d10.817304789333951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527844d7e6a45%3A0xedaeefbaf55796d!2sSpectrum%20Eyecare!5e0!3m2!1svi!2s!4v1758169698616!5m2!1svi!2s"}
                    title="Bản đồ vị trí Spectrum Eyecare"
                    className="w-full h-full"
                  />
                  
                  {/* Overlay with company info */}
                  <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          Spectrum Eyecare
                        </h3>
                        <p className="text-gray-600 text-xs leading-relaxed mb-2">
                          {contactContent?.address || '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh, Việt Nam'}
                        </p>
                        <a 
                          href="https://maps.google.com/?q=Spectrum+Eyecare"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium"
                        >
                          <MapPin className="h-3 w-3" />
                          Chỉ đường
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <a 
                      href="https://maps.google.com/?q=Spectrum+Eyecare"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg shadow-md text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <MapPin className="h-3 w-3" />
                      Xem chi tiết
                    </a>
                    <a 
                      href="https://maps.google.com/maps/dir/?api=1&destination=Spectrum+Eyecare"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-md text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <MapPin className="h-3 w-3" />
                      Chỉ đường
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}