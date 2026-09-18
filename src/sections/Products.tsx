import { useCallback, useEffect, useState } from 'react';
import type { ProductRecord } from '@owin/quote-engine';
import { PAGE_SIZE, fetchPublicProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';

/**
 * Danh sách sản phẩm thật.
 *
 * Danh sách rỗng thì **ẩn hẳn cả phần này** thay vì hiện "chưa có sản phẩm":
 * trang công khai mà nói với khách rằng cửa hàng không có gì để bán thì thà
 * đừng nói gì. Lỗi tải thì nói thật là đang lỗi, đừng giả vờ là rỗng.
 */
export function Products() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPublicProducts(0)
      .then((page) => {
        if (cancelled) return;
        setProducts(page.products);
        setTotal(page.total);
        setStatus('ready');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const page = await fetchPublicProducts(products.length);
      setProducts((current) => [...current, ...page.products]);
      setTotal(page.total);
    } catch {
      setStatus('error');
    } finally {
      setLoadingMore(false);
    }
  }, [products.length]);

  if (status === 'loading') {
    return (
      <section className="section" aria-busy="true">
        <div className="product-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="product-card product-card-skeleton" />
          ))}
        </div>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="section">
        <p className="notice" role="alert">
          Không tải được danh sách sản phẩm. Vui lòng thử lại sau.
        </p>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="section" id="san-pham">
      <header className="section-head">
        <h2>Sản phẩm</h2>
        <p className="muted">
          {total} sản phẩm · giá tham khảo, chưa gồm lắp đặt và vận chuyển
        </p>
      </header>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length < total && (
        <div className="section-more">
          <button
            type="button"
            className="btn"
            onClick={() => void loadMore()}
            disabled={loadingMore}
          >
            {loadingMore
              ? 'Đang tải…'
              : `Xem thêm ${Math.min(PAGE_SIZE, total - products.length)} sản phẩm`}
          </button>
        </div>
      )}
    </section>
  );
}
