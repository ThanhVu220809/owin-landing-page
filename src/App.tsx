import { useState } from 'react'
import { content } from '@/content'
import { Hero } from '@/sections/Hero'
import { Calculator } from '@/sections/Calculator'
import { Products } from '@/sections/Products'
import { Reasons } from '@/sections/Reasons'
import { Contact } from '@/sections/Contact'
import { PlaceholderNotice } from '@/components/PlaceholderNotice'
import '@/styles/app.css'

type Appearance = 'light' | 'dark' | 'system'

const NAV = [
  { href: '#san-pham', label: 'Sản phẩm' },
  { href: '#tinh-gia', label: 'Tính giá' },
  { href: '#lien-he', label: 'Liên hệ' },
]

/**
 * Trang công khai.
 *
 * Chữ trong Hero và phần lý do là nội dung TẠM, chờ chủ cửa hàng thay — tất cả
 * nằm trong `content.ts`.
 */
function App() {
  const [appearance, setAppearance] = useState<Appearance>('system')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  /**
   * Từ thẻ sản phẩm sang bộ tính giá với sản phẩm đã chọn sẵn.
   *
   * Cuộn lên là bắt buộc: bộ tính giá nằm PHÍA TRÊN danh sách, nên nếu chỉ đặt
   * sản phẩm mà không cuộn thì khách bấm nút xong không thấy gì thay đổi.
   */
  const calculateProduct = (id: string) => {
    setSelectedProductId(id)
    document.getElementById('tinh-gia')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const applyAppearance = (next: Appearance) => {
    setAppearance(next)
    const root = document.documentElement
    if (next === 'system') delete root.dataset.appearance
    else root.dataset.appearance = next
  }

  return (
    <div className="shell">
      {/* Người dùng bàn phím không phải đi qua cả menu mới tới nội dung. */}
      <a className="skip-link" href="#noi-dung">Tới nội dung chính</a>

      <header className="shell-head">
        <strong>{content.brand}</strong>

        <nav className="shell-nav" aria-label="Menu chính">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

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

      <PlaceholderNotice />

      <main id="noi-dung">
        <Hero />
        <Calculator selectedId={selectedProductId} onSelect={setSelectedProductId} />
        <Products onCalculate={calculateProduct} />
        <Reasons />
        <Contact />
      </main>

      <footer className="shell-foot">
        <p>{content.brand} · {content.contact.phoneLabel}</p>
        <p className="muted">
          Giá trên trang là giá tham khảo, chưa gồm lắp đặt và vận chuyển.
        </p>
      </footer>
    </div>
  )
}

export default App
