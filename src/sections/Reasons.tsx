import { content } from '@/content';

/**
 * Phần lý do.
 *
 * Nội dung mặc định chỉ nói về thứ trang này thật sự làm được — xem ghi chú ở
 * `content.ts`. Mảng rỗng thì ẩn cả phần, không hiện khung trống.
 */
export function Reasons() {
  if (content.reasons.length === 0) return null;

  return (
    <section className="section" id="vi-sao" aria-labelledby="vi-sao-title">
      <header className="section-head">
        <h2 id="vi-sao-title">Vì sao xem giá ở đây</h2>
      </header>

      <ul className="reason-grid">
        {content.reasons.map((reason) => (
          <li key={reason.title} className="reason-card">
            <h3>{reason.title}</h3>
            <p>{reason.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
