/**
 * Ảnh sản phẩm trên Supabase Storage.
 *
 * `coverImagePath` trong dữ liệu thật đã là URL công khai đầy đủ, nên trang này
 * không phải dựng đường dẫn — chỉ cần biết quy ước bản thu nhỏ.
 *
 * QUY ƯỚC (giống công cụ quản trị): ảnh gốc ở `.../product-images/<store>/img/<hash>`,
 * bản thu nhỏ ở `.../product-images/<store>/thumb/<hash>`. Ảnh tạo từ trước khi
 * có đa cửa hàng nằm phẳng ở gốc bucket (`.../product-images/img/<hash>`) và
 * không được dời đi, nên đoạn `<store>` phải là TUỲ CHỌN.
 *
 * Bỏ sót chỗ tuỳ chọn đó thì mọi ảnh mới rơi về bản gốc 3840px — trang vẫn chạy
 * nên không ai nhận ra, chỉ là tải nặng gấp nhiều lần trên điện thoại.
 */
const MASTER_SEGMENT = /\/product-images\/((?:[^/]+\/)?)img\//;

/**
 * URL bản thu nhỏ của một ảnh gốc, hoặc `null` nếu URL không phải ảnh gốc trên
 * Storage (khi đó không có bản thu nhỏ tương ứng để mà dùng).
 */
export function thumbUrlFor(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = MASTER_SEGMENT.exec(url);
  if (!match) return null;
  return url.replace(match[0], `/product-images/${match[1]}thumb/`);
}

/**
 * Ảnh để hiển thị trong danh sách: ưu tiên bản thu nhỏ, không có thì dùng ảnh
 * gốc, không có nữa thì `null` để phía gọi tự quyết định chỗ trống.
 */
export function listImageUrl(coverImagePath: string | null | undefined): string | null {
  if (!coverImagePath) return null;
  return thumbUrlFor(coverImagePath) ?? coverImagePath;
}
