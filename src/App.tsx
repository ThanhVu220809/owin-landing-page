import { useState } from 'react'
import { calculateDimensionQuantity, roundMoneyToVnd } from '@owin/quote-engine'
import '@/styles/app.css'

type Appearance = 'light' | 'dark' | 'system'

/**
 * Bộ khung của trang công khai.
 *
 * Trang thật (sản phẩm, bộ tính giá, liên hệ) là các phase sau. Ở đây cố tình
 * KHÔNG có nội dung tiếp thị: chưa có nội dung thật từ chủ cửa hàng thì không
 * được tự nghĩ ra lời hứa kinh doanh nào.
 *
 * Phần duy nhất có thật là con số dưới đây — nó chứng minh project này gọi
 * được đúng engine giá mà công cụ quản trị đang dùng, không phải bản sao.
 */
function App() {
  const [appearance, setAppearance] = useState<Appearance>('system')

  const applyAppearance = (next: Appearance) => {
    setAppearance(next)
    const root = document.documentElement
    if (next === 'system') delete root.dataset.appearance
    else root.dataset.appearance = next
  }

  // Ví dụ chuẩn ghi trong chính engine (BR-1): 1.196 × 1.796 × 1 = 2.148016,
  // làm tròn khối lượng 3 số lẻ TRƯỚC khi nhân → 2.148 × 2.000.000 = 4.296.000.
  const quantity = calculateDimensionQuantity({
    unit: 'M2',
    widthM: 1.196,
    heightM: 1.796,
    quantity: 1,
  })
  const amount = roundMoneyToVnd(quantity * 2_000_000)

  return (
    <main className="shell">
      <header className="shell-head">
        <strong>OWIN</strong>
        <div className="theme-switch" role="group" aria-label="Giao diện">
          {(['light', 'dark', 'system'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={appearance === mode}
              className={appearance === mode ? 'is-active' : undefined}
              onClick={() => applyAppearance(mode)}
            >
              {mode === 'light' ? 'Sáng' : mode === 'dark' ? 'Tối' : 'Theo máy'}
            </button>
          ))}
        </div>
      </header>

      <section className="card">
        <h1>Bộ khung trang công khai</h1>
        <p className="muted">
          Project đã dựng xong và nối được vào engine giá dùng chung. Nội dung và
          giao diện thật thuộc các phase sau.
        </p>

        <div className="proof">
          <div className="proof-label">Kiểm chứng engine giá</div>
          <code>1,196 m × 1,796 m × 1 · đơn giá 2.000.000đ/m²</code>
          <div className="proof-row">
            <span>Khối lượng</span>
            <strong>{quantity.toLocaleString('vi-VN')} m²</strong>
          </div>
          <div className="proof-row">
            <span>Thành tiền</span>
            <strong>{amount.toLocaleString('vi-VN')}đ</strong>
          </div>
          <p className="muted small">
            Hai con số này do <code>@owin/quote-engine</code> tính, cùng một mã
            nguồn mà tab Báo giá đang dùng — không phải công thức chép lại.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
