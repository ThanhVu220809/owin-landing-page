// Đường dẫn TƯƠNG ĐỐI, không dùng alias `@`: file này được `vite.config.ts`
// import, mà alias thì lại do chính config đó định nghĩa — dùng alias ở đây là
// vòng lặp gà-trứng, config không load nổi.
import { contactIsPlaceholder, type SiteContent } from './content.ts';

/** Chèn giá trị vào thuộc tính HTML thì phải thoát, kể cả khi nội dung do mình viết. */
function attr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Các thẻ trong `<head>` của trang, dựng từ nội dung.
 *
 * Tách khỏi `vite.config.ts` để test được. Phần lớn logic ở đây là các nhánh
 * CHƯA ai chạy tới — canonical và dữ liệu có cấu trúc chỉ bật lên khi chủ cửa
 * hàng điền tên miền và số điện thoại thật. Không có test thì lỗi ở đó chỉ lộ
 * ra đúng lúc trang lên sóng.
 */
export function buildHeadTags(content: SiteContent): string[] {
  const { seo, brand } = content;

  const tags: string[] = [
    `<meta name="description" content="${attr(seo.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${attr(brand)}" />`,
    `<meta property="og:title" content="${attr(seo.title)}" />`,
    `<meta property="og:description" content="${attr(seo.description)}" />`,
    `<meta name="twitter:card" content="${seo.ogImage ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${attr(seo.title)}" />`,
    `<meta name="twitter:description" content="${attr(seo.description)}" />`,
  ];

  // Chỉ khai canonical/og:url khi đã biết tên miền thật. Đoán bừa là chỉ cho
  // công cụ tìm kiếm một địa chỉ sai để đi theo.
  if (seo.siteUrl) {
    tags.push(`<link rel="canonical" href="${attr(seo.siteUrl)}" />`);
    tags.push(`<meta property="og:url" content="${attr(seo.siteUrl)}" />`);
  }

  if (seo.ogImage) {
    tags.push(`<meta property="og:image" content="${attr(seo.ogImage)}" />`);
    tags.push(`<meta name="twitter:image" content="${attr(seo.ogImage)}" />`);
  }

  // Dữ liệu có cấu trúc là những khẳng định máy đọc được về một doanh nghiệp CÓ
  // THẬT. Còn số điện thoại giả thì tuyệt đối không phát ra — thà không có còn
  // hơn khai báo sai địa chỉ và số liên lạc của cửa hàng.
  if (!contactIsPlaceholder(content.contact)) {
    const business: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: brand,
      description: seo.description,
      telephone: content.contact.phone,
    };
    // Chỉ khai trường nào thật sự có. Phát ra `"address": ""` là khẳng định với
    // máy rằng cửa hàng có địa chỉ rỗng, tệ hơn là không nói gì về địa chỉ.
    if (content.contact.address) business.address = content.contact.address;

    // CỐ Ý KHÔNG khai `openingHours`.
    //
    // schema.org đòi dạng máy đọc được — `Mo-Sa 07:00-17:00`. Giờ làm việc trên
    // trang là chữ cho người đọc ("T2–T7: 7:00–17:00"), do chủ cửa hàng tự gõ
    // nên viết kiểu gì cũng có. Đổ thẳng chuỗi đó vào đây là phát ra dữ liệu
    // sai định dạng, còn tệ hơn không khai; mà thêm một trường riêng đúng định
    // dạng thì lại thành hai nơi phải nhớ sửa cùng lúc, và sẽ lệch ngay lần đầu
    // chủ cửa hàng đổi giờ trong công cụ quản trị.
    //
    // Giờ làm việc vẫn hiện đầy đủ cho KHÁCH ở phần Liên hệ.
    if (seo.siteUrl) business.url = seo.siteUrl;
    if (seo.ogImage) business.image = seo.ogImage;
    // `</script>` lọt vào trong JSON sẽ đóng sớm thẻ script và biến phần còn lại
    // thành HTML. Thoát dấu `<` là chặn được.
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(business).replace(/</g, '\\u003c')}</script>`,
    );
  }

  return tags;
}
