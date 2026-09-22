import { content as defaults, type SiteContent } from '@/content';
import { STORE_ID, hasSupabaseConfig, supabase } from "@/lib/supabase";

/**
 * Nội dung do chủ cửa hàng nhập trong công cụ quản trị.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * HỢP ĐỒNG DÙNG CHUNG VỚI `owin-quote-tool`
 * ────────────────────────────────────────────────────────────────────────────
 * Hình dạng tài liệu định nghĩa ở `owin-quote-tool/src/features/landing/
 * landingContent.ts`. Đổi tên trường bên đó mà không đổi ở đây thì trang lặng
 * lẽ rơi về nội dung mặc định — không có lỗi, chỉ là chữ của chủ cửa hàng biến
 * mất. Đọc từng trường một, cố ý, để chỗ nào lệch thì chỉ chỗ đó rơi về mặc
 * định chứ không mất cả trang.
 */
const DOCUMENT_KEY = "owin_landing_content_v1";

/**
 * Chỉ nhận http/https.
 *
 * Lặp lại phép lọc mà công cụ quản trị đã làm, và đó là CỐ Ý: trang này không
 * được tin tài liệu trong database. Tài liệu đó có thể bị sửa bằng đường khác
 * ngoài giao diện quản trị, còn giá trị ở đây thì đi thẳng vào `href` chạy trên
 * máy của khách. Lọc hai lần rẻ hơn nhiều so với một lần XSS lưu trữ.
 */
function safeUrl(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !value.trim()) return fallback;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? value.trim()
      : fallback;
  } catch {
    return fallback;
  }
}

/** Chuỗi rỗng nghĩa là "dùng mặc định", không phải "xoá trắng chỗ này". */
function pick(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function pickNullable(value: unknown, fallback: string | null): string | null {
  const url = safeUrl(value, "");
  return url || fallback;
}

/** Ghép tài liệu của chủ cửa hàng lên trên nội dung mặc định. */
export function mergeSiteContent(
  base: SiteContent,
  document: unknown,
): SiteContent {
  const source = (document ?? {}) as Record<string, unknown>;
  const hero = (source.hero ?? {}) as Record<string, unknown>;
  const contactDoc = (source.contact ?? {}) as Record<string, unknown>;
  const brand = (source.brand ?? {}) as Record<string, unknown>;

  const phone = pick(contactDoc.phone, base.contact.phone);

  return {
    ...base,
    brand: pick(brand.name, base.brand),
    brandLogo: base.brandLogo,
    hero: {
      eyebrow: pick(hero.eyebrow, base.hero.eyebrow),
      title: pick(hero.title, base.hero.title),
      description: pick(hero.description, base.hero.description),
      primaryCta: pick(hero.primaryCta, base.hero.primaryCta),
      secondaryCta: pick(hero.secondaryCta, base.hero.secondaryCta),
      image: pickNullable(hero.imageUrl, base.hero.image),
    },
    contact: {
      phone,
      // Không nhập số hiển thị thì lấy luôn số dùng để gọi — đỡ bắt chủ cửa
      // hàng gõ cùng một số hai lần.
      phoneLabel: pick(
        contactDoc.phoneLabel,
        phone !== base.contact.phone ? phone : base.contact.phoneLabel,
      ),
      zaloUrl: safeUrl(contactDoc.zaloUrl, base.contact.zaloUrl),
      messengerUrl: safeUrl(contactDoc.messengerUrl, base.contact.messengerUrl),
      address: pick(contactDoc.address, base.contact.address),
      workingHours: pick(contactDoc.workingHours, base.contact.workingHours),
    },
  };
}

/**
 * Đọc nội dung của cửa hàng. Chưa có tài liệu, hoặc đọc lỗi, thì dùng mặc định
 * — trang phải chạy được kể cả khi chủ cửa hàng chưa nhập gì.
 */
export async function fetchSiteContent(): Promise<SiteContent> {
  try {
    if (!hasSupabaseConfig || !supabase) return defaults;

    const { data, error } = await supabase
      .from("app_documents")
      .select("data")
      .eq("store_id", STORE_ID)
      .eq("id", DOCUMENT_KEY)
      .maybeSingle();
    if (error || !data) return defaults;
    return mergeSiteContent(defaults, (data as { data: unknown }).data);
  } catch {
    return defaults;
  }
}
