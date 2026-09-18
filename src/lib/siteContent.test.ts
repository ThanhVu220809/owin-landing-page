import { describe, expect, it } from 'vitest';
import { content as defaults } from '@/content';
import { mergeSiteContent } from '@/lib/siteContent';

describe('mergeSiteContent', () => {
  it('không có tài liệu thì giữ nguyên mặc định', () => {
    expect(mergeSiteContent(defaults, null)).toEqual(defaults);
    expect(mergeSiteContent(defaults, {})).toEqual(defaults);
  });

  it('ô để trống nghĩa là dùng mặc định, không phải xoá trắng', () => {
    // Chủ cửa hàng điền dở dang thì trang vẫn phải hoàn chỉnh, không thủng lỗ chỗ.
    const merged = mergeSiteContent(defaults, {
      hero: { title: 'Cửa nhôm Hoàng Anh', description: '   ' },
    });
    expect(merged.hero.title).toBe('Cửa nhôm Hoàng Anh');
    expect(merged.hero.description).toBe(defaults.hero.description);
    expect(merged.hero.primaryCta).toBe(defaults.hero.primaryCta);
  });

  it('lấy được liên hệ thật của chủ cửa hàng', () => {
    const merged = mergeSiteContent(defaults, {
      contact: {
        phone: '0912345678',
        phoneLabel: '0912 345 678',
        zaloUrl: 'https://zalo.me/0912345678',
        address: 'Số 1 Phố Thật',
      },
    });
    expect(merged.contact.phone).toBe('0912345678');
    expect(merged.contact.zaloUrl).toBe('https://zalo.me/0912345678');
    expect(merged.contact.address).toBe('Số 1 Phố Thật');
    // Không nhập Messenger thì giữ mặc định.
    expect(merged.contact.messengerUrl).toBe(defaults.contact.messengerUrl);
  });

  it('nhập số gọi mà quên số hiển thị thì lấy luôn số gọi', () => {
    // Đỡ bắt chủ cửa hàng gõ cùng một số hai lần, và quan trọng hơn: không để
    // trang hiện số GIẢ mặc định bên cạnh nút gọi số thật.
    const merged = mergeSiteContent(defaults, { contact: { phone: '0912345678' } });
    expect(merged.contact.phoneLabel).toBe('0912345678');
  });

  it('CHẶN javascript: trong tài liệu — không tin database', () => {
    // Tài liệu có thể bị sửa bằng đường khác ngoài giao diện quản trị, còn giá
    // trị này thì đi thẳng vào href chạy trên máy của khách.
    const merged = mergeSiteContent(defaults, {
      contact: {
        zaloUrl: 'javascript:alert(1)',
        messengerUrl: 'data:text/html,<script>alert(1)</script>',
      },
      hero: { imageUrl: 'javascript:alert(1)' },
    });
    expect(merged.contact.zaloUrl).toBe(defaults.contact.zaloUrl);
    expect(merged.contact.messengerUrl).toBe(defaults.contact.messengerUrl);
    expect(merged.hero.image).toBe(defaults.hero.image);
  });

  it('nhận ảnh hero hợp lệ', () => {
    const merged = mergeSiteContent(defaults, {
      hero: { imageUrl: 'https://example.supabase.co/storage/v1/object/public/a.webp' },
    });
    expect(merged.hero.image).toBe('https://example.supabase.co/storage/v1/object/public/a.webp');
  });

  it('đổi được tên thương hiệu', () => {
    expect(mergeSiteContent(defaults, { brand: { name: 'Hoàng Anh OWIN' } }).brand)
      .toBe('Hoàng Anh OWIN');
  });

  it('tài liệu sai kiểu không làm vỡ trang', () => {
    const merged = mergeSiteContent(defaults, { hero: 'chuoi', contact: 42, brand: [] });
    expect(merged).toEqual(defaults);
  });
});
