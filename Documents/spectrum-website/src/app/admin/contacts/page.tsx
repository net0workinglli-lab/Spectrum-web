'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, User, Mail, Phone, Building2, 
  Calendar, Clock, CheckCircle, AlertCircle,
  Eye, MoreHorizontal, Trash2
} from 'lucide-react';
import { getContactSubmissions, updateContactSubmissionStatus, ContactSubmission } from '@/lib/contactService';
import { toast } from 'sonner';

export default function ContactsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      const data = await getContactSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading contact submissions:', error);
      toast.error('Không thể tải danh sách liên hệ');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ContactSubmission['status']) => {
    try {
      await updateContactSubmissionStatus(id, status);
      toast.success('Đã cập nhật trạng thái');
      loadSubmissions(); // Reload data
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const getStatusBadge = (status: ContactSubmission['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">Mới</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">Đang xử lý</Badge>;
      case 'resolved':
        return <Badge variant="default">Đã giải quyết</Badge>;
      case 'closed':
        return <Badge variant="outline">Đã đóng</Badge>;
      default:
        return <Badge variant="secondary">Mới</Badge>;
    }
  };

  const getInquiryTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'general': 'Thông tin chung',
      'products': 'Sản phẩm & Dịch vụ',
      'support': 'Hỗ trợ kỹ thuật',
      'partnership': 'Hợp tác kinh doanh',
      'complaint': 'Khiếu nại',
      'other': 'Khác'
    };
    return types[type] || type;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('vi-VN');
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-600 mt-2">Quản lý các tin nhắn liên hệ từ khách hàng</p>
        </div>
        <Button onClick={loadSubmissions} variant="outline">
          <Clock className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng số</p>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mới</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'new').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã giải quyết</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tin nhắn nào</h3>
              <p className="text-gray-600">Các tin nhắn từ khách hàng sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{submission.name}</h3>
                      <p className="text-sm text-gray-600">{submission.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(submission.status)}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {submission.email}
                  </div>
                  {submission.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {submission.phone}
                    </div>
                  )}
                  {submission.company && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      {submission.company}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(submission.createdAt)}
                    </span>
                    <Badge variant="outline">{getInquiryTypeLabel(submission.inquiryType)}</Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(submission.id!, 'in-progress')}
                      disabled={submission.status === 'in-progress'}
                    >
                      Đang xử lý
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => updateStatus(submission.id!, 'resolved')}
                      disabled={submission.status === 'resolved'}
                    >
                      Đã giải quyết
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {selectedSubmission.name}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">{selectedSubmission.subject}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSubmission(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedSubmission.email}</p>
                </div>
                {selectedSubmission.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Điện thoại</label>
                    <p className="text-gray-900">{selectedSubmission.phone}</p>
                  </div>
                )}
                {selectedSubmission.company && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Công ty</label>
                    <p className="text-gray-900">{selectedSubmission.company}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Loại yêu cầu</label>
                  <p className="text-gray-900">{getInquiryTypeLabel(selectedSubmission.inquiryType)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Tin nhắn</label>
                <div className="bg-gray-50 p-4 rounded-lg mt-1">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Gửi lúc: {formatDate(selectedSubmission.createdAt)}
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(selectedSubmission.status)}
                  <Button
                    size="sm"
                    onClick={() => updateStatus(selectedSubmission.id!, 'resolved')}
                  >
                    Đánh dấu đã giải quyết
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
