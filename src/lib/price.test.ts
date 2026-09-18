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

  it('tiền phụ kiện vào đúng tổng và nhân theo số lượng', () => {
    const product = sampleProduct({
      rawSizeText: '2 x 3',
      unitPriceVnd: 1_000_000,
      fixedAccessoryPackage: JSON.stringify({
        name: 'Bộ phụ kiện đi kèm',
        unitPrice: 8_000_000,
        packageQuantity: 1,
      }),
    } as Partial<ProductRecord>);

    const one = priceFor(product, { widthM: 2, heightM: 3, quantity: 1 });
    expect(one.productVnd).toBe(6_000_000);
    expect(one.accessoryVnd).toBe(8_000_000);
    expect(one.totalVnd).toBe(14_000_000);

    // SL bộ phụ kiện = SL gốc trên sản phẩm × tổng SL hạng mục, nên phụ kiện
    // nhân lên theo — không phải cộng một lần rồi thôi.
    const three = priceFor(product, { widthM: 2, heightM: 3, quantity: 3 });
    expect(three.productVnd).toBe(18_000_000);
    expect(three.accessoryVnd).toBe(24_000_000);
    expect(three.totalVnd).toBe(42_000_000);
  });

  /**
   * GHI LẠI MỘT HÀNH VI DỄ GÂY HIỂU NHẦM.
   *
   * Sản phẩm có thể mang hai loại phụ kiện, và chúng cư xử KHÁC nhau khi đổi
   * số lượng:
   *   - bộ phụ kiện cố định  → nhân theo số lượng (SL bộ = SL gốc × tổng SL);
   *   - phụ kiện lẻ          → GIỮ NGUYÊN, không nhân.
   *
   * Đây là hành vi của engine, tức là tab Báo giá cũng ra đúng như vậy — nên
   * trang công khai làm theo là ĐÚNG YÊU CẦU (hai nơi phải trùng số). Nhưng nó
   * dễ khiến người xem tưởng tính sai, nên khoá lại bằng test để nó là một
   * lựa chọn có chủ đích chứ không phải tai nạn.
   */
  it('bộ phụ kiện cố định nhân theo số lượng, phụ kiện lẻ thì không', () => {
    const product = sampleProduct({
      rawSizeText: '2 x 3',
      unitPriceVnd: 1_000_000,
      fixedAccessoryPackage: JSON.stringify({
        name: 'Bộ phụ kiện', unitPrice: 8_000_000, packageQuantity: 1,
      }),
      extraAccessories: JSON.stringify([
        { id: 'e1', name: 'Phào', unit: 'BO', quantity: 1, unitPrice: 2_000_000 },
      ]),
    } as Partial<ProductRecord>);

    const one = priceFor(product, { widthM: 2, heightM: 3, quantity: 1 });
    expect(one.accessoryVnd).toBe(10_000_000); // 8tr bộ + 2tr lẻ

    const three = priceFor(product, { widthM: 2, heightM: 3, quantity: 3 });
    expect(three.productVnd).toBe(18_000_000); // tiền sản phẩm nhân đủ 3
    expect(three.accessoryVnd).toBe(26_000_000); // 24tr bộ + 2tr lẻ GIỮ NGUYÊN
  });

  it('biên làm tròn: khối lượng chốt ở 3 số lẻ TRƯỚC khi nhân', () => {
    // 1.0005 × 1 × 1 = 1.0005 — đúng ngay ranh giới số lẻ thứ ba.
    //   làm tròn trước  → 1,001 × 1.000.000 = 1.001.000
    //   không làm tròn  → 1,0005 × 1.000.000 = 1.000.500  ← sai
    // Chỉ thử vài sản phẩm "tròn trịa" thì không bao giờ bắt được chỗ này.
    const product = sampleProduct({ unitPriceVnd: 1_000_000 } as Partial<ProductRecord>);
    const price = priceFor(product, { widthM: 1.0005, heightM: 1, quantity: 1 });
    expect(price.totalVnd).toBe(1_001_000);
    // Rồi tổng mới bị làm tròn xuống bội số 100.000.
    expect(price.displayVnd).toBe(1_000_000);
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
