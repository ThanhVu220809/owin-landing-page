import { useId, useMemo, useState } from 'react';
import { Search, Check } from 'lucide-react';
import { formatVnd } from '@/lib/format';
import type { ProductOption } from '@/lib/products';

const MAX_VISIBLE = 50;

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputId = useId();

  // Extract unique categories for quick filter chips
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const opt of options) {
      if (opt.category && opt.category.trim()) {
        set.add(opt.category.trim());
      }
    }
    return Array.from(set).sort();
  }, [options]);

  const matches = useMemo(() => {
    let list = options;
    if (selectedCategory !== 'all') {
      list = list.filter((o) => o.category?.trim() === selectedCategory);
    }
    const q = normalize(query.trim());
    if (!q) return list;
    return list.filter((o) =>
      normalize(`${o.name} ${o.category} ${o.rawSizeText ?? ''}`).includes(q)
    );
  }, [options, selectedCategory, query]);

  const visible = matches.slice(0, MAX_VISIBLE);

  return (
    <div className="picker studio-picker">
      <div className="picker-head">
        <label className="picker-label" htmlFor={inputId}>
          1. Chọn mẫu sản phẩm
        </label>
        <span className="picker-count">{matches.length} mẫu có sẵn</span>
      </div>

      <div className="picker-search-wrap">
        <Search size={16} className="picker-search-icon" aria-hidden="true" />
        <input
          id={inputId}
          className="picker-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm theo tên cửa, hệ nhôm, quy cách..."
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className="picker-search-clear"
            onClick={() => setQuery('')}
            aria-label="Xóa từ khóa tìm kiếm"
          >
            ×
          </button>
        )}
      </div>

      {categories.length > 0 && (
        <div className="picker-chips" role="radiogroup" aria-label="Lọc theo nhóm sản phẩm">
          <button
            type="button"
            role="radio"
            aria-checked={selectedCategory === 'all'}
            className={`picker-chip ${selectedCategory === 'all' ? 'is-active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Tất cả ({options.length})
          </button>
          {categories.map((cat) => {
            const count = options.filter((o) => o.category?.trim() === cat).length;
            const isCatActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="radio"
                aria-checked={isCatActive}
                className={`picker-chip ${isCatActive ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(isCatActive ? 'all' : cat)}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {matches.length === 0 ? (
        <div className="picker-empty">
          <p>Không tìm thấy sản phẩm nào khớp với tìm kiếm.</p>
          <button
            type="button"
            className="btn btn-sm btn-subtle"
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <>
          <ul className="picker-list" role="listbox" aria-label="Danh sách sản phẩm">
            {visible.map((option) => {
              const isSelected = option.id === selectedId;
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`picker-item ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => onSelect(option.id)}
                  >
                    <div className="picker-item-content">
                      <div className="picker-item-name-row">
                        <span className="picker-item-name">{option.name}</span>
                        {isSelected && <Check size={16} className="picker-item-check" />}
                      </div>
                      <span className="picker-item-category">{optionDetail(option)}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          {matches.length > visible.length && (
            <p className="picker-more">
              Đang hiện {visible.length}/{matches.length} sản phẩm — gõ thêm từ khóa để tìm chính xác hơn.
            </p>
          )}
        </>
      )}
    </div>
  );
}
