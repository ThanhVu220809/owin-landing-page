import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ProductRecord } from '@owin/quote-engine';
import { content } from '@/content';
import { formatVnd, unitLabel } from '@/lib/format';
import { priceFor } from '@/lib/price';
import { fetchProductById, fetchProductOptions, type ProductOption } from '@/lib/products';
import { ProductPicker } from '@/components/ProductPicker';

/**
 * Người Việt gõ số lẻ bằng dấu phẩy ("1,2") nhiều hơn dấu chấm. Nhận cả hai,
 * đừng bắt khách đoán kiểu nào mới đúng.
 */
function parseNumber(text: string): number {
  const value = Number(text.trim().replace(',', '.'));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/** Kích thước mẫu của sản phẩm, để ô nhập không trống trơn lúc mới chọn. */
function seedSize(product: ProductRecord): { width: string; height: string } {
  const parts = (product.rawSizeText ?? '').split(/\s*[xX*]\s*/);
  if (parts.length < 2) return { width: '', height: '' };
  return {
    width: (parts[0] ?? '').trim().replace('.', ','),
    height: (parts[1] ?? '').trim().replace('.', ','),
  };
}

/**
 * Bộ tính giá — trọng tâm của trang.
 *
 * Mọi con số ở đây do `priceFor` tính, tức là đi đúng nhánh Báo giá của engine
 * dùng chung. Không có một công thức nào được viết lại trong file này; chỗ duy
 * nhất file này chạm tới số học là đọc chuỗi người dùng gõ thành số.
 */
export function Calculator({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [failed, setFailed] = useState(false);

  const widthId = useId();
  const heightId = useId();
  const quantityId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProductOptions()
      .then((list) => { if (!cancelled) setOptions(list); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedId) { setProduct(null); return; }
    let cancelled = false;
    fetchProductById(selectedId)
      .then((record) => {
        if (cancelled || !record) return;
        setProduct(record);
        const size = seedSize(record);
        setWidth(size.width);
        setHeight(size.height);
        setQuantity('1');
        // Ở khổ hẹp, bộ chọn và bảng kết quả xếp chồng nhau, nên chọn xong thì
        // giá nằm dưới màn hình — khách bấm một cái rồi tưởng không có gì xảy
        // ra. Khổ rộng thì hai bên nằm cạnh nhau, không cần cuộn.
        if (window.innerWidth < 860) {
          panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [selectedId]);

  const needsSize = product ? product.unit !== 'BO' : false;
  const qty = Math.max(1, Math.round(parseNumber(quantity) || 1));

  const price = useMemo(() => {
    if (!product) return null;
    // Sản phẩm bán theo bộ thì engine bỏ qua kích thước — không cần chặn ở đây,
    // nhưng cũng đừng gửi số rác xuống.
    return priceFor(product, {
      widthM: needsSize ? parseNumber(width) : null,
      heightM: needsSize ? parseNumber(height) : null,
      quantity: qty,
    });
  }, [product, needsSize, width, height, qty]);

  const sizeMissing = needsSize && (parseNumber(width) <= 0 || parseNumber(height) <= 0);

  if (failed) {
    return (
      <section className="section" id="tinh-gia">
        <p className="notice" role="alert">Không tải được dữ liệu sản phẩm. Vui lòng thử lại sau.</p>
      </section>
    );
  }

  if (options.length === 0) return null;

  return (
    <section className="section calculator" id="tinh-gia" aria-labelledby="tinh-gia-title">
      <header className="section-head">
        <h2 id="tinh-gia-title">Tính giá nhanh</h2>
        <p className="muted">Chọn sản phẩm, nhập kích thước và số lượng để xem giá ngay.</p>
      </header>

      <div className="calculator-grid">
        <ProductPicker options={options} selectedId={selectedId} onSelect={onSelect} />

        <div className="calculator-panel" ref={panelRef}>
          {!product ? (
            <p className="calculator-hint">Chọn một sản phẩm ở bên để bắt đầu.</p>
          ) : (
            <>
              <h3 className="calculator-product">{product.name}</h3>

              <div className="calculator-inputs">
                {needsSize && (
                  <>
                    <div className="field">
                      <label className="field-label" htmlFor={widthId}>Rộng (m)</label>
                      <input
                        id={widthId}
                        className="input"
                        inputMode="decimal"
                        value={width}
                        onChange={(event) => setWidth(event.target.value)}
                        placeholder="1,2"
                      />
                    </div>
                    <div className="field">
                      <label className="field-label" htmlFor={heightId}>Cao (m)</label>
                      <input
                        id={heightId}
                        className="input"
                        inputMode="decimal"
                        value={height}
                        onChange={(event) => setHeight(event.target.value)}
                        placeholder="2,2"
                      />
                    </div>
                  </>
                )}
                <div className="field">
                  <label className="field-label" htmlFor={quantityId}>Số lượng</label>
                  <input
                    id={quantityId}
                    className="input"
                    inputMode="numeric"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    placeholder="1"
                  />
                </div>
              </div>

              {!needsSize && (
                <p className="calculator-note">
                  Sản phẩm bán theo {unitLabel(product.unit).toLowerCase()} — giá không phụ thuộc kích thước.
                </p>
              )}

              {sizeMissing ? (
                <p className="calculator-hint">Nhập chiều rộng và chiều cao để xem giá.</p>
              ) : price && (
                <div className="calculator-result" aria-live="polite">
                  <div className="calculator-line">
                    <span>Tiền sản phẩm</span>
                    <strong>{formatVnd(price.productVnd)}</strong>
                  </div>
                  {price.accessoryVnd > 0 && (
                    <div className="calculator-line">
                      <span>Phụ kiện đi kèm</span>
                      <strong>{formatVnd(price.accessoryVnd)}</strong>
                    </div>
                  )}
                  <div className="calculator-line calculator-total">
                    <span>Tạm tính</span>
                    <strong>{formatVnd(price.displayVnd)}</strong>
                  </div>
                </div>
              )}

              <p className="calculator-disclaimer">
                Giá tham khảo, chưa gồm lắp đặt và vận chuyển. Số cuối cùng theo khảo sát thực tế.
              </p>

              <div className="calculator-actions">
                <a className="btn btn-primary" href={`tel:${content.contact.phone}`}>Gọi</a>
                <a className="btn" href={content.contact.zaloUrl} target="_blank" rel="noopener noreferrer">Zalo</a>
                <a className="btn" href={content.contact.messengerUrl} target="_blank" rel="noopener noreferrer">Messenger</a>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
