import { PostgrestClient } from '@supabase/postgrest-js';

/**
 * Đường đọc dữ liệu của trang công khai.
 *
 * Dùng thẳng `postgrest-js` chứ KHÔNG dùng `supabase-js`. Trang này chỉ làm một
 * việc: `select` vài bảng bằng anon key. Gói `supabase-js` đầy đủ kéo theo cả
 * realtime (kèm phoenix), đăng nhập và storage — đo được trong bundle, và không
 * dòng nào trong số đó được gọi ở đây. Khách vào bằng 3G không nên phải tải một
 * client realtime để xem giá cửa.
 *
 * Không có phiên đăng nhập nào, nên mọi truy vấn đi vào role `anon` và RLS
 * quyết định đọc được gì. Trang không tự giới hạn lấy — nó dựa vào hàng rào ở
 * database.
 */
const url = import.meta.env.VITE_SUPABASE_URL ?? "";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const hasSupabaseConfig = Boolean(url && anonKey);

export const supabase = hasSupabaseConfig
  ? new PostgrestClient(`${url.replace(/\/+$/, "")}/rest/v1`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    })
  : null;

/** Cửa hàng mà bản deploy này phục vụ. */
export const STORE_ID = import.meta.env.VITE_STORE_ID || 'owin';
