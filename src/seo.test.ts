import { describe, expect, it } from 'vitest';
import { content, type SiteContent } from '@/content';
import { buildHeadTags } from '@/seo';

const FAKE_CONTACT: SiteContent['contact'] = {
  phone: '0000000000',
  phoneLabel: '0000 000 000',
  zaloUrl: 'https://zalo.me/0000000000',
  messengerUrl: 'https://m.me/example',
  address: '',
  workingHours: '',
};

const REAL_CONTACT: SiteContent['contact'] = {
  phone: '0912345678',
  phoneLabel: '0912 345 678',
  zaloUrl: 'https://zalo.me/0912345678',
  messengerUrl: 'https://m.me/owin',
  address: '123 Đường Thật, Hà Nội',
  workingHours: '8:00–18:00, T2–T7',
};

function withSeo(seo: Partial<SiteContent['seo']>, contact = content.contact): SiteContent {
  return { ...content, seo: { ...content.seo, ...seo }, contact };
}

describe('buildHeadTags', () => {
  it('luôn có mô tả và thẻ chia sẻ cơ bản', () => {
    const html = buildHeadTags(content).join('\n');
    expect(html).toContain('name="description"');
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:description"');
  });

  it('KHÔNG khai canonical khi chưa biết tên miền', () => {
    // Đoán bừa tên miền là chỉ cho công cụ tìm kiếm một địa chỉ sai để đi theo.
    const html = buildHeadTags(withSeo({ siteUrl: null })).join('\n');
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain('og:url');
  });

  it('khai canonical và og:url khi đã có tên miền', () => {
    const html = buildHeadTags(withSeo({ siteUrl: 'https://owin.vn' })).join('\n');
    expect(html).toContain('<link rel="canonical" href="https://owin.vn" />');
    expect(html).toContain('<meta property="og:url" content="https://owin.vn" />');
  });

  it('không có ảnh chia sẻ thì dùng thẻ summary, có thì dùng summary_large_image', () => {
    expect(buildHeadTags(withSeo({ ogImage: null })).join('\n'))
      .toContain('name="twitter:card" content="summary"');
    const withImage = buildHeadTags(withSeo({ ogImage: 'https://owin.vn/share.jpg' })).join('\n');
    expect(withImage).toContain('name="twitter:card" content="summary_large_image"');
    expect(withImage).toContain('property="og:image" content="https://owin.vn/share.jpg"');
  });

  it('KHÔNG phát dữ liệu có cấu trúc khi số liên hệ còn là số giả', () => {
    // Đây là khẳng định máy đọc được về một doanh nghiệp có thật. Khai số giả
    // còn tệ hơn là không khai gì.
    //
    // Dựng số giả ngay trong test chứ không dựa vào nội dung mặc định: mặc định
    // đã là số thật rồi, và test bám vào đó thì chỉ đo được "hôm nay dữ liệu
    // đang thế nào" chứ không đo được hành vi cần giữ.
    const html = buildHeadTags(withSeo({}, FAKE_CONTACT)).join('\n');
    expect(html).not.toContain('application/ld+json');
  });

  it('phát dữ liệu có cấu trúc với nội dung mặc định hiện tại', () => {
    // Số liên hệ đã thật, nên phần này phải BẬT.
    expect(buildHeadTags(content).join('\n')).toContain('"telephone":"0799040616"');
  });

  it('bỏ qua trường rỗng trong dữ liệu có cấu trúc', () => {
    // `"address": ""` là khẳng định rằng cửa hàng có địa chỉ rỗng — tệ hơn là
    // không nói gì về địa chỉ.
    const html = buildHeadTags(
      withSeo({}, { ...REAL_CONTACT, address: '', workingHours: '' }),
    ).join('\n');
    expect(html).toContain('application/ld+json');
    expect(html).not.toContain('"address"');
    expect(html).not.toContain('"openingHours"');
  });

  it('phát dữ liệu có cấu trúc khi số liên hệ đã thật', () => {
    const html = buildHeadTags(withSeo({ siteUrl: 'https://owin.vn' }, REAL_CONTACT)).join('\n');
    expect(html).toContain('application/ld+json');
    expect(html).toContain('"@type":"LocalBusiness"');
    expect(html).toContain('"telephone":"0912345678"');
    expect(html).toContain('"url":"https://owin.vn"');
  });

  it('thoát dấu ngoặc kép để không phá vỡ thuộc tính HTML', () => {
    const html = buildHeadTags(withSeo({ title: 'Cửa "xịn" & rẻ' })).join('\n');
    expect(html).toContain('content="Cửa &quot;xịn&quot; &amp; rẻ"');
  });

  it('thoát `<` trong JSON-LD để không đóng sớm thẻ script', () => {
    // Một `</script>` lọt vào địa chỉ sẽ kết thúc thẻ script và biến phần còn
    // lại của trang thành HTML lạ.
    const html = buildHeadTags(
      withSeo({}, { ...REAL_CONTACT, address: 'Số 1 </script><b>x</b>' }),
    ).join('\n');
    expect(html).not.toContain('</script><b>');
    expect(html).toContain('\\u003c/script');
  });
});
