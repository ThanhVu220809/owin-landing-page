import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { ProductRecord } from '@owin/quote-engine';
import { fetchFeaturedProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';

export function Featured({ onCalculate }: { onCalculate: (id: string) => void }) {
  const [products, setProducts] = useState<ProductRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchFeaturedProducts()
      .then((list) => {
        if (!cancelled) setProducts(list);
      })
      .catch(() => {
        /* Phần phụ: im lặng bỏ qua, danh sách đầy đủ vẫn ở dưới. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="section featured-section" id="noi-bat" aria-labelledby="noi-bat-title">
      <div className="section-head">
        <span className="eyebrow-chip">
          <Sparkles size={13} className="eyebrow-icon" />
          Tuyển chọn tiêu biểu
        </span>
        <h2 id="noi-bat-title" className="arch-section-title">
          Sản phẩm kiến trúc nổi bật
        </h2>
        <p className="arch-section-desc">
          Các giải pháp cửa được gia chủ và kiến trúc sư lựa chọn nhiều nhất cho công trình cao cấp.
        </p>
      </div>

      <div className="arch-product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onCalculate={onCalculate} />
        ))}
      </div>
    </section>
  );
}
