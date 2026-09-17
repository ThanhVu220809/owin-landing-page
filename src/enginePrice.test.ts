import { describe, expect, it } from 'vitest';
import {
  buildCatalogueMoneyBlocks,
  calculateDimensionQuantity,
  calculateQuote,
  createQuoteItemFromProduct,
  roundMoneyToVnd,
  type ProductRecord,
} from '@owin/quote-engine';

/**
 * Lưới an toàn của cả project: web công khai phải ra ĐÚNG con số mà công cụ
 * quản trị ra.
 *
 * Test này không kiểm tra công thức — engine tự có test riêng cho việc đó. Nó
 * kiểm tra rằng project này **nối được vào đúng engine**, không phải một bản
 * sao đã trôi khác đi. Nếu có ai đó chép công thức sang đây, test vẫn xanh
 * nhưng nó sẽ gãy ngay lần đầu engine đổi — đó chính là điều cần bắt.
 */
describe('nối vào engine giá dùng chung', () => {
  it('giữ đúng bất biến BR-1: làm tròn khối lượng 3 số lẻ TRƯỚC khi nhân', () => {
    // Ví dụ chuẩn ghi trong chính engine: 1.196 × 1.796 × 1 = 2.148016.
    const quantity = calculateDimensionQuantity({
      unit: 'M2',
      widthM: 1.196,
      heightM: 1.796,
      quantity: 1,
    });
    expect(quantity).toBe(2.148);
    expect(roundMoneyToVnd(quantity * 2_000_000)).toBe(4_296_000);
  });

  it('ba hệ đơn vị tính khối lượng khác nhau', () => {
    const base = { widthM: 2, heightM: 3, quantity: 2 };
    expect(calculateDimensionQuantity({ ...base, unit: 'M2' })).toBe(12); // R × C × SL
    expect(calculateDimensionQuantity({ ...base, unit: 'METER' })).toBe(10); // (R + C) × SL
    expect(calculateDimensionQuantity({ ...base, unit: 'BO' })).toBe(2); // chỉ SL
  });

  it('nhánh báo giá làm tròn tổng XUỐNG bội số 100.000, nhánh bảng giá thì không', () => {
    const product = {
      id: 'p1',
      numericId: 1,
      code: 'SP0001',
      name: 'Cửa mẫu',
      slug: 'cua-mau',
      category: 'Cửa Chính',
      unit: 'M2',
      unitPriceVnd: 2_000_000,
      shortDesc: null,
      coverImagePath: null,
      gallery: [],
      rawSizeText: '1.196 x 1.796',
      // Có dấu "/" nghĩa là đơn giá, không phải giá trọn gói — nhờ vậy bước
      // chuẩn hoá giá không chia ngược, và test này đo đúng thứ nó định đo.
      rawPriceText: '2.000.000/m2',
      specs: [],
      accessories: [],
      fixedAccessoryPackage: null,
      extraAccessories: '[]',
      isFeatured: false,
      isPublic: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    } as unknown as ProductRecord;

    // Nhánh bảng giá nhân bằng khối lượng ĐẦY ĐỦ ĐỘ CHÍNH XÁC:
    // 1.196 × 1.796 = 2.148016 → × 2.000.000 = 4.296.032.
    const catalogue = buildCatalogueMoneyBlocks(product);
    expect(catalogue.productAmount).toBe(4_296_032);

    // Nhánh báo giá làm tròn khối lượng về 3 số lẻ TRƯỚC khi nhân:
    // 2.148 → × 2.000.000 = 4.296.000.
    const quote = calculateQuote({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      items: [createQuoteItemFromProduct(product, 'SP0001')],
    });
    expect(quote.summary.totalVnd).toBe(4_296_000);
    // Và tổng báo giá còn bị làm tròn XUỐNG bội số 100.000.
    expect(quote.summary.roundedTotalVnd).toBe(4_200_000);
  });

  /**
   * CHỐT LẠI KHOẢNG CHÊNH — đây là rủi ro lớn nhất của trang công khai.
   *
   * Hai nhánh lệch nhau ở HAI chỗ, không phải một:
   *  1. độ chính xác khối lượng (bảng giá dùng đủ, báo giá làm tròn 3 số lẻ);
   *  2. làm tròn tổng xuống bội số 100.000 (chỉ nhánh báo giá).
   *
   * Nếu thẻ sản phẩm lấy số của nhánh bảng giá còn bộ tính giá lấy số của nhánh
   * báo giá, khách sẽ thấy HAI con số khác nhau cho cùng một sản phẩm trên cùng
   * một trang. Test này khoá con số chênh lại để không ai vô tình làm nó rộng
   * ra mà không biết.
   */
  it('ghi nhận khoảng chênh giữa hai nhánh cho cùng một sản phẩm', () => {
    const product = {
      id: 'p2', numericId: 2, code: 'SP0002', name: 'Cửa mẫu', slug: 'cua-mau',
      category: 'Cửa Chính', unit: 'M2', unitPriceVnd: 2_000_000,
      shortDesc: null, coverImagePath: null, gallery: [],
      rawSizeText: '1.196 x 1.796', rawPriceText: '2.000.000/m2',
      specs: [], accessories: [], fixedAccessoryPackage: null, extraAccessories: '[]',
      isFeatured: false, isPublic: true,
      createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    } as unknown as ProductRecord;

    const catalogueAmount = buildCatalogueMoneyBlocks(product).productAmount;
    const quoteAmount = calculateQuote({
      customerName: '', customerPhone: '', customerAddress: '',
      items: [createQuoteItemFromProduct(product, 'SP0002')],
    }).summary.totalVnd;

    expect(catalogueAmount - quoteAmount).toBe(32);
  });
});
