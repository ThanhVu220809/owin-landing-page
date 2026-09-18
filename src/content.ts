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
