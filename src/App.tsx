import { useState } from 'react'
import { Products } from '@/sections/Products'
import '@/styles/app.css'

type Appearance = 'light' | 'dark' | 'system'

/**
 * Trang công khai.
 *
 * Cố ý CHƯA có Hero, phần "vì sao chọn OWIN", hay liên hệ: chưa có nội dung
 * thật từ chủ cửa hàng thì không được tự nghĩ ra lời hứa kinh doanh nào. Những
 * phần đó vào sau, khi có nội dung.
 */
function App() {
  const [appearance, setAppearance] = useState<Appearance>('system')

  const applyAppearance = (next: Appearance) => {
    setAppearance(next)
    const root = document.documentElement
    if (next === 'system') delete root.dataset.appearance
    else root.dataset.appearance = next
  }

  return (
    <div className="shell">
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

      <main>
        <Products />
      </main>
    </div>
  )
}

export default App
