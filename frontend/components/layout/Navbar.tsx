"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { APP_NAME } from "@mei-closet/shared";
import { AuthNav } from "@/features/auth/components/AuthNav";
import { AboutSection } from "./AboutSection";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import styles from "./Navbar.module.css";

export function Navbar() {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { totalItems } = useCart();
  const isAdmin = user?.role === "admin";
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isClothingMobileOpen, setIsClothingMobileOpen] = useState(false);
  const [isAccMobileOpen, setIsAccMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Restore theme from localStorage
    const savedTheme = localStorage.getItem('mei-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const clothingItems = [
    { name: t("nav.shirts"), href: "/?category=shirt" },
    { name: t("nav.pants"), href: "/?category=pants" },
    { name: t("nav.skirts"), href: "/?category=others&search=skirt" },
    { name: t("nav.jackets"), href: "/?category=jacket" },
  ];

  const accessoryItems = [
    { name: t("nav.shoes"), href: "/?category=shoes" },
    { name: t("nav.bags"), href: "/?category=others&search=bag" },
    { name: t("nav.otherAcc"), href: "/?category=others" },
  ];

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Left: Branding & Categories */}
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logoGroup}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo-icon.png"
                alt="Mei Closet Logo"
                width={40}
                height={40}
                className={styles.logoIcon}
              />
            </div>
            <span className={`${styles.logoText} handwritten`}>
              {APP_NAME}
            </span>
          </Link>
          
          <nav className={styles.navLinks}>
            <Link href="/" className={`${styles.navItem} ${styles.active}`}>{t("nav.home")}</Link>
            
            {/* Clothing Dropdown */}
            <div className={styles.navItemContainer}>
              <button className={styles.navItem}>
                {t("nav.clothing")} <span className={styles.chevron}>▾</span>
              </button>
              <div className={styles.dropdownMenu}>
                {clothingItems.map(item => (
                  <Link key={item.href} href={item.href} className={styles.dropdownItem}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Accessories Dropdown */}
            <div className={styles.navItemContainer}>
              <button className={styles.navItem}>
                {t("nav.accessories")} <span className={styles.chevron}>▾</span>
              </button>
              <div className={styles.dropdownMenu}>
                {accessoryItems.map(item => (
                  <Link key={item.href} href={item.href} className={styles.dropdownItem}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/shop-len" className={styles.navItem}>{t("nav.knit")} 🧶</Link>
            
            <button 
              className={`${styles.navItem} ${isAboutOpen ? styles.active : ""}`}
              onClick={() => setIsAboutOpen(!isAboutOpen)}
            >
              {t("nav.info")}
            </button>
            
            <Link href="#footer" className={styles.navItem}>{t("nav.contact")}</Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className={styles.userActions}>
          <button className={styles.iconButton} aria-label="Search">
            <SearchIcon />
          </button>
          
          {/* Settings Dropdown (Language + DarkMode) */}
          <div className={styles.navItemContainer}>
            <button className={styles.iconButton} aria-label="Settings">
              <SettingsIcon />
            </button>
            <div className={styles.dropdownMenu}>
              <div className={styles.settingsHeader}>
                {t("nav.settings") || "Thiết lập"}
              </div>
              
              {/* Language Section */}
              <div className={styles.settingsSection}>
                <span className={styles.settingsLabel}>{t("nav.language") || "Ngôn ngữ"}</span>
                <div className={styles.langToggle}>
                  <button 
                    onClick={() => setLanguage("vi")}
                    className={`${styles.langBtn} ${language === "vi" ? styles.langActive : ""}`}
                  >
                    VN
                  </button>
                  <span className={styles.langDivider}>|</span>
                  <button 
                    onClick={() => setLanguage("en")}
                    className={`${styles.langBtn} ${language === "en" ? styles.langActive : ""}`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Dark Mode Section */}
              <div className={styles.settingsSection}>
                <span className={styles.settingsLabel}>
                  {t("nav.darkMode") || "Giao diện"}
                </span>
                <button 
                  className={styles.themeToggle}
                  onClick={() => {
                    const current = document.documentElement.getAttribute('data-theme');
                    const next = current === 'dark' ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', next);
                    localStorage.setItem('mei-theme', next);
                    window.dispatchEvent(new Event('theme-change'));
                  }}
                  aria-label="Toggle Theme"
                >
                  <div className={styles.toggleTrack}>
                    <div className={styles.toggleThumb}>
                      <div className={styles.sunIcon}><SunIcon /></div>
                      <div className={styles.moonIcon}><MoonIcon /></div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className={styles.navItemContainer}>
            {user ? (
              <Link href="/profile" className={styles.iconButton} aria-label="Hồ sơ">
                <UserIcon />
              </Link>
            ) : (
              <Link href="/login" className={styles.iconButton} aria-label="Đăng nhập">
                <UserIcon />
              </Link>
            )}
            <div className={`${styles.dropdownMenu} ${!user ? styles.authDropdown : ''}`}>
              <div className={styles.settingsHeader}>
                {user ? (user.email.split('@')[0]) : "Tài khoản"}
              </div>
              <AuthNav />
            </div>
          </div>

          <Link href="/wishlist" className={styles.iconButton} aria-label="Favorites">
            <HeartIcon />
          </Link>

          {user && (
            <Link href="/orders" className={styles.iconButton} aria-label="Đơn hàng" title="Đơn hàng của tôi">
              <OrderIcon />
            </Link>
          )}

          <Link href="/cart" className={`${styles.iconButton} ${styles.cartButton}`} aria-label="Shopping Cart">
            <CartIcon />
            {mounted && totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
          </Link>

          <button 
            className={styles.mobileToggle} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className={isMobileMenuOpen ? styles.menuIconActive : ""}>
              <MenuIcon />
            </div>
          </button>
        </div>
      </div>

      {/* About Section Dropdown (Desktop) */}
      <AboutSection isOpen={isAboutOpen} />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            {/* Mobile Language Switch */}
            <div className={styles.mobileLangBar}>
              <button onClick={() => setLanguage("vi")} className={`${styles.langBtn} ${language === "vi" ? styles.langActive : ""}`}>Tiếng Việt</button>
              <button onClick={() => setLanguage("en")} className={`${styles.langBtn} ${language === "en" ? styles.langActive : ""}`}>English</button>
            </div>

            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavItem}>{t("nav.home")}</Link>

            {/* Mobile Clothing Accordion */}
            <div className={`${styles.mobileAccordion} ${isClothingMobileOpen ? styles.mobileOpen : ""}`}>
              <button className={styles.mobileAccordionTrigger} onClick={() => setIsClothingMobileOpen(!isClothingMobileOpen)}>
                {t("nav.clothing")} <span>▾</span>
              </button>
              <div className={styles.mobileAccordionContent}>
                <div className={styles.subOpen}>
                  {clothingItems.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileSubItem}>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Accessories Accordion */}
            <div className={`${styles.mobileAccordion} ${isAccMobileOpen ? styles.mobileOpen : ""}`}>
              <button className={styles.mobileAccordionTrigger} onClick={() => setIsAccMobileOpen(!isAccMobileOpen)}>
                {t("nav.accessories")} <span>▾</span>
              </button>
              <div className={styles.mobileAccordionContent}>
                <div className={styles.subOpen}>
                  {accessoryItems.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileSubItem}>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/shop-len" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavItem}>{t("nav.knit")} 🧶</Link>
            <Link href="#about" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavItem}>{t("nav.info")}</Link>
            <Link href="#footer" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavItem}>{t("nav.contact")}</Link>

            <div className={styles.mobileSecondaryLinks}>
              {isAdmin && <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Atelier</Link>}
              <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)}>📦 Đơn hàng</Link>
              <Link href="/sell" onClick={() => setIsMobileMenuOpen(false)}>List Item</Link>
            </div>
          </div>
        </div>
      )}
    </header>

  );
}

// Minimalist components for icons
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  );
}

function OrderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4"/><path d="M3 10h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
  );
}

function SunIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="18.36" x2="5.64" y2="16.93"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
  );
}

function MoonIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
  );
}

