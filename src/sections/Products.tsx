import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layers, ArrowDown, ArrowUp } from "lucide-react";
import type { ProductRecord } from "@owin/quote-engine";
import {
  fetchPublicProducts,
  getLoadMoreCount,
  INITIAL_PRODUCT_COUNT,
  LOAD_MORE_BATCH_SIZE,
  normalizeCategory,
} from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export function Products({
  onCalculate,
}: {
  onCalculate: (id: string) => void;
}) {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPublicProducts(0, INITIAL_PRODUCT_COUNT)
      .then((page) => {
        if (cancelled) return;
        setProducts(page.products);
        setTotal(page.total);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const page = await fetchPublicProducts(
        products.length,
        LOAD_MORE_BATCH_SIZE,
      );
      setProducts((current) => [...current, ...page.products]);
      setTotal(page.total);
      setIsExpanded(true);
    } catch {
      setStatus("error");
    } finally {
      setLoadingMore(false);
    }
  }, [products.length]);

  // Extract unique categories from loaded products
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      if (p.category) {
        const category = normalizeCategory(p.category);
        map.set(category, (map.get(category) || 0) + 1);
      }
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const displayedProducts = useMemo(() => {
    const filteredProducts =
      activeCategory === "all"
        ? products
        : products.filter(
            (p) => normalizeCategory(p.category) === activeCategory,
          );
    return isExpanded
      ? filteredProducts
      : filteredProducts.slice(0, INITIAL_PRODUCT_COUNT);
  }, [products, activeCategory, isExpanded]);

  if (status === "loading") {
    return (
      <section className="section" id="san-pham" aria-busy="true">
        <div className="section-head">
          <span className="eyebrow-chip">Danh mục sản phẩm</span>
          <h2 className="arch-section-title">Hồ sơ sản phẩm kiến trúc</h2>
        </div>
        <div className="arch-product-grid">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="arch-product-card-skeleton" />
          ))}
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="section" id="san-pham">
        <div className="arch-notice" role="alert">
          <p>Không tải được danh sách sản phẩm. Vui lòng thử lại sau.</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="section" id="san-pham" aria-labelledby="san-pham-title">
      <div className="section-head-between">
        <div>
          <span className="eyebrow-chip">
            <Layers size={13} className="eyebrow-icon" />
            Bộ sưu tập công trình
          </span>
          <h2 id="san-pham-title" className="arch-section-title">
            Danh mục sản phẩm tiêu chuẩn
          </h2>
          <p className="arch-section-desc">
            {total} giải pháp cửa nhôm kính định hình cao cấp · Báo giá chuẩn
            xác theo quy cách và diện tích
          </p>
        </div>

        {categories.length > 0 && (
          <div
            className="product-category-filter"
            role="tablist"
            aria-label="Lọc theo chủng loại"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === "all"}
              className={`filter-btn ${activeCategory === "all" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              Tất cả ({products.length})
            </button>
            {categories.slice(0, 5).map(([cat, count]) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={`filter-btn ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat} ({count})
              </button>
            ))}
          </div>
        )}
      </div>

      <motion.div className="arch-product-grid">
        <AnimatePresence>
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onCalculate={onCalculate}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {total > INITIAL_PRODUCT_COUNT && (
        <div className="section-more">
          {products.length < total && (
            <button
              type="button"
              className="btn btn-secondary btn-load-more"
              onClick={() => void loadMore()}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <span>Đang tải thêm...</span>
              ) : (
                <>
                  <span>
                    Xem thêm {getLoadMoreCount(total, products.length)} sản phẩm
                    khác
                  </span>
                  <ArrowDown size={15} />
                </>
              )}
            </button>
          )}

          {isExpanded ? (
            <button
              type="button"
              className="btn btn-secondary btn-load-more"
              onClick={() => setIsExpanded(false)}
              disabled={loadingMore}
            >
              <span>Ẩn bớt sản phẩm</span>
              <ArrowUp size={15} />
            </button>
          ) : products.length >= total ? (
            <button
              type="button"
              className="btn btn-secondary btn-load-more"
              onClick={() => setIsExpanded(true)}
            >
              <span>Hiện tất cả sản phẩm</span>
              <ArrowDown size={15} />
            </button>
          ) : null}
        </div>
      )}
    </section>
  );
}
