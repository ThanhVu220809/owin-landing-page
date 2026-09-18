/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  /**
   * Cửa hàng mà BẢN DEPLOY này phục vụ.
   *
   * Lấy từ cấu hình lúc build, không bao giờ từ phiên đăng nhập — trang này
   * không có đăng nhập. Đổi cửa hàng là đổi biến môi trường, không sửa code.
   */
  readonly VITE_STORE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
