import { useEffect, useState } from 'react';
import type { ProductRecord } from '@owin/quote-engine';
import { fetchFeaturedProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';

/**
 * Sản phẩm nổi bật — vài món chủ cửa hàng tự chọn, đặt ngay trên đầu.
 *
 * Chưa ai được chọn thì **ẩn hẳn cả phần này**. Không lấy tạm mấy sản phẩm đầu
 * danh sách rồi gọi chúng là nổi bật: như thế là tự bịa ra một lựa chọn mà chủ
 * cửa hàng chưa hề đưa ra.
 *
 * Lỗi tải cũng ẩn luôn, không báo gì — đây là phần phụ, ngay dưới đã có danh
 * sách đầy đủ. Kêu lỗi ở đây chỉ làm khách hoang mang về một thứ họ không cần.
 */
export function Featured({ onCalculate }: { onCalculate: (id: string) => void }) {
  const [products, setProducts] = useState<ProductRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchFeaturedProducts()
      .then((list) => { if (!cancelled) setProducts(list); })
      .catch(() => { /* Phần phụ: im lặng bỏ qua, danh sách đầy đủ vẫn ở dưới. */ });
    return () => { cancelled = true; };
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="section" id="noi-bat" aria-labelledby="noi-bat-title">
      <header className="section-head">
        <h2 id="noi-bat-title">Sản phẩm nổi bật</h2>
      </header>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onCalculate={onCalculate} />
        ))}
      </div>
    </section>
  );
}
