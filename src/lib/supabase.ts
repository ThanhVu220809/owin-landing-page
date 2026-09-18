import { createClient } from '@supabase/supabase-js';

/**
 * Client Supabase của trang công khai.
 *
 * Dùng anon key và **không có đăng nhập**. Mọi truy vấn từ đây đi vào role
 * `anon`, và RLS quyết định đọc được gì — trang này không tự giới hạn lấy, nó
 * dựa vào hàng rào ở database.
 *
 * `persistSession: false` là cố ý: trang công khai không có phiên nào để giữ,
 * và không được vô tình nhặt phiên của công cụ quản trị nếu sau này hai bên
 * dùng chung tên miền.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY. Chép .env.example thành .env rồi điền.',
  );
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Cửa hàng mà bản deploy này phục vụ. */
export const STORE_ID = import.meta.env.VITE_STORE_ID || 'owin';
