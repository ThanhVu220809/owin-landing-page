import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator as CalcIcon, Phone, MessageCircle, Send, Ruler, Box, Info } from 'lucide-react';
import type { ProductRecord } from '@owin/quote-engine';
import { useSiteContent } from '@/SiteContentContext';
import { unitLabel } from '@/lib/format';
import { listImageUrl } from '@/lib/images';
import { priceFor } from '@/lib/price';
import { fetchProductById, fetchProductOptions, type ProductOption } from '@/lib/products';
import { ProductPicker } from '@/components/ProductPicker';
import { AnimatedPrice } from '@/components/AnimatedPrice';

function parseNumber(text: string): number {
  const value = Number(text.trim().replace(',', '.'));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function seedSize(product: ProductRecord): { width: string; height: string } {
  const parts = (product.rawSizeText ?? '').split(/\s*[xX*]\s*/);
  if (parts.length < 2) return { width: '', height: '' };
  return {
    width: (parts[0] ?? '').trim().replace('.', ','),
    height: (parts[1] ?? '').trim().replace('.', ','),
  };
}

export function Calculator({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { contact } = useSiteContent();
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [failed, setFailed] = useState(false);

  const widthId = useId();
  const heightId = useId();
  const quantityId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProductOptions()
      .then((list) => {
        if (!cancelled) setOptions(list);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setProduct(null);
      return;
    }
    let cancelled = false;
    setIsLoadingProduct(true);
    fetchProductById(selectedId)
      .then((record) => {
        if (cancelled || !record) return;
        setProduct(record);
        const size = seedSize(record);
        setWidth(size.width);
        setHeight(size.height);
        setQuantity('1');
        if (window.innerWidth < 860) {
          panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingProduct(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const needsSize = product ? product.unit !== 'BO' : false;
  const qty = Math.max(1, Math.round(parseNumber(quantity) || 1));

  const price = useMemo(() => {
    if (!product) return null;
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
        <div className="arch-notice" role="alert">
          <p>Không tải được dữ liệu sản phẩm. Vui lòng thử lại sau.</p>
        </div>
      </section>
    );
  }

  if (options.length === 0) return null;

  return (
    <section className="section quotation-studio" id="tinh-gia" aria-labelledby="tinh-gia-title">
      <div className="section-head">
        <span className="eyebrow-chip">
          <CalcIcon size={13} className="eyebrow-icon" />
          Xưởng tính giá trực tuyến
        </span>
        <h2 id="tinh-gia-title" className="arch-section-title">
          Báo giá dự toán kiến trúc tức thì
        </h2>
        <p className="arch-section-desc">
          Công thức tính đồng bộ theo hệ thống báo giá xưởng. Chọn quy cách cửa, nhập số đo thực tế để có con số dự toán minh bạch.
        </p>
      </div>

      <div className="studio-layout">
        {/* Left Column: Interactive Product Picker */}
        <ProductPicker options={options} selectedId={selectedId} onSelect={onSelect} />

        {/* Right Column: Dynamic Calculation Workbench */}
        <div className="studio-workbench" ref={panelRef}>
          <div className="workbench-inner">
            <div className="workbench-head">
              <span className="workbench-step">2. Thiết lập quy cách & Dự toán</span>
              {isLoadingProduct && <span className="workbench-loading-badge">Đang cập nhật...</span>}
            </div>

            <AnimatePresence mode="wait">
              {!product ? (
                <motion.div
                  key="empty-state"
                  className="workbench-empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="empty-icon-wrap">
                    <Ruler size={32} />
                  </div>
                  <h4 className="empty-title">Chưa chọn sản phẩm</h4>
                  <p className="empty-desc">
                    Vui lòng chọn một mẫu cửa từ danh sách bên trái (hoặc bấm &ldquo;Tính giá&rdquo; ở danh mục sản phẩm) để nhập kích thước và xem báo giá.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={product.id}
                  className="workbench-content"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  <div className="workbench-product-header">
                    {listImageUrl(product.coverImagePath) && (
                      <div className="workbench-product-thumb">
                        <img
                          src={listImageUrl(product.coverImagePath)!}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}
                    <div className="workbench-product-info">
                      <div className="workbench-product-tag">{product.category || 'Cửa nhôm kính'}</div>
                      <h3 className="workbench-product-title">{product.name}</h3>
                      {product.code && <span className="workbench-product-code">Mã: {product.code}</span>}
                    </div>
                  </div>

                  <div className="workbench-form">
                    {needsSize && (
                      <div className="workbench-input-row">
                        <div className="studio-field">
                          <label className="studio-label" htmlFor={widthId}>
                            Chiều rộng (m)
                          </label>
                          <div className="studio-input-wrap">
                            <input
                              id={widthId}
                              className="studio-input"
                              inputMode="decimal"
                              value={width}
                              onChange={(e) => setWidth(e.target.value)}
                              placeholder="1,2"
                            />
                            <span className="studio-unit">mét</span>
                          </div>
                        </div>

                        <div className="studio-field">
                          <label className="studio-label" htmlFor={heightId}>
                            Chiều cao (m)
                          </label>
                          <div className="studio-input-wrap">
                            <input
                              id={heightId}
                              className="studio-input"
                              inputMode="decimal"
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                              placeholder="2,2"
                            />
                            <span className="studio-unit">mét</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="workbench-input-row">
                      <div className="studio-field">
                        <label className="studio-label" htmlFor={quantityId}>
                          Số lượng bộ
                        </label>
                        <div className="studio-input-wrap">
                          <input
                            id={quantityId}
                            className="studio-input"
                            inputMode="numeric"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="1"
                          />
                          <span className="studio-unit">bộ</span>
                        </div>
                      </div>

                      {!needsSize && (
                        <div className="studio-unit-note">
                          <Box size={16} />
                          <span>
                            Sản phẩm tính theo {unitLabel(product.unit).toLowerCase()} (trọn gói)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {sizeMissing ? (
                    <div className="workbench-prompt">
                      <Info size={16} />
                      <span>Nhập kích thước chiều rộng và chiều cao để hệ thống tính giá.</span>
                    </div>
                  ) : (
                    price && (
                      <motion.div
                        className="workbench-summary"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="summary-row">
                          <span className="summary-label">Đơn giá thân cửa</span>
                          <AnimatedPrice value={price.productVnd} className="summary-val" />
                        </div>

                        {price.accessoryVnd > 0 && (
                          <div className="summary-row">
                            <span className="summary-label">Phụ kiện kim khí đồng bộ</span>
                            <AnimatedPrice value={price.accessoryVnd} className="summary-val" />
                          </div>
                        )}

                        <div className="summary-total-row">
                          <div>
                            <span className="total-title">Tạm tính dự toán</span>
                            <span className="total-subtitle">
                              {needsSize
                                ? `(${parseNumber(width).toFixed(2)}m × ${parseNumber(height).toFixed(2)}m × ${qty} bộ)`
                                : `(${qty} bộ)`}
                            </span>
                          </div>
                          <AnimatedPrice value={price.displayVnd} className="total-price" />
                        </div>
                      </motion.div>
                    )
                  )}

                  <div className="workbench-notice">
                    <p>
                      * Giá dự toán tham khảo chưa bao gồm chi phí vận chuyển ngoại tỉnh và nhân công lắp đặt đặc thù. Kỹ thuật viên sẽ khảo sát hiện trường trước khi ký hợp đồng.
                    </p>
                  </div>

                  <div className="workbench-actions">
                    {contact.phone && (
                      <a className="btn btn-primary btn-wb" href={`tel:${contact.phone}`}>
                        <Phone size={16} />
                        <span>Gọi đặt lịch khảo sát</span>
                      </a>
                    )}
                    {contact.zaloUrl && (
                      <a
                        className="btn btn-secondary btn-wb"
                        href={contact.zaloUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Send size={15} />
                        <span>Gửi kích thước qua Zalo</span>
                      </a>
                    )}
                    {contact.messengerUrl && (
                      <a
                        className="btn btn-secondary btn-wb"
                        href={contact.messengerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle size={15} />
                        <span>Messenger</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
