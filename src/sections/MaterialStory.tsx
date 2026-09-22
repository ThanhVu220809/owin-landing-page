import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Sparkles, Layers, SlidersHorizontal, Check } from 'lucide-react';

interface AluminumSystem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  highlights: string[];
  specs: Array<{ label: string; value: string }>;
}

const SYSTEMS: AluminumSystem[] = [
  {
    id: 'lux-anode',
    title: 'OWIN Lux Anode',
    subtitle: 'Công nghệ Anodized bề mặt thượng hạng',
    badge: 'Đẳng cấp kiến trúc',
    description:
      'Lớp mạ Anode hóa sâu bảo vệ cốt nhôm khỏi tác động oxy hóa muối biển và tia cực tím. Sắc ánh kim titan mờ mịn màng, đem lại nét sang trọng tĩnh lặng cho công trình cao cấp.',
    highlights: [
      'Bề mặt Anode kháng muối biển & chống xước vượt trội',
      'Màu kim loại mờ satin, không bám vân tay',
      'Độ bền màu bảo hành chuẩn kiến trúc',
    ],
    specs: [
      { label: 'Công nghệ bề mặt', value: 'Anodizing tĩnh điện' },
      { label: 'Độ dày profile', value: '1.8mm – 2.5mm' },
      { label: 'Tiêu chuẩn gioăng', value: 'EPDM 2 lớp đàn hồi cao' },
      { label: 'Tương thích kính', value: 'Kính dán an toàn 8.38–12.38mm, Hộp kính 19mm' },
    ],
  },
  {
    id: 'xingfa-standard',
    title: 'Xingfa Kết Cấu Đa Khoang',
    subtitle: 'Chuẩn mực chịu tải và cách âm công trình',
    badge: 'Kết cấu bền vững',
    description:
      'Hệ profile khoang rỗng gia cường các đường gân so le tăng độ chịu lực uốn nén. Chống chịu gió bão cấp cao và cách âm hiệu quả cho không gian sống tĩnh tại.',
    highlights: [
      'Gân gia cường chịu áp lực gió cấp cao',
      'Sơn tĩnh điện AkzoNobel chống bay màu',
      'Kín nước tuyệt đối với rãnh thoát nước một chiều',
    ],
    specs: [
      { label: 'Hệ profile', value: 'Hệ 55, 63, 93 tiêu chuẩn' },
      { label: 'Độ dày profile', value: '1.4mm – 2.0mm' },
      { label: 'Cách âm', value: 'Giảm ồn lên đến 32dB' },
      { label: 'Phụ kiện tương thích', value: 'Kinlong, Draho, Cmech đồng bộ' },
    ],
  },
  {
    id: 'vat-canh',
    title: 'Hệ Vát Cạnh Tinh Giản',
    subtitle: 'Đường nét thanh thoát cho không gian hiện đại',
    badge: 'Tối giản không gian',
    description:
      'Mép vát góc tinh tế triệt tiêu cảm giác thô cứng của kim loại, tạo hiệu ứng thị giác thanh mảnh và hỗ trợ thoát nước bề mặt nhanh chóng, hạn chế đọng bụi bẩn.',
    highlights: [
      'Đường vát góc thanh lịch, tối ưu tỷ lệ kính lấy sáng',
      'Rãnh nẹp vát hạn chế tối đa bám bụi và đọng sương',
      'Chi phí hợp lý với chất lượng gia công chuẩn mực',
    ],
    specs: [
      { label: 'Kiểu dáng', value: 'Vát cạnh vát góc 45°' },
      { label: 'Độ dày nhôm', value: '1.2mm – 1.4mm' },
      { label: 'Ứng dụng', value: 'Cửa đi, cửa sổ, vách ngăn phòng' },
      { label: 'Màu sơn', value: 'Xám ghi, Cafe, Trắng sứ' },
    ],
  },
];

export function MaterialStory() {
  const [activeSystemId, setActiveSystemId] = useState('lux-anode');
  const activeSystem = SYSTEMS.find((s) => s.id === activeSystemId) || SYSTEMS[0];

  return (
    <section className="section material-story" id="he-nhom" aria-labelledby="he-nhom-title">
      <div className="section-head text-center">
        <span className="eyebrow-chip">
          <Layers size={13} className="eyebrow-icon" />
          Giải pháp vật liệu
        </span>
        <h2 id="he-nhom-title" className="arch-section-title">
          Kỹ nghệ hệ nhôm & giải pháp kiến trúc
        </h2>
        <p className="arch-section-desc">
          Mỗi hệ nhôm tại OWIN được tuyển chọn và định hình chính xác theo đặc thù khí hậu Việt Nam,
          kết hợp giữa độ bền cơ học và nét tối giản thẩm mỹ.
        </p>
      </div>

      <div className="system-tabs" role="tablist" aria-label="Các hệ nhôm kiến trúc">
        {SYSTEMS.map((system) => {
          const isActive = system.id === activeSystemId;
          return (
            <button
              key={system.id}
              role="tab"
              aria-selected={isActive}
              className={`system-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveSystemId(system.id)}
            >
              <span className="system-tab-name">{system.title}</span>
              <span className="system-tab-badge">{system.badge}</span>
              {isActive && (
                <motion.div
                  className="system-tab-line"
                  layoutId="activeSystemIndicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSystem.id}
          className="system-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="system-grid">
            <div className="system-narrative">
              <span className="system-badge-pill">
                <Sparkles size={12} />
                {activeSystem.badge}
              </span>
              <h3 className="system-heading">{activeSystem.title}</h3>
              <p className="system-subtitle">{activeSystem.subtitle}</p>
              <p className="system-description">{activeSystem.description}</p>

              <div className="system-highlights">
                <h4 className="system-highlights-title">Đặc tính kỹ thuật trọng tâm:</h4>
                <ul className="system-highlights-list">
                  {activeSystem.highlights.map((h) => (
                    <li key={h} className="system-highlight-item">
                      <Check size={16} className="highlight-check" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="system-specs-panel">
              <div className="system-specs-head">
                <SlidersHorizontal size={16} />
                <span>Hồ sơ tiêu chuẩn kỹ thuật</span>
              </div>

              <dl className="system-specs-dl">
                {activeSystem.specs.map((spec) => (
                  <div key={spec.label} className="system-spec-row">
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="system-specs-guarantee">
                <ShieldCheck size={18} className="guarantee-icon" />
                <div className="guarantee-text">
                  <strong>Cam kết hồ sơ chính hãng</strong>
                  <span>Đồng bộ nhôm thanh định hình, hệ gioăng và phụ kiện theo hồ sơ kỹ thuật.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
