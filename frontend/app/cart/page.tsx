"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatUsd } from "@/lib/format";
import styles from "./cart.module.css";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className={styles.cartPage}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t("cart.title")}</h1>
        </header>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2 className={styles.emptyTitle}>{t("cart.empty")}</h2>
          <p className={styles.emptyDesc}>{t("cart.emptyDesc")}</p>
          <Link href="/" className={styles.exploreBtn}>
            {t("cart.continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("cart.title")}</h1>
        <p className={styles.subtitle}>
          {totalItems} {t("cart.itemCount")}
        </p>
      </header>

      <div className={styles.cartList}>
        {items.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.itemImage}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="100px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={styles.itemDetails}>
              <div className={styles.itemTop}>
                <Link href={`/products/${item.id}`} className={styles.itemName}>
                  {item.title}
                </Link>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {item.size && (
                <span className={styles.itemSizeTag}>
                  {t("filter.size")}: {item.size}
                </span>
              )}

              <div className={styles.itemBottom}>
                <div className={styles.qtyControls}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <span className={styles.itemPrice}>
                  {formatUsd(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span>{t("cart.subtotal")}</span>
          <span>{formatUsd(totalPrice)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>{t("cart.shipping")}</span>
          <span>{t("cart.shippingFree")}</span>
        </div>
        <div className={styles.summaryTotal}>
          <span className={styles.totalLabel}>{t("cart.total")}</span>
          <span className={styles.totalValue}>{formatUsd(totalPrice)}</span>
        </div>
        <div className={styles.actions}>
          <button className={styles.checkoutBtn}>
            {t("cart.checkout")}
          </button>
          <button className={styles.clearBtn} onClick={clearCart}>
            {t("cart.clear")}
          </button>
        </div>
      </div>
    </div>
  );
}
