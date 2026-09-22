import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, ArrowUpRight, X, Sun, Moon, Laptop } from 'lucide-react';
import type { SiteContent } from '@/content';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ href: string; label: string; number: string }>;
  activeHref: string;
  appearance: 'light' | 'dark' | 'system';
  onAppearanceChange: (mode: 'light' | 'dark' | 'system') => void;
  content: SiteContent;
}

export function MobileNav({
  isOpen,
  onClose,
  navItems,
  activeHref,
  appearance,
  onAppearanceChange,
  content,
}: MobileNavProps) {
  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleLinkClick = (href: string) => {
    onClose();
    // Allow smooth scroll to register
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="mobile-nav-portal" role="dialog" aria-modal="true" aria-label="Menu điều hướng">
          <motion.div
            className="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
          />

          <motion.div
            className="mobile-nav-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            <div className="mobile-nav-header">
              <div className="mobile-nav-brand">
                {content.brandLogo && (
                  <img src={content.brandLogo} alt="" width={32} height={22} decoding="async" />
                )}
                <strong>{content.brand}</strong>
                <span className="mobile-nav-badge">Showroom</span>
              </div>
              <button
                type="button"
                className="mobile-nav-close"
                onClick={onClose}
                aria-label="Đóng menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-nav-links" aria-label="Danh mục điều hướng">
              {navItems.map((item, index) => {
                const isActive = activeHref === item.href;
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className={`mobile-nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.href);
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * index + 0.1, duration: 0.3 }}
                  >
                    <span className="mobile-nav-num">{item.number}</span>
                    <span className="mobile-nav-text">{item.label}</span>
                    <ArrowUpRight size={16} className="mobile-nav-arrow" />
                  </motion.a>
                );
              })}
            </nav>

            <div className="mobile-nav-footer">
              <div className="mobile-nav-theme">
                <span className="mobile-nav-label">Giao diện</span>
                <div className="theme-switch mobile-theme-switch" role="group" aria-label="Giao diện">
                  {(['light', 'dark', 'system'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      aria-pressed={appearance === mode}
                      className={appearance === mode ? 'is-active' : undefined}
                      onClick={() => onAppearanceChange(mode)}
                    >
                      {mode === 'light' && <Sun size={14} />}
                      {mode === 'dark' && <Moon size={14} />}
                      {mode === 'system' && <Laptop size={14} />}
                      <span>{mode === 'light' ? 'Sáng' : mode === 'dark' ? 'Tối' : 'Tự động'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {content.contact.phone && (
                <a
                  href={`tel:${content.contact.phone}`}
                  className="btn btn-primary mobile-nav-call"
                  onClick={onClose}
                >
                  <Phone size={16} />
                  <span>Gọi tư vấn: {content.contact.phoneLabel || content.contact.phone}</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
