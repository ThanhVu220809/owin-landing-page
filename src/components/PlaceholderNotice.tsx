import { contactIsPlaceholder } from '@/content';
import { useSiteContent } from '@/SiteContentContext';

/**
 * Nhắc rằng thông tin liên hệ vẫn còn là số giả.
 *
 * Kiểm nội dung ĐANG DÙNG chứ không phải nội dung mặc định: chủ cửa hàng nhập
 * số thật trong công cụ quản trị là lời nhắc này phải tự biến mất, không cần ai
 * sửa code.
 *
 * Chỉ hiện lúc phát triển (`import.meta.env.DEV`), nên không bao giờ lọt ra bản
 * production — đưa lời nhắc nội bộ cho khách xem thì còn tệ hơn.
 */
export function PlaceholderNotice() {
  const { contact } = useSiteContent();
  if (!import.meta.env.DEV || !contactIsPlaceholder(contact)) return null;

  return (
    <p className="placeholder-notice" role="status">
      Thông tin liên hệ đang là số giả — sửa trong công cụ quản trị (Nội dung trang web),
      hoặc trong <code>src/content.ts</code> nếu muốn đổi giá trị mặc định.
    </p>
  );
}
