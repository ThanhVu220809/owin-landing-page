import {
  calculateQuote,
  createQuoteItemFromProduct,
  type ProductRecord,
} from '@owin/quote-engine';

/**
 * MỌI con số tiền trên trang công khai đi qua đây.
 *
 * QUYẾT ĐỊNH (2026-09-17): dùng **nhánh Báo giá cho cả hai** — thẻ sản phẩm và
 * bộ tính giá. Engine có hai nhánh tính tiền lệch nhau ở hai chỗ:
 *
 *   |             | Bảng giá              | Báo giá                        |
 *   | khối lượng  | đủ độ chính xác       | làm tròn 3 số lẻ trước khi nhân |
 *   | tổng        | không làm tròn        | làm tròn XUỐNG bội số 100.000   |
 *
 * Nếu thẻ sản phẩm lấy số nhánh Bảng giá còn bộ tính giá lấy số nhánh Báo giá,
 * khách sẽ thấy hai con số khác nhau cho cùng một sản phẩm trên cùng một trang.
 * Đi chung một nhánh thì điều đó không thể xảy ra.
 *
 * KHÔNG import `buildCatalogueMoneyBlocks` ở bất kỳ đâu trong project này.
 */

export interface PriceConfig {
  widthM?: number | null;
  heightM?: number | null;
  quantity: number;
}

export interface PriceBreakdown {
  /** Tiền sản phẩm, chưa gồm phụ kiện. */
  productVnd: number;
  /** Tiền phụ kiện đi kèm. */
  accessoryVnd: number;
  /** Tổng trước khi làm tròn. */
  totalVnd: number;
  /**
   * Con số HIỂN THỊ cho khách: đã làm tròn xuống bội số 100.000, đúng như tab
   * Báo giá đưa ra. "Làm tròn" ở đây không bao giờ làm tăng số phải trả.
   */
  displayVnd: number;
}

/**
 * Giá của một sản phẩm theo cấu hình khách chọn.
 *
 * Không truyền `config` thì dùng kích thước mẫu của chính sản phẩm — đó là con
 * số cho thẻ sản phẩm.
 *
 * Cố ý đi qua `createQuoteItemFromProduct` chứ không tự lắp dòng báo giá: hàm
 * đó chứa bước chuẩn hoá giá, chia ngược giá trọn gói về đơn giá cho những sản
 * phẩm nhập theo kiểu đó. Bỏ qua bước này thì cả một nhóm sản phẩm ra sai số.
 */
export function priceFor(product: ProductRecord, config?: PriceConfig): PriceBreakdown {
  const item = createQuoteItemFromProduct(product, product.code);

  if (config) {
    const seeded = item.dimensions[0];
    item.dimensions = [{
      ...seeded,
      // Sản phẩm bán theo bộ bỏ qua kích thước — engine tự lo, nhưng đừng đưa
      // vào số rác để nhỡ có ai đọc dòng này lại tưởng nó có ý nghĩa.
      widthM: item.unit === 'BO' ? null : config.widthM ?? seeded.widthM,
      heightM: item.unit === 'BO' ? null : config.heightM ?? seeded.heightM,
      quantity: config.quantity,
    }];
  }

  const { summary } = calculateQuote({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    items: [item],
  });

  return {
    productVnd: summary.subtotalProductVnd,
    accessoryVnd: summary.subtotalAccessoryVnd,
    totalVnd: summary.totalVnd,
    displayVnd: summary.roundedTotalVnd,
  };
}
