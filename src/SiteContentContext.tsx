import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { content as defaults, type SiteContent } from '@/content';
import { fetchSiteContent } from '@/lib/siteContent';

const SiteContentContext = createContext<SiteContent>(defaults);

/** Nội dung đang dùng: mặc định lúc đầu, rồi đổi sang bản của chủ cửa hàng. */
export function useSiteContent(): SiteContent {
  return useContext(SiteContentContext);
}

/**
 * Vẽ ngay bằng nội dung mặc định rồi thay bằng nội dung của chủ cửa hàng khi
 * tải xong.
 *
 * Không chặn lần vẽ đầu để chờ mạng: trang này phải hiện nhanh trên điện thoại,
 * và một vòng gọi mạng trước khi vẽ gì đó là đúng thứ làm nó chậm. Đổi lại,
 * lần đầu vào máy có thể thấy chữ mặc định trong chốc lát rồi đổi.
 */
export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<SiteContent>(defaults);

  useEffect(() => {
    let cancelled = false;
    void fetchSiteContent().then((loaded) => {
      if (!cancelled) setValue(loaded);
    });
    return () => { cancelled = true; };
  }, []);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}
