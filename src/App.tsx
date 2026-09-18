import { useState } from 'react'
import { content } from '@/content'
import { Hero } from '@/sections/Hero'
import { Products } from '@/sections/Products'
import { Calculator } from '@/sections/Calculator'
import { PlaceholderNotice } from '@/components/PlaceholderNotice'
import '@/styles/app.css'

type Appearance = 'light' | 'dark' | 'system'

/**
 * Trang công khai.
 *
 * Chữ trong Hero là nội dung TẠM, chờ chủ cửa hàng thay — tất cả nằm trong
 * `content.ts`. Phần "vì sao chọn OWIN" vẫn chưa làm: nó đòi những tuyên bố mà
 * chỉ chủ doanh nghiệp mới được đưa ra.
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
      <header className="shell-head">
        <strong>{content.brand}</strong>
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

      <main>
        <Hero />
        <Calculator selectedId={selectedProductId} onSelect={setSelectedProductId} />
        <Products onCalculate={calculateProduct} />
      </main>
    </div>
  )
}

export default App
