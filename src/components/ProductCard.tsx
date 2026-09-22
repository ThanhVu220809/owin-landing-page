import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ImageOff } from 'lucide-react';
import type { ProductRecord } from '@owin/quote-engine';
import { listImageUrl } from '@/lib/images';
import { formatVnd } from '@/lib/format';
import { priceFor } from '@/lib/price';

const MAX_SPECS = 3;

/**
 * Nhãn nói rõ con số đang là giá của CÁI GÌ.
 * Giữ nguyên logic chặt chẽ của hệ thống.
 */
function priceLabel(product: ProductRecord): string {
  if (product.unit === 'BO') return 'Trọn bộ tiêu chuẩn';
  if (!product.rawSizeText) return 'Đơn giá tham khảo';
  return `Kích thước mẫu ${product.rawSizeText.replace(/\./g, ',')} m`;
}

export function ProductCard({
  product,
  onCalculate,
}: {
  product: ProductRecord;
  onCalculate: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const image = listImageUrl(product.coverImagePath);
  const price = priceFor(product);
  const specs = (product.specs ?? []).slice(0, MAX_SPECS);

  return (
    <motion.article
      className="arch-product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <div className="arch-card-media">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="arch-card-img"
          />
        ) : (
          <div className="arch-card-noimage">
            <ImageOff size={20} className="noimage-icon" />
            <span>Chưa có ảnh</span>
          </div>
        )}
        {product.category && (
          <span className="arch-card-category-tag">{product.category}</span>
        )}
      </div>

      <div className="arch-card-body">
        <h3 className="arch-card-title" title={product.name}>
          {product.name}
        </h3>

        <div className="arch-card-specs">
          {specs.map((spec) => (
            <div key={spec.key} className="arch-spec-row">
              <dt>{spec.key}</dt>
              <dd title={spec.value}>{spec.value}</dd>
            </div>
          ))}
          {specs.length === 0 && (
            <div className="arch-spec-row">
              <dt>Tiêu chuẩn</dt>
              <dd>Định hình chuẩn kiến trúc</dd>
            </div>
          )}
        </div>

        <div className="arch-card-footer">
          <div className="arch-price-block">
            <span className="arch-price-label">{priceLabel(product)}</span>
            <strong className="arch-price-value">{formatVnd(price.displayVnd)}</strong>
          </div>

          <button
            type="button"
            className="arch-card-btn"
            onClick={() => onCalculate(product.id)}
            aria-label={`Tính giá cho ${product.name}`}
          >
            <span>Tính giá</span>
            <motion.span
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ duration: 0.2 }}
              className="arch-btn-arrow-wrap"
            >
              <ArrowRight size={14} />
            </motion.span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
