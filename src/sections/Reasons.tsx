import { motion } from 'motion/react';
import { Shield, CheckCircle } from 'lucide-react';
import { useSiteContent } from '@/SiteContentContext';

export function Reasons() {
  const content = useSiteContent();
  if (content.reasons.length === 0) return null;

  return (
    <section className="section reasons-section" id="vi-sao" aria-labelledby="vi-sao-title">
      <div className="section-head text-center">
        <span className="eyebrow-chip">
          <Shield size={13} className="eyebrow-icon" />
          Nguyên tắc vận hành
        </span>
        <h2 id="vi-sao-title" className="arch-section-title">
          Chuẩn mực minh bạch trong từng báo giá
        </h2>
        <p className="arch-section-desc">
          Xóa bỏ tình trạng mập mờ giá theo cảm tính. OWIN cung cấp công cụ tính giá trực tiếp dựa trên đơn giá chuẩn và quy cách sản xuất thật.
        </p>
      </div>

      <div className="reasons-grid">
        {content.reasons.map((reason, index) => (
          <motion.div
            key={reason.title}
            className="reason-arch-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="reason-card-head">
              <span className="reason-index">{String(index + 1).padStart(2, '0')}</span>
              <CheckCircle size={18} className="reason-icon" />
            </div>
            <h3 className="reason-arch-title">{reason.title}</h3>
            <p className="reason-arch-body">{reason.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
