"use client";

import Image from "next/image";
import Link from "next/link";
import { useOrders, type OrderStatus } from "@/context/OrderContext";
import { formatUsd } from "@/lib/format";
import styles from "./orders.module.css";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:   "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping:  "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export default function OrdersPage() {
  const { orders, loading, cancelOrder } = useOrders();

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>Đang tải đơn hàng...</div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Đơn hàng của tôi</h1>
          </header>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📦</div>
            <h2 className={styles.emptyTitle}>Chưa có đơn hàng nào</h2>
            <p className={styles.emptyDesc}>
              Hãy khám phá các sản phẩm của Mei Closet và đặt hàng đầu tiên nhé!
            </p>
            <Link href="/" className={styles.shopBtn}>Khám phá ngay</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Đơn hàng của tôi</h1>
          <p className={styles.subtitle}>{orders.length} đơn hàng</p>
        </header>

        <div className={styles.orderList}>
          {orders.map((order) => {
            const previewItems = order.items.slice(0, 3);
            const extraCount = order.items.length - 3;

            return (
              <div key={order.id} className={styles.orderCard}>
                {/* Header */}
                <div className={styles.orderHeader}>
                  <div className={styles.orderIdGroup}>
                    <span className={styles.orderId}>{order.id}</span>
                    <span className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <span className={`${styles.status} ${styles[`status_${order.status}`]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                {/* Body */}
                <div className={styles.orderBody}>
                  <div className={styles.orderImages}>
                    {previewItems.map((item) => (
                      <Image
                        key={item.id}
                        src={item.imageUrl}
                        alt={item.title}
                        width={60}
                        height={75}
                        className={styles.orderThumb}
                        style={{ objectFit: "cover" }}
                      />
                    ))}
                    {extraCount > 0 && (
                      <div className={styles.moreItems}>+{extraCount}</div>
                    )}
                  </div>
                  <div className={styles.orderInfo}>
                    <div className={styles.orderItemNames}>
                      {order.items.map((i) => i.title).join(", ")}
                    </div>
                    <div className={styles.orderMeta}>
                      {order.items.length} sản phẩm ·{" "}
                      {order.paymentMethod === "cod" ? "Tiền mặt (COD)" :
                       order.paymentMethod === "bank_transfer" ? "Chuyển khoản" : "MoMo"} ·{" "}
                      Giao tới: {order.shippingInfo.city}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className={styles.orderFooter}>
                  <span className={styles.orderTotal}>{formatUsd(order.totalPrice)}</span>
                  <div className={styles.orderActions}>
                    <Link href={`/orders/${order.id}`} className={styles.btnDetail}>
                      Chi tiết
                    </Link>
                    {order.status === "pending" && (
                      <button
                        className={styles.btnCancel}
                        onClick={() => {
                          if (confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) {
                            cancelOrder(order.id);
                          }
                        }}
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
