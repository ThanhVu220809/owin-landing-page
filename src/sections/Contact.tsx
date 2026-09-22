import { useSiteContent } from '@/SiteContentContext';

/**
 * Liên hệ.
 *
 * Ba nút, không form, không ghi gì xuống database — khách nhắn thẳng qua kênh
 * họ vốn đã dùng. Form liên hệ sẽ kéo theo chuyện lưu trữ dữ liệu cá nhân mà
 * trang chỉ-đọc này cố tình không đụng tới.
 *
 * Kênh nào để trống thì **không hiện nút** của kênh đó. Nút trỏ vào một địa chỉ
 * bịa còn tệ hơn là không có nút: khách bấm vào rồi rơi vào chỗ không tồn tại.
 */
export function Contact() {
  const { contact } = useSiteContent();

  const details = [
    { label: 'Địa chỉ', value: contact.address },
    { label: 'Giờ làm việc', value: contact.workingHours },
  ].filter((row) => row.value);

  return (
    <section className="section" id="lien-he" aria-labelledby="lien-he-title">
      <div className="contact-card">
        <header className="section-head">
          <h2 id="lien-he-title">Liên hệ</h2>
          <p className="muted">Gửi kích thước và nhu cầu, chúng tôi báo giá chi tiết.</p>
        </header>

        <div className="contact-actions">
          {contact.phone && (
            <a className="btn btn-primary" href={`tel:${contact.phone}`}>
              Gọi {contact.phoneLabel || contact.phone}
            </a>
          )}
          {contact.zaloUrl && (
            <a className="btn" href={contact.zaloUrl} target="_blank" rel="noopener noreferrer">
              Zalo
            </a>
          )}
          {contact.messengerUrl && (
            <a className="btn" href={contact.messengerUrl} target="_blank" rel="noopener noreferrer">
              Messenger
            </a>
          )}
        </div>

        {details.length > 0 && (
          <dl className="contact-details">
            {details.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
