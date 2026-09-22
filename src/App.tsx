import { useEffect, useState } from "react";
import { Menu, Sun, Moon, Laptop, Phone } from "lucide-react";
import { useSiteContent } from "@/SiteContentContext";
import { Hero } from "@/sections/Hero";
import { Calculator } from "@/sections/Calculator";
import { Featured } from "@/sections/Featured";
import { Products } from "@/sections/Products";
import { MaterialStory } from "@/sections/MaterialStory";
import { Contact } from "@/sections/Contact";
import { MobileNav } from "@/components/MobileNav";
import { PlaceholderNotice } from "@/components/PlaceholderNotice";
import "@/styles/app.css";

type Appearance = "light" | "dark" | "system";

const NAV = [
  { href: "#san-pham", label: "Sản phẩm", number: "01" },
  { href: "#he-nhom", label: "Hệ nhôm", number: "02" },
  { href: "#tinh-gia", label: "Tính giá", number: "03" },
  { href: "#lien-he", label: "Liên hệ", number: "04" },
];

function App() {
  const content = useSiteContent();
  const [appearance, setAppearance] = useState<Appearance>("system");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("#san-pham");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Monitor scroll for nav shrink and active section indicator
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ["san-pham", "he-nhom", "tinh-gia", "lien-he"];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(`#${sections[i]}`);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const calculateProduct = (id: string) => {
    setSelectedProductId(id);
    document
      .getElementById("tinh-gia")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const applyAppearance = (next: Appearance) => {
    setAppearance(next);
    const root = document.documentElement;
    if (next === "system") delete root.dataset.appearance;
    else root.dataset.appearance = next;
  };

  return (
    <div className="shell">
      {/* Skip link for keyboard accessibility */}
      <a className="skip-link" href="#noi-dung">
        Tới nội dung chính
      </a>

      {/* Floating Sticky Architectural Header */}
      <header className={`shell-head ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="shell-head-inner">
          <a
            href="#"
            className="shell-brand"
            aria-label={`Trang chủ ${content.brand}`}
          >
            {content.brandLogo && (
              <img
                src={content.brandLogo}
                alt=""
                width={42}
                height={38}
                decoding="async"
              />
            )}
          </a>

          <nav className="shell-nav" aria-label="Menu chính">
            {NAV.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`shell-nav-link ${isActive ? "is-active" : ""}`}
                >
                  <span className="shell-nav-label">{item.label}</span>
                  {isActive && (
                    <span className="shell-nav-indicator" aria-hidden="true" />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="shell-actions">
            {/* Appearance Switcher */}
            <div className="theme-switch" role="group" aria-label="Giao diện">
              {(["light", "dark", "system"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={appearance === mode}
                  className={appearance === mode ? "is-active" : undefined}
                  onClick={() => applyAppearance(mode)}
                  title={`Chế độ ${mode === "light" ? "sáng" : mode === "dark" ? "tối" : "hệ thống"}`}
                >
                  {mode === "light" && <Sun size={14} className="theme-icon" />}
                  {mode === "dark" && <Moon size={14} className="theme-icon" />}
                  {mode === "system" && (
                    <Laptop size={14} className="theme-icon" />
                  )}
                </button>
              ))}
            </div>

            {/* Quick Consultation Call CTA */}
            {content.contact.phone && (
              <a
                href={`tel:${content.contact.phone}`}
                className="btn btn-sm btn-primary nav-call-btn"
                aria-label={`Gọi ngay: ${content.contact.phoneLabel || content.contact.phone}`}
              >
                <Phone size={13} />
                <span>
                  {content.contact.phoneLabel || content.contact.phone}
                </span>
              </a>
            )}

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              className="mobile-menu-trigger"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Mở menu điều hướng"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navItems={NAV}
        activeHref={activeSection}
        appearance={appearance}
        onAppearanceChange={applyAppearance}
        content={content}
      />

      <PlaceholderNotice />

      <main id="noi-dung">
        {/* 1. Cinematic Hero */}
        <Hero />

        {/* Featured Products (if curated) */}
        <Featured onCalculate={calculateProduct} />

        {/* 2. Large Product Showcase */}
        <Products onCalculate={calculateProduct} />

        {/* 3. Product / Material Storytelling */}
        <MaterialStory />

        {/* 4. Interactive Quotation Studio */}
        <Calculator
          selectedId={selectedProductId}
          onSelect={setSelectedProductId}
        />

        {/* 5. Large Premium CTA & Contact */}
        <Contact />
      </main>

      {/* Minimal Editorial Footer */}
      <footer className="shell-foot">
        <div className="shell-foot-inner">
          <div className="shell-foot-brand">
            <strong>{content.brand}</strong>
            <p>Hệ thống cửa nhôm kính cao cấp tiêu chuẩn kiến trúc.</p>
          </div>

          <div className="shell-foot-meta">
            <p>
              {[content.contact.phoneLabel, content.contact.address]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {content.contact.workingHours && (
              <p>{content.contact.workingHours}</p>
            )}
            <p className="shell-foot-disclaimer">
              Giá hiển thị là số liệu dự toán tham khảo tại xưởng, chưa bao gồm
              chi phí khảo sát đặc thù và vận chuyển ngoại tỉnh.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
