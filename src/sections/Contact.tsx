import { useSiteContent } from '@/SiteContentContext';

/**
 * Liên hệ.
 *
 * Ba nút, không form, không ghi gì xuống database — khách nhắn thẳng qua kênh
 * họ vốn đã dùng. Form liên hệ sẽ kéo theo chuyện lưu trữ dữ liệu cá nhân mà
 * trang chỉ-đọc này cố tình không đụng tới.
 */
export function Contact() {
  const { contact } = useSiteContent();

  return (
    <section className="section" id="lien-he" aria-labelledby="lien-he-title">
      <div className="contact-card">
        <header className="section-head">
          <h2 id="lien-he-title">Liên hệ</h2>
          <p className="muted">Gửi kích thước và nhu cầu, chúng tôi báo giá chi tiết.</p>
        </header>

        <div className="contact-actions">
          <a className="btn btn-primary" href={`tel:${contact.phone}`}>
            Gọi {contact.phoneLabel}
          </a>
          <a className="btn" href={contact.zaloUrl} target="_blank" rel="noopener noreferrer">
            Zalo
          </a>
          <a className="btn" href={contact.messengerUrl} target="_blank" rel="noopener noreferrer">
            Messenger
          </a>
        </div>

        <dl className="contact-details">
          <div>
            <dt>Địa chỉ</dt>
            <dd>{contact.address}</dd>
          </div>
          <div>
            <dt>Giờ làm việc</dt>
            <dd>{contact.workingHours}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
