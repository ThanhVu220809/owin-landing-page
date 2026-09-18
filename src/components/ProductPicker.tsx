import { useId, useMemo, useState } from 'react';
import { formatVnd } from '@/lib/format';
import type { ProductOption } from '@/lib/products';

/** Danh mục có hơn 300 sản phẩm — dựng hết ra DOM là phí, và cuộn cũng mệt. */
const MAX_VISIBLE = 40;

/**
 * Dòng phụ dưới tên, để phân biệt các sản phẩm TRÙNG TÊN.
 *
 * Nhóm sản phẩm không đủ để phân biệt — nhiều bản cùng tên lẫn cùng nhóm, chỉ
 * khác kích thước mẫu và đơn giá. Đây là đơn giá, không phải giá phải trả; giá
 * đầy đủ hiện ở bảng kết quả sau khi chọn.
 */
function optionDetail(option: ProductOption): string {
  const parts: string[] = [];
  if (option.category) parts.push(option.category);
  if (option.rawSizeText) parts.push(`${option.rawSizeText.replace(/\./g, ',')} m`);
  if (option.unitPriceVnd) parts.push(formatVnd(option.unitPriceVnd));
  return parts.join(' · ');
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase();
}

/**
 * Bộ chọn sản phẩm có ô tìm.
 *
 * Tìm bỏ dấu: gõ "cua so" ra được "Cửa Sổ". Khách trên điện thoại thường không
 * bỏ công gõ dấu, mà không bỏ dấu thì tìm kiểu khớp chuỗi thuần sẽ ra rỗng.
 */
export function ProductPicker({
  options,
  selectedId,
  onSelect,
}: {
  options: ProductOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const inputId = useId();

  const matches = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return options;
    return options.filter((o) => normalize(`${o.name} ${o.category} ${o.rawSizeText ?? ''}`).includes(q));
  }, [options, query]);

  const visible = matches.slice(0, MAX_VISIBLE);

  return (
    <div className="picker">
      <label className="field-label" htmlFor={inputId}>Chọn sản phẩm</label>
      <input
        id={inputId}
        className="input"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Tìm theo tên hoặc nhóm…"
        autoComplete="off"
      />

      {matches.length === 0 ? (
        <p className="picker-empty">Không tìm thấy sản phẩm nào khớp.</p>
      ) : (
        <>
          <ul className="picker-list" role="listbox" aria-label="Danh sách sản phẩm">
            {visible.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.id === selectedId}
                  className={option.id === selectedId ? 'picker-item is-selected' : 'picker-item'}
                  onClick={() => onSelect(option.id)}
                >
                  <span className="picker-item-name">{option.name}</span>
                  <span className="picker-item-category">{optionDetail(option)}</span>
                </button>
              </li>
            ))}
          </ul>
          {matches.length > visible.length && (
            <p className="picker-more">
              Còn {matches.length - visible.length} sản phẩm nữa — gõ thêm để thu hẹp.
            </p>
          )}
        </>
      )}
    </div>
  );
}
