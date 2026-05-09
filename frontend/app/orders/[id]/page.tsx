"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOrders, type OrderStatus, type Order } from "@/context/OrderContext";
import { formatUsd } from "@/lib/format";
import styles from "../orders.module.css";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:   "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping:  "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const STATUS_STEPS: OrderStatus[] = ["pending", "confirmed", "shipping", "delivered"];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getOrderById, cancelOrder } = useOrders();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id).then((o) => {
      setOrder(o);
      setLoading(false);
    });
  }, [id, getOrderById]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>Đang tải chi tiết đơn hàng...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <h2 className={styles.emptyTitle}>Không tìm thấy đơn hàng</h2>
            <p className={styles.emptyDesc}>Mã đơn hàng không tồn tại.</p>
            <Link href="/orders" className={styles.shopBtn}>Xem tất cả đơn hàng</Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStatusIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/orders" style={{ fontSize: "0.8rem", color: "var(--color-foreground-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            ← Đơn hàng của tôi
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 className={styles.title} style={{ fontSize: "1.8rem" }}>{order.id}</h1>
              <p className={styles.subtitle}>{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
            </div>
            <span className={`${styles.status} ${styles[`status_${order.status}`]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
        </header>

        {/* Progress Tracker */}
        {order.status !== "cancelled" && (
          <div style={{ background: "var(--color-background-alt)", border: "1px solid var(--color-border)", padding: "2rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
              {STATUS_STEPS.map((s, i) => (
                <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: i <= currentStatusIdx ? "var(--color-primary)" : "var(--color-background)",
                    border: `2px solid ${i <= currentStatusIdx ? "var(--color-primary)" : "var(--color-border-strong)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: i <= currentStatusIdx ? "white" : "var(--color-foreground-muted)",
                    fontSize: "0.85rem", fontWeight: 700,
                    transition: "all 0.4s",
                  }}>
                    {i < currentStatusIdx ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: i <= currentStatusIdx ? "var(--color-primary)" : "var(--color-foreground-muted)" }}>
                    {STATUS_LABELS[s]}
                  </span>
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{
                      position: "absolute", top: 18, left: "50%", width: "100%", height: 2,
                      background: i < currentStatusIdx ? "var(--color-primary)" : "var(--color-border)",
                      zIndex: 0, transition: "background 0.4s",
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }}>
          {/* Items */}
          <div>
            <div style={{ background: "var(--color-background-alt)", border: "1px solid var(--color-border)", padding: "2rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-primary)", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--color-divider)" }}>
                Sản phẩm đặt mua
              </div>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid var(--color-divider)" }}>
                  <Image src={item.imageUrl} alt={item.title} width={70} height={88} style={{ objectFit: "cover", border: "1px solid var(--color-border)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "var(--color-foreground)", marginBottom: "0.25rem" }}>{item.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-foreground-muted)" }}>
                      {item.size && `Cỡ: ${item.size} · `}Số lượng: {item.quantity}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>{formatUsd(item.price * item.quantity)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "1rem" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-foreground-muted)" }}>Tổng cộng</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>{formatUsd(order.totalPrice)}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {order.status === "pending" && (
              <button
                className={styles.btnCancel}
                style={{ padding: "0.9rem 2rem" }}
                onClick={() => { if (confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) cancelOrder(order.id); }}
              >
                Hủy đơn hàng
              </button>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Shipping Info */}
            <div style={{ background: "var(--color-background-alt)", border: "1px solid var(--color-border)", padding: "1.5rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-primary)", marginBottom: "1rem" }}>
                Thông tin giao hàng
              </div>
              {[
                ["Họ tên", order.shippingInfo.fullName],
                ["Điện thoại", order.shippingInfo.phone],
                ["Địa chỉ", order.shippingInfo.address],
                ["Thành phố", order.shippingInfo.city],
                ...(order.shippingInfo.note ? [["Ghi chú", order.shippingInfo.note]] : []),
              ].map(([key, val]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "0.35rem 0" }}>
                  <span style={{ color: "var(--color-foreground-muted)" }}>{key}</span>
                  <span style={{ color: "var(--color-foreground)", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{val}</span>
                </div>
              ))}
            </div>
            {/* Payment Info */}
            <div style={{ background: "var(--color-background-alt)", border: "1px solid var(--color-border)", padding: "1.5rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-primary)", marginBottom: "1rem" }}>
                Thanh toán
              </div>
              <div style={{ fontSize: "0.88rem", color: "var(--color-foreground)" }}>
                {order.paymentMethod === "cod" ? "💵 Tiền mặt khi nhận hàng (COD)" :
                 order.paymentMethod === "bank_transfer" ? "🏦 Chuyển khoản ngân hàng" : "📱 Ví MoMo"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
