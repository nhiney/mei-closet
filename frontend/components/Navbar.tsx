"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { APP_NAME } from "@mei-closet/shared";
import { AuthNav } from "@/components/AuthNav";
import { AboutSection } from "@/components/AboutSection";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isClothingMobileOpen, setIsClothingMobileOpen] = useState(false);
  const [isAccMobileOpen, setIsAccMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
          
          <nav className={styles.navLinks} aria-label="Primary">
            <Link href="/" className={styles.navItem}>{t("nav.home")}</Link>
            
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

            <Link href="/shop-len" className={styles.navItem}>Shop Len 🧶</Link>
            <Link href="/?category=knitwear" className={styles.navItem}>{t("nav.knit")}</Link>
            
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
          {/* Language Switcher */}
          <div className={styles.langSwitcher}>
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

          <button className={styles.iconButton} aria-label="Search">
            <SearchIcon />
          </button>
          <Link href="/wishlist" className={styles.iconButton} aria-label="Favorites">
            <HeartIcon />
          </Link>
          <div className={styles.authWrapper}>
            <Link href="/profile" className={styles.iconButton} aria-label="User Profile">
              <UserIcon />
            </Link>
            <div className={styles.authDropdown}>
              <AuthNav />
            </div>
          </div>
          <Link href="/cart" className={`${styles.iconButton} ${styles.cartButton}`} aria-label="Shopping Cart">
            <CartIcon />
            {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
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

            <Link href="/shop-len" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavItem}>Shop Len 🧶</Link>
            <Link href="/?category=knitwear" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavItem}>{t("nav.knit")}</Link>
            <Link href="#about" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavItem}>{t("nav.info")}</Link>
            <Link href="#footer" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavItem}>{t("nav.contact")}</Link>

            <div className={styles.mobileSecondaryLinks}>
              {isAdmin && <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Atelier</Link>}
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

