import { contactIsPlaceholder } from '@/content';

/**
 * Nhắc rằng thông tin liên hệ vẫn còn là số giả.
 *
 * CHỈ hiện lúc phát triển (`import.meta.env.DEV`), nên nó không bao giờ lọt ra
 * bản production. Mục đích là người làm trang không quên — chứ đưa lời nhắc nội
 * bộ cho khách xem thì còn tệ hơn.
 */
export function PlaceholderNotice() {
  if (!import.meta.env.DEV || !contactIsPlaceholder()) return null;

  return (
    <p className="placeholder-notice" role="status">
      Thông tin liên hệ đang là số giả — sửa trong <code>src/content.ts</code> trước khi đưa lên mạng.
    </p>
  );
}
