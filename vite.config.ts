import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { content } from './src/content.ts'
import { buildHeadTags } from './src/seo.ts'

/**
 * Nhúng thẻ chia sẻ và dữ liệu có cấu trúc thẳng vào `index.html`.
 *
 * KHÔNG đặt mấy thẻ này bằng React: host tĩnh không chạy JavaScript cho bot của
 * Zalo, Facebook hay công cụ tìm kiếm. Thẻ nào không có sẵn trong HTML lúc
 * build thì với chúng là không tồn tại.
 *
 * Nội dung thẻ dựng trong `src/seo.ts` để test được; ở đây chỉ ghép vào HTML.
 */
function seoTags(): Plugin {
  return {
    name: 'owin-seo-tags',
    transformIndexHtml(html) {
      const tags = buildHeadTags(content)
      const title = content.seo.title
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return html
        .replace('<title>OWIN</title>', `<title>${title}</title>`)
        .replace('</head>', `  ${tags.join('\n    ')}\n  </head>`)
    },
  }
}

export default defineConfig(() => ({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), seoTags()],
  server: process.env.PORT ? { port: Number(process.env.PORT) } : undefined,
  resolve: {
    // fileURLToPath chứ không phải `new URL(...).pathname`: trên Windows
    // pathname trả về `/D:/...` với dấu gạch thừa ở đầu.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    dedupe: ['react', 'react-dom'],
  },
}))
