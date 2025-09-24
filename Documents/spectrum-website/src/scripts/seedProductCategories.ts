import { createCategory } from '@/lib/firebase-firestore';

const productCategories = [
  {
    name: 'Sunglasses',
    slug: 'sunglasses',
    description: 'Kính mát thời trang và chống nắng với nhiều phong cách khác nhau',
    color: '#F59E0B',
    type: 'product',
    postCount: 0,
    productCount: 0
  },
  {
    name: 'Eyeglasses',
    slug: 'eyeglasses',
    description: 'Gọng kính cận và viễn thị với thiết kế hiện đại và chất lượng cao',
    color: '#3B82F6',
    type: 'product',
    postCount: 0,
    productCount: 0
  },
  {
    name: 'Reading Glasses',
    slug: 'reading-glasses',
    description: 'Kính đọc sách chuyên dụng cho người lớn tuổi và công việc văn phòng',
    color: '#10B981',
    type: 'product',
    postCount: 0,
    productCount: 0
  },
  {
    name: 'Sports Eyewear',
    slug: 'sports-eyewear',
    description: 'Kính thể thao chuyên dụng cho các hoạt động ngoài trời và thể thao',
    color: '#EF4444',
    type: 'product',
    postCount: 0,
    productCount: 0
  },
  {
    name: 'Luxury Collection',
    slug: 'luxury-collection',
    description: 'Bộ sưu tập kính cao cấp từ các thương hiệu danh tiếng thế giới',
    color: '#8B5CF6',
    type: 'product',
    postCount: 0,
    productCount: 0
  },
  {
    name: 'Contact Lenses',
    slug: 'contact-lenses',
    description: 'Kính áp tròng với nhiều loại và thương hiệu khác nhau',
    color: '#06B6D4',
    type: 'product',
    postCount: 0,
    productCount: 0
  }
];

export async function seedProductCategories() {
  console.log('🏷️ Starting to seed product categories...');
  
  for (const categoryData of productCategories) {
    try {
      console.log(`Creating category: ${categoryData.name}`);
      await createCategory(categoryData);
      console.log(`✅ Created: ${categoryData.name}`);
    } catch (error) {
      console.error(`❌ Failed to create ${categoryData.name}:`, error);
    }
  }
  
  console.log('🎉 Product categories seeding completed!');
}

export { productCategories };
