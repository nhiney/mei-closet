"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        {/* Newsletter Section */}
        <div className={styles.newsletter}>
          <div className={styles.newsText}>
            <h3>Join the Mei Club</h3>
            <p>Nhận bản tin phong cách và ưu đãi đặc quyền hàng tuần.</p>
          </div>
          <form className={styles.newsForm} onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Địa chỉ email của nàng..." 
              className={styles.newsInput}
            />
            <button type="submit" className={styles.newsSubmit}>Đăng ký</button>
          </form>
        </div>

        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <span className={`${styles.brandName} handwritten`}>Mei Closet</span>
            <p className={styles.brandDesc}>
              Khám phá vẻ đẹp vượt thời gian qua những món đồ tuyển chọn và len sợi đan tay đầy tâm huyết. 
              Mỗi sản phẩm tại Mei là một lời nhắn nhủ về sự dịu dàng và hoài niệm.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialIcon}><InstagramIcon /></a>
              <a href="#" className={styles.socialIcon}><FacebookIcon /></a>
              <a href="#" className={styles.socialIcon}><TikTokIcon /></a>
            </div>
          </div>

          {/* Navigation */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Khám phá</h4>
            <nav className={styles.linkNav}>
              <Link href="/">Bộ sưu tập mới</Link>
              <Link href="/?category=knitwear">Knit Studio</Link>
              <Link href="/wishlist">Danh sách yêu thích</Link>
              <Link href="/about">Về Mei Closet</Link>
            </nav>
          </div>

          {/* Support */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Hỗ trợ</h4>
            <nav className={styles.linkNav}>
              <Link href="/shipping">Chính sách vận chuyển</Link>
              <Link href="/returns">Đổi trả & Bảo hành</Link>
              <Link href="/size-guide">Hướng dẫn chọn size</Link>
              <Link href="/faq">Câu hỏi thường gặp</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Liên hệ</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <EmailIcon />
                <span>hello@meicloset.vn</span>
              </div>
              <div className={styles.contactItem}>
                <PhoneIcon />
                <span>0909 123 456</span>
              </div>
              <div className={styles.contactItem}>
                <MapIcon />
                <span>28 Đường số 7, Phường Thảo Điền, Quận 2, TP.HCM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Mei Closet. All Rights Reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/terms">Điều khoản</Link>
            <Link href="/privacy">Bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Icons
function EmailIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
}
function PhoneIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function MapIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function InstagramIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
}
function FacebookIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
}
function TikTokIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>;
}
