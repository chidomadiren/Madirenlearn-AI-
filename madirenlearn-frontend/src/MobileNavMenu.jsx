import React, { useEffect, useState } from 'react';

export function MobileNavMenu({
  items = [
    { label: 'Home', href: '#home', view: 'home' },
    { label: 'Features', href: '#features', view: 'features' },
    { label: 'Pricing', href: '#pricing', view: 'pricing' },
    { label: 'About', href: '#about', view: 'about' },
  ],
  onNavigate,
  onOpenLogin,
  onOpenSignup,
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToTarget = (selector) => {
    if (!selector) return;
    const id = selector.startsWith('#') ? selector.slice(1) : selector;
    const el = document.getElementById(id) || document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleItemClick = (item, e) => {
    e.preventDefault();
    setOpen(false);

    if (typeof onNavigate === 'function') {
      onNavigate(item);
      setTimeout(() => scrollToTarget(item.href), 80);
      return;
    }

    scrollToTarget(item.href);
  };

  return (
    <div className="ml-mobile-nav-wrapper">
      <button
        type="button"
        className="ml-hamburger-btn"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div className="ml-mobile-drawer" role="dialog" aria-label="Mobile Navigation">
          <div className="ml-mobile-drawer-top">
            <span className="ml-mobile-brand">madirenLearn AI</span>
            <button
              type="button"
              className="ml-mobile-close-btn"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="ml-mobile-links-list" aria-label="Mobile Navigation">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href || `#${item.label.toLowerCase()}`}
                className="ml-mobile-link"
                onClick={(e) => handleItemClick(item, e)}
              >
                <span className="ml-mobile-link-text">{item.label}</span>
                <span className="ml-mobile-link-arrow">→</span>
              </a>
            ))}
          </nav>

          {(onOpenLogin || onOpenSignup) && (
            <div className="ml-mobile-auth-row">
              {onOpenLogin && (
                <button
                  type="button"
                  className="ml-mobile-login-btn"
                  onClick={() => {
                    setOpen(false);
                    onOpenLogin();
                  }}
                >
                  Log In
                </button>
              )}
              {onOpenSignup && (
                <button
                  type="button"
                  className="ml-mobile-signup-btn"
                  onClick={() => {
                    setOpen(false);
                    onOpenSignup();
                  }}
                >
                  Sign Up
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MobileNavMenu;
