import { describe, expect, it } from 'vitest';
import { listImageUrl, thumbUrlFor } from '@/lib/images';

const BUCKET = 'https://example.supabase.co/storage/v1/object/public/product-images';

describe('thumbUrlFor', () => {
  it('đổi được ảnh phẳng (tạo trước khi có đa cửa hàng)', () => {
    expect(thumbUrlFor(`${BUCKET}/img/abc.webp`)).toBe(`${BUCKET}/thumb/abc.webp`);
  });

  it('đổi được ảnh có đoạn cửa hàng', () => {
    // Đây là chỗ dễ hỏng nhất: quên đoạn <store> tuỳ chọn thì hàm trả null cho
    // MỌI ảnh mới, và trang lặng lẽ tải ảnh gốc 3840px.
    expect(thumbUrlFor(`${BUCKET}/owin/img/abc.webp`)).toBe(`${BUCKET}/owin/thumb/abc.webp`);
  });

  it('trả null khi không phải ảnh gốc trên Storage', () => {
    expect(thumbUrlFor(`${BUCKET}/export/abc.webp`)).toBeNull();
    expect(thumbUrlFor('https://example.com/anh.jpg')).toBeNull();
    expect(thumbUrlFor(null)).toBeNull();
    expect(thumbUrlFor('')).toBeNull();
  });
});

describe('listImageUrl', () => {
  it('dùng bản thu nhỏ khi có', () => {
    expect(listImageUrl(`${BUCKET}/img/abc.webp`)).toBe(`${BUCKET}/thumb/abc.webp`);
  });

  it('rơi về ảnh gốc khi không có bản thu nhỏ tương ứng', () => {
    expect(listImageUrl('https://example.com/anh.jpg')).toBe('https://example.com/anh.jpg');
  });

  it('không có ảnh thì trả null, không bịa đường dẫn', () => {
    expect(listImageUrl(null)).toBeNull();
  });
});
