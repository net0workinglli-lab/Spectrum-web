import { getProducts, getCategories, updateCategory } from './firebase-firestore';

export const updateCategoryProductCounts = async () => {
  try {
    console.log('🔄 Updating category product counts...');
    
    // Get all products and categories
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories()
    ]);
    
    console.log(`📦 Found ${products.length} products and ${categories.length} categories`);
    
    // Count products for each category
    const categoryCounts: { [key: string]: number } = {};
    
    products.forEach((product: any) => {
      const category = product.category;
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
    
    console.log('📊 Category counts:', categoryCounts);
    
    // Update each category with product count
    const updatePromises = categories
      .filter((cat: any) => cat.type === 'product')
      .map(async (category: any) => {
        const productCount = categoryCounts[category.slug] || 0;
        
        if (category.productCount !== productCount) {
          console.log(`🔄 Updating ${category.name}: ${category.productCount || 0} → ${productCount} products`);
          await updateCategory(category.id, {
            ...category,
            productCount: productCount
          });
          return { name: category.name, count: productCount };
        }
        return null;
      });
    
    const results = await Promise.all(updatePromises);
    const updated = results.filter(r => r !== null);
    
    console.log(`✅ Updated ${updated.length} categories with product counts`);
    return updated;
    
  } catch (error) {
    console.error('❌ Error updating category product counts:', error);
    throw error;
  }
};

export const updateCategoryCountForProduct = async (categorySlug: string, increment: boolean = true) => {
  try {
    const categories = await getCategories();
    const category = categories.find((cat: any) => cat.slug === categorySlug && cat.type === 'product');
    
    if (category) {
      const currentCount = (category as any).productCount || 0;
      const newCount = increment ? currentCount + 1 : Math.max(0, currentCount - 1);
      
      console.log(`🔄 ${increment ? 'Incrementing' : 'Decrementing'} ${category.name}: ${currentCount} → ${newCount}`);
      
      await updateCategory(category.id, {
        ...category,
        productCount: newCount
      });
    }
  } catch (error) {
    console.error('Error updating category count:', error);
  }
};
