import { content } from '@/content';

/**
 * Phần mở đầu của trang.
 *
 * Nói cửa hàng làm gì rồi đẩy người đọc xuống danh sách sản phẩm — đó là toàn
 * bộ nhiệm vụ của nó. Không số liệu, không huy chương, không lời hứa: xem ghi
 * chú đầu `content.ts`.
 */
export function Hero() {
  const { hero, contact } = content;

  const scrollToProducts = () => {
    document.getElementById('san-pham')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        {hero.eyebrow && <p className="hero-eyebrow">{hero.eyebrow}</p>}
        <h1 id="hero-title" className="hero-title">{hero.title}</h1>
        <p className="hero-description">{hero.description}</p>

        <div className="hero-actions">
          <button type="button" className="btn btn-primary" onClick={scrollToProducts}>
            {hero.primaryCta}
          </button>
          <a className="btn" href={`tel:${contact.phone}`}>
            {hero.secondaryCta}
          </a>
        </div>
      </div>

      {hero.image && (
        <div className="hero-media">
          <img src={hero.image} alt="" decoding="async" />
        </div>
      )}
    </section>
  );
}
