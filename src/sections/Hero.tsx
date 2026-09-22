import { motion } from 'motion/react';
import { ArrowDown, Phone, Calculator, Sparkles } from 'lucide-react';
import { useSiteContent } from '@/SiteContentContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function Hero() {
  const { hero, contact } = useSiteContent();

  const scrollToProducts = () => {
    document.getElementById('san-pham')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToCalculator = () => {
    document.getElementById('tinh-gia')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero-studio" aria-labelledby="hero-title">
      <div className="hero-studio-container">
        <motion.div
          className="hero-studio-copy"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {hero.eyebrow && (
            <motion.div variants={itemVariants} className="hero-eyebrow-container">
              <span className="arch-eyebrow">
                <span className="arch-eyebrow-dot" aria-hidden="true" />
                {hero.eyebrow}
                <span className="arch-eyebrow-divider">/</span>
                <span className="arch-eyebrow-sub">Kiến trúc nhôm kính cao cấp</span>
              </span>
            </motion.div>
          )}

          <motion.h1 id="hero-title" variants={itemVariants} className="hero-arch-title">
            {hero.title}
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-arch-desc">
            {hero.description}
          </motion.p>

          <motion.div variants={itemVariants} className="hero-arch-actions">
            <button
              type="button"
              className="btn btn-primary btn-arch"
              onClick={scrollToProducts}
            >
              <span>{hero.primaryCta}</span>
              <ArrowDown size={15} className="btn-icon" />
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-arch"
              onClick={scrollToCalculator}
            >
              <Calculator size={15} className="btn-icon" />
              <span>Tính giá ngay</span>
            </button>

            {contact.phone && (
              <a
                className="btn btn-ghost btn-arch"
                href={`tel:${contact.phone}`}
                aria-label={`Gọi tư vấn: ${contact.phoneLabel || contact.phone}`}
              >
                <Phone size={15} className="btn-icon" />
                <span>{hero.secondaryCta}</span>
              </a>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="hero-arch-meta">
            <div className="hero-meta-item">
              <Sparkles size={14} className="hero-meta-icon" />
              <span>Giá công khai theo kích thước thực tế</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-sep">·</span>
              <span>Đồng bộ nhôm thanh & phụ kiện tiêu chuẩn</span>
            </div>
          </motion.div>
        </motion.div>

        {hero.image && (
          <motion.div
            className="hero-media-wrapper"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="hero-media-frame">
              <img
                src={hero.image}
                alt={hero.title}
                decoding="async"
                className="hero-media-img"
              />
              <div className="hero-media-caption">
                <span>Giải pháp hệ cửa kiến trúc</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
