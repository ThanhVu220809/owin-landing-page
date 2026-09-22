import { describe, expect, it } from 'vitest';
import {
  dedupeProductOptions,
  getLoadMoreCount,
  INITIAL_PRODUCT_COUNT,
  LOAD_MORE_BATCH_SIZE,
  normalizeCategory,
  type ProductOption,
} from "@/lib/products";

function option(
  id: string,
  name: string,
  rawSizeText: string | null,
  unitPriceVnd: number | null,
  category = 'Cửa Chính',
): ProductOption {
  return { id, name, category, rawSizeText, unitPriceVnd };
}

describe('dedupeProductOptions', () => {
  it('bỏ các mục trùng cả tên, kích thước và giá', () => {
    const result = dedupeProductOptions([
      option('a', 'Cửa Thủy Lực Nhôm OWIN', '2.80 x 2.80', 4_600_000),
      option('b', 'Cửa Thủy Lực Nhôm OWIN', '2.80 x 2.80', 4_600_000),
      option('c', 'Cửa Thủy Lực Nhôm OWIN', '2.80 x 2.80', 4_600_000),
    ]);
    expect(result.map((o) => o.id)).toEqual(['a']);
  });

  it('giữ mục ĐẦU TIÊN để không phá thứ tự kéo-thả của chủ cửa hàng', () => {
    const result = dedupeProductOptions([
      option('dau', 'Cửa A', '1 x 2', 1_000_000),
      option('sau', 'Cửa A', '1 x 2', 1_000_000),
    ]);
    expect(result[0].id).toBe('dau');
  });

  it("cùng tên nhưng khác giá thì vẫn gộp thành 1", () => {
    const result = dedupeProductOptions([
      option("a", "Cửa A", "2.80 x 2.80", 6_700_000),
      option("b", "Cửa A", "2.80 x 2.80", 6_800_000),
    ]);
    expect(result).toHaveLength(1);
  });

  it("cùng tên nhưng khác kích thước thì vẫn gộp thành 1", () => {
    const result = dedupeProductOptions([
      option("a", "Cửa A", "2.80 x 2.80", 6_700_000),
      option("b", "Cửa A", "2.40 x 2.80", 6_700_000),
    ]);
    expect(result).toHaveLength(1);
  });

  it("gộp được khi cùng tên nhưng kích thước viết khác định dạng", () => {
    const result = dedupeProductOptions([
      option("a", "Cửa A", "2,80 x 2,80", 6_800_000),
      option("b", "Cửa A", "2.80 x 2.80", 6_800_000),
    ]);
    expect(result.map((o) => o.id)).toEqual(["a"]);
  });

  it('gộp được cả khi nhóm khác nhau về viết hoa', () => {
    // Dữ liệu thật đang có cả "Cửa chính" lẫn "Cửa Chính". Tính nhóm vào khoá
    // gộp thì hai bản ghi y hệt nhau vẫn nằm lại thành hai dòng.
    const result = dedupeProductOptions([
      option('a', 'Cửa A', '2.80 x 2.80', 6_800_000, 'Cửa Chính'),
      option('b', 'Cửa A', '2.80 x 2.80', 6_800_000, 'Cửa chính'),
    ]);
    expect(result).toHaveLength(1);
  });

  it('tên khác hoa thường vẫn coi là một', () => {
    const result = dedupeProductOptions([
      option('a', 'Cửa Thủy Lực', '1 x 2', 1_000_000),
      option('b', 'CỬA THỦY LỰC', '1 x 2', 1_000_000),
    ]);
    expect(result).toHaveLength(1);
  });

  it('thiếu kích thước hoặc giá vẫn gộp được', () => {
    const result = dedupeProductOptions([
      option('a', 'Bộ phụ kiện', null, null),
      option('b', 'Bộ phụ kiện', null, null),
    ]);
    expect(result).toHaveLength(1);
  });
});

describe("normalizeCategory", () => {
  it("chuẩn hóa hoa thường và dấu phân cách danh mục", () => {
    expect(normalizeCategory("  cửa chính  ")).toBe("Cửa Chính");
    expect(normalizeCategory("cửa phụ ,wc")).toBe("Cửa Phụ / WC");
  });
});

describe("product pagination defaults", () => {
  it("hiển thị tối đa 8 sản phẩm đầu tiên để giữ nhịp trải nghiệm", () => {
    expect(INITIAL_PRODUCT_COUNT).toBe(8);
  });

  it("mỗi lần xem thêm chỉ mở rộng tối đa 16 sản phẩm", () => {
    expect(LOAD_MORE_BATCH_SIZE).toBe(16);
    expect(getLoadMoreCount(40, 8)).toBe(16);
    expect(getLoadMoreCount(20, 8)).toBe(12);
    expect(getLoadMoreCount(8, 8)).toBe(0);
  });
});
