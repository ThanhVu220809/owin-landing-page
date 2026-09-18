import type { ProductRecord } from '@owin/quote-engine';
import { listImageUrl } from '@/lib/images';
import { formatVnd } from '@/lib/format';
import { priceFor } from '@/lib/price';

const MAX_SPECS = 3;

/**
 * Nhãn nói rõ con số đang là giá của CÁI GÌ.
 *
 * `rawSizeText` là kích thước tính bằng MÉT ("2.80 x 2.80"), không phải diện
 * tích — nên không được ghép nhãn đơn vị `m²` vào sau nó. Sản phẩm bán theo bộ
 * thì không có kích thước để nói.
 */
function priceLabel(product: ProductRecord): string {
  if (product.unit === 'BO') return 'Giá tham khảo · trọn bộ';
  if (!product.rawSizeText) return 'Giá tham khảo';
  return `Giá tham khảo · kích thước mẫu ${product.rawSizeText.replace(/\./g, ',')} m`;
}

/**
 * Một sản phẩm trong danh sách.
 *
 * Chỉ hiển thị những gì dữ liệu thật CÓ. Sản phẩm không có ảnh thì để ô trống
 * có nhãn, không dùng ảnh thay thế; không có thông số thì bỏ hàng thông số.
 * Không bịa mô tả, không bịa lời quảng cáo.
 */
export function ProductCard({ product }: { product: ProductRecord }) {
  const image = listImageUrl(product.coverImagePath);
  const price = priceFor(product);
  const specs = (product.specs ?? []).slice(0, MAX_SPECS);

  return (
    <article className="product-card">
      <div className="product-card-media">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="product-card-noimage">Chưa có ảnh</span>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <h3 className="product-card-name">{product.name}</h3>

        {specs.length > 0 && (
          <dl className="product-card-specs">
            {specs.map((spec) => (
              <div key={spec.key}>
                <dt>{spec.key}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="product-card-price">
          <div className="product-card-price-label">{priceLabel(product)}</div>
          <strong>{formatVnd(price.displayVnd)}</strong>
        </div>
      </div>
    </article>
  );
}
