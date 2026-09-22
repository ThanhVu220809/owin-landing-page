import {
  Phone,
  MessageSquare,
  Send,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useSiteContent } from "@/SiteContentContext";

export function Contact() {
  const { contact } = useSiteContent();

  const details = [
    { label: "Địa chỉ xưởng & showroom", value: contact.address, icon: MapPin },
    {
      label: "Giờ làm việc & tư vấn",
      value: contact.workingHours,
      icon: Clock,
    },
  ].filter((row) => row.value);

  return (
    <section
      className="section contact-premium-section"
      id="lien-he"
      aria-labelledby="lien-he-title"
    >
      <div className="contact-premium-card">
        <div className="contact-ambient-glow" aria-hidden="true" />

        <div className="contact-premium-grid">
          <div className="contact-premium-content">
            <span className="eyebrow-chip">Đồng hành cùng công trình</span>
            <h2 id="lien-he-title" className="contact-premium-title">
              Khởi tạo giải pháp cửa cho không gian của bạn
            </h2>
            <p className="contact-premium-desc">
              Gửi bản vẽ kiến trúc hoặc kích thước sơ bộ, đội ngũ kỹ thuật OWIN
              sẽ hỗ trợ bóc tách khối lượng, tư vấn hệ nhôm phù hợp và gửi bảng
              dự toán hoàn chỉnh.
            </p>

            <div className="contact-premium-actions">
              {contact.phone && (
                <a
                  className="btn btn-primary btn-lg"
                  href={`tel:${contact.phone}`}
                >
                  <Phone size={18} />
                  <span>
                    Gọi kỹ thuật: {contact.phoneLabel || contact.phone}
                  </span>
                </a>
              )}
              {contact.zaloUrl && (
                <a
                  className="btn btn-secondary btn-lg"
                  href={contact.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Send size={18} />
                  <span>Tư vấn qua Zalo</span>
                </a>
              )}
              {contact.messengerUrl && (
                <a
                  className="btn btn-secondary btn-lg"
                  href={contact.messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare size={18} />
                  <span>Nhắn qua Messenger</span>
                </a>
              )}
            </div>

            {details.length > 0 && (
              <div className="contact-premium-meta">
                {details.map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="contact-meta-box">
                      <div className="contact-meta-icon-wrap">
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="contact-meta-label">{row.label}</div>
                        <div className="contact-meta-val">{row.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {contact.address && (
            <div className="contact-map-panel">
              <div className="contact-map-heading">
                <div>
                  <span className="contact-meta-label">
                    showroom & xưởng Hoàng Anh OWIN
                  </span>
                  <strong>{contact.address}</strong>
                </div>
                {contact.mapUrl && (
                  <a
                    className="contact-map-link"
                    href={contact.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Mở vị trí trên Google Maps"
                    title="Mở trên Google Maps"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              <div className="contact-map-frame">
                <iframe
                  title={`Bản đồ đến ${contact.address}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
