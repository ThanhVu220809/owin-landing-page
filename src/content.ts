/**
 * ===========================================================================
 * NỘI DUNG TRANG — NỘI DUNG TẠM, CHỜ CHỦ CỬA HÀNG THAY
 * ===========================================================================
 *
 * Toàn bộ chữ và thông tin liên hệ của trang nằm trong đúng file này. Sửa ở
 * đây rồi build lại là xong, không phải đụng vào component nào.
 *
 * ---------------------------------------------------------------------------
 * ĐỌC TRƯỚC KHI ĐƯA LÊN MẠNG
 * ---------------------------------------------------------------------------
 * Số điện thoại, Zalo, Messenger, địa chỉ dưới đây đều là SỐ GIẢ (`0000 000 000`
 * và `example.com`) — cố ý để nhìn là biết chưa thay, không phải số thật gõ
 * nhầm. Đưa trang lên mạng khi chúng còn nguyên nghĩa là khách bấm gọi sẽ
 * không gọi được ai.
 *
 * Phần chữ mô tả cố ý KHÔNG chứa con số hay lời hứa nào: không "15 năm kinh
 * nghiệm", không "5.000 công trình", không "bảo hành 10 năm". Những câu đó nghe
 * rất thật nên dễ bị bỏ quên rồi lên sóng — mà chúng là tuyên bố về một doanh
 * nghiệp có thật. Thêm vào chỉ khi bạn tự viết và tự chịu trách nhiệm.
 *
 * Phần mô tả sản phẩm thì đã đối chiếu với dữ liệu thật trong hệ thống: cửa
 * chính, cửa sổ, cửa phòng, cửa phụ, vách thông tầng — hệ Xingfa, OWIN Lux
 * Anode, hệ vát cạnh. Đó là những nhóm đang thật sự có trong bảng giá.
 */

export interface SiteContent {
  brand: string;
  seo: {
    /** Thẻ <title> và tiêu đề khi chia sẻ link. Khoảng 50–60 ký tự. */
    title: string;
    /** Mô tả khi chia sẻ link. Khoảng 120–160 ký tự. */
    description: string;
    /**
     * Địa chỉ trang khi đã lên mạng, ví dụ `https://owin.vn`. Không có dấu `/`
     * ở cuối. Để `null` cho tới khi biết tên miền thật — đoán bừa rồi nhúng vào
     * thẻ canonical là chỉ cho công cụ tìm kiếm một địa chỉ sai.
     */
    siteUrl: string | null;
    /**
     * Ảnh hiện ra khi chia sẻ link lên Zalo/Facebook. Phải là URL tuyệt đối.
     * Để `null` thì link chia sẻ chỉ có chữ, không có ảnh — vẫn chạy.
     */
    ogImage: string | null;
  };
  /**
   * Lý do nên chọn cửa hàng.
   *
   * ĐỌC KỸ: những mục mặc định dưới đây chỉ nói về thứ TRANG NÀY làm được —
   * xem giá ngay, giá khớp báo giá, thông số lấy từ bảng giá thật. Chúng đúng
   * vì code làm đúng như vậy.
   *
   * Muốn thêm "15 năm kinh nghiệm", "bảo hành 10 năm", "5.000 công trình" thì
   * tự viết và tự chịu trách nhiệm — code không chứng minh được những điều đó,
   * nên tôi không viết hộ. Để mảng này rỗng thì cả phần bị ẩn.
   */
  reasons: Array<{ title: string; body: string }>;
  hero: {
    /** Dòng nhỏ phía trên tiêu đề. Để trống thì không hiện. */
    eyebrow: string;
    title: string;
    /** Một đoạn ngắn, 1–2 câu. Đừng viết thành bài. */
    description: string;
    primaryCta: string;
    secondaryCta: string;
    /** URL ảnh nền hero. `null` thì hero chỉ có chữ. */
    image: string | null;
  };
  contact: {
    phone: string;
    /** Hiện cho người đọc; `phone` mới là số dùng để bấm gọi. */
    phoneLabel: string;
    zaloUrl: string;
    messengerUrl: string;
    address: string;
    workingHours: string;
  };
}

export const content: SiteContent = {
  brand: 'OWIN',

  seo: {
    title: 'OWIN — Cửa nhôm kính, xem giá ngay trên web',
    description:
      'Cửa chính, cửa sổ, cửa phòng và vách thông tầng hệ nhôm Xingfa, OWIN Lux '
      + 'Anode. Chọn sản phẩm, nhập kích thước và xem giá tham khảo ngay.',
    siteUrl: null,
    ogImage: null,
  },

  reasons: [
    {
      title: 'Biết giá trước khi gọi',
      body: 'Chọn sản phẩm, nhập kích thước và số lượng là thấy giá ngay — không phải chờ ai báo lại.',
    },
    {
      title: 'Giá trên web đúng bằng giá báo',
      body: 'Cùng một sản phẩm và cùng cấu hình thì con số ở đây trùng với báo giá chính thức.',
    },
    {
      title: 'Thông số lấy từ bảng giá thật',
      body: 'Màu, khung bao, bản cánh, loại kính hiển thị đúng như trong hồ sơ sản phẩm.',
    },
  ],

  hero: {
    eyebrow: 'Nhôm kính OWIN',
    title: 'Cửa nhôm cho ngôi nhà của bạn',
    description:
      'Cửa chính, cửa sổ, cửa phòng và vách thông tầng trên các hệ nhôm Xingfa, '
      + 'OWIN Lux Anode và hệ vát cạnh. Chọn sản phẩm, nhập kích thước, xem giá ngay.',
    primaryCta: 'Xem sản phẩm',
    secondaryCta: 'Gọi tư vấn',
    image: null,
  },

  // ↓↓↓ TẤT CẢ ĐỀU LÀ GIẢ — THAY TRƯỚC KHI ĐƯA LÊN MẠNG ↓↓↓
  contact: {
    phone: '0000000000',
    phoneLabel: '0000 000 000',
    zaloUrl: 'https://zalo.me/0000000000',
    messengerUrl: 'https://m.me/example',
    address: 'Chưa cập nhật địa chỉ',
    workingHours: 'Chưa cập nhật giờ làm việc',
  },
};

/**
 * Thông tin liên hệ đã được thay chưa?
 *
 * Dùng để trang tự cảnh báo lúc phát triển thay vì im lặng phục vụ số giả.
 */
export function contactIsPlaceholder(c: SiteContent['contact'] = content.contact): boolean {
  return c.phone.replace(/\D/g, '') === '0000000000'
    || c.messengerUrl.includes('example');
}
