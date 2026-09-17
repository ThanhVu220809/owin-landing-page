import { describe, expect, it } from 'vitest';
import { buildCatalogueMoneyBlocks, type ProductRecord } from '@owin/quote-engine';
import { priceFor } from '@/lib/price';

function sampleProduct(overrides: Partial<ProductRecord> = {}): ProductRecord {
  return {
    id: 'p1', numericId: 1, code: 'SP0001', name: 'Cửa mẫu', slug: 'cua-mau',
    category: 'Cửa Chính', unit: 'M2', unitPriceVnd: 2_000_000,
    shortDesc: null, coverImagePath: null, gallery: [],
    rawSizeText: '1.196 x 1.796',
    // Dấu "/" = đơn giá, không phải giá trọn gói.
    rawPriceText: '2.000.000/m2',
    specs: [], accessories: [], fixedAccessoryPackage: null, extraAccessories: '[]',
    isFeatured: false, isPublic: true,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  } as unknown as ProductRecord;
}

describe('priceFor — nhánh Báo giá cho cả thẻ sản phẩm lẫn bộ tính giá', () => {
  it('không truyền cấu hình thì dùng kích thước mẫu của sản phẩm', () => {
    const price = priceFor(sampleProduct());
    expect(price.totalVnd).toBe(4_296_000);
    // Số hiển thị đã làm tròn xuống bội số 100.000.
    expect(price.displayVnd).toBe(4_200_000);
  });

  it('thẻ sản phẩm và bộ tính giá ra CÙNG con số khi cùng cấu hình', () => {
    const product = sampleProduct();
    const card = priceFor(product);
    const calculator = priceFor(product, { widthM: 1.196, heightM: 1.796, quantity: 1 });
    // Đây là lời hứa của cả trang. Gãy dòng này nghĩa là khách nhìn thấy hai
    // con số khác nhau cho cùng một sản phẩm.
    expect(calculator).toEqual(card);
  });

  it('KHÔNG dùng nhánh Bảng giá — hai nhánh lệch nhau thật', () => {
    const product = sampleProduct();
    // Giữ lại phép so sánh này để khoảng chênh luôn hiện ra trong test, thay vì
    // chỉ nằm trong tài liệu rồi có ngày ai đó "sửa cho tiện".
    expect(buildCatalogueMoneyBlocks(product).productAmount).toBe(4_296_032);
    expect(priceFor(product).totalVnd).toBe(4_296_000);
  });

  it('số lượng nhân đúng', () => {
    const product = sampleProduct();
    const one = priceFor(product, { widthM: 1.196, heightM: 1.796, quantity: 1 });
    const three = priceFor(product, { widthM: 1.196, heightM: 1.796, quantity: 3 });
    expect(three.totalVnd).toBe(one.totalVnd * 3);
  });

  it('sản phẩm bán theo bộ bỏ qua kích thước, chỉ nhân số lượng', () => {
    const product = sampleProduct({ unit: 'BO', unitPriceVnd: 8_000_000, rawSizeText: null } as Partial<ProductRecord>);
    // Kích thước truyền vào phải bị bỏ qua hoàn toàn.
    const withSize = priceFor(product, { widthM: 99, heightM: 99, quantity: 2 });
    expect(withSize.totalVnd).toBe(16_000_000);
  });

  it('giá trọn gói được chia ngược về đơn giá trước khi tính', () => {
    // Không có dấu hiệu đơn giá trong rawPriceText → 6.000.000 là giá TRỌN GÓI
    // cho đúng kích thước mẫu, không phải đơn giá mỗi m².
    const product = sampleProduct({
      unitPriceVnd: 6_000_000,
      rawPriceText: '6.000.000',
      rawSizeText: '2 x 3',
    } as Partial<ProductRecord>);
    // 6.000.000 / (2 × 3) = 1.000.000/m² → 2 × 3 × 1 × 1.000.000 = 6.000.000.
    // Bỏ bước chuẩn hoá thì ra 36.000.000 — sai gấp sáu lần.
    expect(priceFor(product).totalVnd).toBe(6_000_000);
  });
});
