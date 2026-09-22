import type { ProductRecord } from '@owin/quote-engine';
import { STORE_ID, supabase } from '@/lib/supabase';

/**
 * Đọc sản phẩm công khai của cửa hàng mà bản deploy này phục vụ.
 *
 * Trang này KHÔNG tự lọc `is_public` hay `deleted_at` — RLS ở database đã làm
 * việc đó (`products_public_read`). Lọc lại ở client chỉ tạo cảm giác an toàn
 * giả: ai cũng mở được devtools và gọi thẳng API.
 *
 * Lấy nguyên cột `data` vì phép tính giá cần gần hết `ProductRecord`: đơn vị,
 * đơn giá, kích thước mẫu, phụ kiện, và `rawPriceText` để biết giá đang là đơn
 * giá hay giá trọn gói. Cắt bớt trường ở đây là làm sai số tiền.
 */
export const PAGE_SIZE = 24;

export interface ProductPage {
  products: ProductRecord[];
  /** Tổng số sản phẩm công khai, để biết còn gì để tải thêm không. */
  total: number;
}

/** Đủ để hiện trong bộ chọn, không đủ để tính tiền. */
export interface ProductOption {
  id: string;
  name: string;
  category: string;
  /** Kích thước mẫu, dạng thô như admin nhập ("2.80 x 2.80"). */
  rawSizeText: string | null;
  unitPriceVnd: number | null;
}

/**
 * Danh sách cho bộ chọn sản phẩm.
 *
 * Chỉ lấy các cột phẳng — cả 333 sản phẩm kèm cột `data` là 613 KB, còn danh
 * sách tên thì vài chục KB. Khi khách chọn một sản phẩm mới tải `data` của
 * đúng sản phẩm đó để tính tiền.
 *
 * Lấy kèm kích thước và đơn giá vì RẤT NHIỀU sản phẩm trùng tên nhau — riêng
 * "Cửa Đi Mở Quay Nhôm OWIN Hệ Khuôn Phào" có hàng chục bản, chỉ khác kích
 * thước và giá. Chỉ hiện tên thì khách nhìn vào một danh sách các dòng giống
 * hệt nhau, không biết chọn cái nào.
 */
export async function fetchProductOptions(): Promise<ProductOption[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id,name,category,raw_size_text,unit_price_vnd')
    .eq('store_id', STORE_ID)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('code', { ascending: true });

  if (error) throw new Error(error.message);

  const options = (data ?? []).map((row) => {
    const r = row as {
      id: string;
      name: string | null;
      category: string | null;
      raw_size_text: string | null;
      unit_price_vnd: number | null;
    };
    return {
      id: r.id,
      name: r.name ?? '',
      category: r.category ?? '',
      rawSizeText: r.raw_size_text,
      unitPriceVnd: r.unit_price_vnd,
    };
  });
  return dedupeProductOptions(options);
}

/**
 * Sản phẩm chủ cửa hàng chọn làm nổi bật.
 *
 * Lọc theo `data->>isFeatured` chứ không theo cột quan hệ, vì cờ này CỐ Ý chỉ
 * sống trong `data`: khác `is_public`, RLS không cần nó, nên giữ ở một nơi duy
 * nhất thì không bao giờ có chuyện hai nơi lệch nhau. Với vài trăm dòng thì
 * quét tuần tự không đáng kể.
 *
 * Không ai được chọn thì trả mảng rỗng và trang ẩn hẳn phần đó — chứ không tự
 * lấy bừa mấy sản phẩm đầu danh sách rồi gọi chúng là "nổi bật".
 */
export async function fetchFeaturedProducts(limit = 8): Promise<ProductRecord[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id,data')
    .eq('store_id', STORE_ID)
    .eq('data->>isFeatured', 'true')
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('code', { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => (row as { data: ProductRecord }).data);
}

/**
 * Gộp các mục trùng nhau trong bộ chọn.
 *
 * Danh mục có nhiều bản ghi TRÙNG HỆT NHAU về tên, kích thước mẫu và đơn giá —
 * cùng một sản phẩm được nhập nhiều lần. Trong công cụ quản trị chúng còn phân
 * biệt được bằng mã và thông số, nhưng trong bộ chọn của khách thì chúng hiện
 * ra thành một loạt dòng y hệt nhau, không có cách nào chọn đúng cái nào.
 *
 * Khoá gộp bỏ qua chữ hoa/thường, và cố ý KHÔNG tính nhóm sản phẩm: dữ liệu
 * đang có cả "Cửa chính" lẫn "Cửa Chính" nên tính nhóm vào thì hai bản ghi y
 * hệt nhau vẫn nằm lại thành hai dòng.
 *
 * Đây là che bớt chứ không phải sửa gốc — gốc là dữ liệu trùng, phải dọn trong
 * tab Sản phẩm. Giữ mục ĐẦU TIÊN để thứ tự kéo-thả của chủ cửa hàng vẫn đúng.
 */
export function dedupeProductOptions(options: ProductOption[]): ProductOption[] {
  const seen = new Set<string>();
  return options.filter((option) => {
    const key = [
      option.name.trim().toLowerCase(),
      (option.rawSizeText ?? '').trim().toLowerCase(),
      option.unitPriceVnd ?? '',
    ].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Tài liệu đầy đủ của một sản phẩm — cần cột `data` mới tính được tiền. */
export async function fetchProductById(id: string): Promise<ProductRecord | null> {
  const { data, error } = await supabase
    .from('products')
    .select('data')
    .eq('store_id', STORE_ID)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? (data as { data: ProductRecord }).data : null;
}

export async function fetchPublicProducts(offset = 0, limit = PAGE_SIZE): Promise<ProductPage> {
  const { data, error, count } = await supabase
    .from('products')
    .select('id,data', { count: 'exact' })
    .eq('store_id', STORE_ID)
    // Cùng thứ tự với tab Sản phẩm: thứ tự kéo-thả do chủ cửa hàng đặt, rồi mã.
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('code', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);

  return {
    products: (data ?? []).map((row) => (row as { data: ProductRecord }).data),
    total: count ?? 0,
  };
}
