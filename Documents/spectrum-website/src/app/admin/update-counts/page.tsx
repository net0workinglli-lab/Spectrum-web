'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, Calculator, CheckCircle, 
  AlertTriangle, TrendingUp, Package
} from 'lucide-react';
import { updateCategoryProductCounts } from '@/lib/categoryCounter';
import { toast } from 'sonner';

export default function UpdateCountsPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResults, setUpdateResults] = useState<Array<{name: string, count: number}>>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const handleUpdateCounts = async () => {
    setIsUpdating(true);
    setUpdateResults([]);
    
    try {
      console.log('🔄 Starting category product counts update...');
      const results = await updateCategoryProductCounts();
      
      setUpdateResults(results);
      setLastUpdated(new Date().toLocaleString('vi-VN'));
      
      if (results.length > 0) {
        toast.success(`✅ Đã cập nhật ${results.length} categories với product counts mới!`);
      } else {
        toast.success('✅ Tất cả category counts đã chính xác!');
      }
    } catch (error) {
      console.error('❌ Error updating counts:', error);
      toast.error('❌ Có lỗi xảy ra khi cập nhật counts');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Update Category Counts</h1>
          <p className="text-gray-600">
            Cập nhật số lượng products cho mỗi category để hiển thị đúng trên trang chủ.
          </p>
        </div>

        {/* Current Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Category Product Counts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800">Vấn đề hiện tại</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Shop by Category hiển thị "0+ products" vì productCount chưa được cập nhật khi tạo products.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800">Giải pháp</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Tool này sẽ đếm tất cả products trong mỗi category và cập nhật productCount trong Firebase.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                onClick={handleUpdateCounts}
                disabled={isUpdating}
                size="lg"
                className="w-full md:w-auto"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Đang cập nhật counts...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Cập nhật Category Product Counts
                  </>
                )}
              </Button>
            </div>

            {lastUpdated && (
              <div className="text-sm text-gray-500 pt-2 border-t">
                Cập nhật lần cuối: {lastUpdated}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Results */}
        {updateResults.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Kết quả cập nhật
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {updateResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{result.name}</span>
                    </div>
                    <Badge variant="default">{result.count} products</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn sử dụng:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">Khi nào cần cập nhật:</h3>
              <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                <li>Sau khi tạo products mới</li>
                <li>Sau khi xóa products</li>
                <li>Sau khi thay đổi category của products</li>
                <li>Khi thấy "0+ products" trên trang chủ</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Sau khi cập nhật:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Vào <strong>trang chủ</strong> để xem Shop by Category</li>
                <li>Verify <strong>product counts</strong> hiển thị đúng</li>
                <li>Test <strong>click category</strong> → filter products</li>
                <li>Check <strong>Products page</strong> filter hoạt động</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
