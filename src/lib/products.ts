import type { ProductRecord } from '@owin/quote-engine';
import { STORE_ID, supabase } from '@/lib/supabase';

/**
 * Đọc sản phẩm công khai của cửa hàng mà bản deploy này phục vụ.
 *
 * Trang này KHÔNG tự lọc `is_public` hay `deleted_at` — RLS ở database đã làm
 * việc đó (`products_public_read`). Lọc lại ở client chỉ tạo cảm giác an toàn
 * giả: ai cũng mở được devtools và gọi thẳng API.
 *
 * Lấy nguyên cột `data` vì phép tính giá cần gần hết `ProductRecord`: đơn vị,
 * đơn giá, kích thước mẫu, phụ kiện, và `rawPriceText` để biết giá đang là đơn
 * giá hay giá trọn gói. Cắt bớt trường ở đây là làm sai số tiền.
 */
export const PAGE_SIZE = 24;

export interface ProductPage {
  products: ProductRecord[];
  /** Tổng số sản phẩm công khai, để biết còn gì để tải thêm không. */
  total: number;
}

export async function fetchPublicProducts(offset = 0, limit = PAGE_SIZE): Promise<ProductPage> {
  const { data, error, count } = await supabase
    .from('products')
    .select('id,data', { count: 'exact' })
    .eq('store_id', STORE_ID)
    // Cùng thứ tự với tab Sản phẩm: thứ tự kéo-thả do chủ cửa hàng đặt, rồi mã.
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('code', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);

  return {
    products: (data ?? []).map((row) => (row as { data: ProductRecord }).data),
    total: count ?? 0,
  };
}
