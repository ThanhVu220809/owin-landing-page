import { useState } from 'react'
import { useSiteContent } from '@/SiteContentContext'
import { Hero } from '@/sections/Hero'
import { Calculator } from '@/sections/Calculator'
import { Featured } from '@/sections/Featured'
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
 * Chữ trên trang đến từ hai nơi: `content.ts` là nội dung mặc định, còn chủ cửa
 * hàng sửa đè lên nó trong công cụ quản trị (mục "Nội dung trang web"). Ô nào
 * họ để trống thì mặc định được dùng.
 */
function App() {
  const content = useSiteContent()
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
        <div className="shell-brand">
          {content.brandLogo && (
            <img src={content.brandLogo} alt="" width={40} height={27} decoding="async" />
          )}
          <strong>{content.brand}</strong>
        </div>

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
              {mode === 'light' && (
                <svg className="theme-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              )}
              {mode === 'dark' && (
                <svg className="theme-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
              {mode === 'system' && (
                <svg className="theme-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
              )}
              <span>{mode === 'light' ? 'Sáng' : mode === 'dark' ? 'Tối' : 'Tự động'}</span>
            </button>
          ))}
        </div>
      </header>

      <PlaceholderNotice />

      <main id="noi-dung">
        <Hero />
        <Featured onCalculate={calculateProduct} />
        <Calculator selectedId={selectedProductId} onSelect={setSelectedProductId} />
        <Products onCalculate={calculateProduct} />
        <Reasons />
        <Contact />
      </main>

      <footer className="shell-foot">
        <p>{[content.brand, content.contact.phoneLabel, content.contact.address].filter(Boolean).join(' · ')}</p>
        <p className="muted">
          Giá trên trang là giá tham khảo, chưa gồm lắp đặt và vận chuyển.
        </p>
      </footer>
    </div>
  )
}

export default App
