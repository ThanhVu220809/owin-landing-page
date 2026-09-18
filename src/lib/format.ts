const VND = new Intl.NumberFormat('vi-VN');

/** Tiền đồng, không có phần thập phân — mọi số tiền trên trang đi qua đây. */
export function formatVnd(value: number): string {
  return `${VND.format(Math.round(value))}đ`;
}

/** Nhãn đơn vị cho người đọc, không phải mã trong database. */
export function unitLabel(unit: string): string {
  if (unit === 'BO') return 'Bộ';
  if (unit === 'METER') return 'm dài';
  return 'm²';
}
