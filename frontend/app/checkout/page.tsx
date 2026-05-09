"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useOrders, type ShippingInfo, type PaymentMethod } from "@/context/OrderContext";
import { formatUsd } from "@/lib/format";
import styles from "./checkout.module.css";

// ─── Step Definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Thông tin" },
  { id: 2, label: "Thanh toán" },
  { id: 3, label: "Xác nhận" },
];

const PAYMENT_OPTIONS: { id: PaymentMethod; name: string; desc: string; icon: string }[] = [
  { id: "cod",           name: "Tiền mặt (COD)",    desc: "Trả tiền khi nhận hàng",          icon: "💵" },
  { id: "bank_transfer", name: "Chuyển khoản",       desc: "Chuyển khoản ngân hàng trước",     icon: "🏦" },
  { id: "momo",          name: "MoMo",               desc: "Thanh toán qua ví MoMo",           icon: "📱" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Shipping form state
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  // Redirect if cart is empty and no order placed
  if (items.length === 0 && !placedOrderId) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.successScreen}>
            <div className={styles.successIcon}>🛒</div>
            <h2 className={styles.successTitle}>Giỏ hàng trống</h2>
            <p className={styles.successDesc}>Hãy thêm sản phẩm vào giỏ trước khi thanh toán.</p>
            <div className={styles.successActions}>
              <Link href="/" className={styles.btnViewOrders}>Khám phá sản phẩm</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Validation ───────────────────────────────────────────────────────────

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!shipping.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!shipping.phone.trim() || !/^[0-9]{9,11}$/.test(shipping.phone.replace(/\s/g, "")))
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (!shipping.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!shipping.city.trim()) newErrors.city = "Vui lòng nhập thành phố";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleNextStep = () => {
    if (step === 1 && !validate()) return;
    setStep((s) => s + 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const order = await createOrder(items, shipping, paymentMethod);
      clearCart();
      setPlacedOrderId(order.id);
      setStep(4); // success step
    } catch (err: any) {
      alert(err.message || "Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Render: Success ──────────────────────────────────────────────────────

  if (step === 4 && placedOrderId) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.successScreen}>
            <div className={styles.successIcon}>✓</div>
            <h1 className={styles.successTitle}>Đặt hàng thành công!</h1>
            <p className={styles.successDesc}>
              Cảm ơn bạn đã mua sắm tại <strong>Mei Closet</strong>. Chúng mình sẽ liên hệ để xác nhận đơn hàng sớm nhất!
            </p>
            <div className={styles.orderId}>{placedOrderId}</div>
            <p className={styles.successDesc} style={{ fontSize: "0.85rem" }}>
              Đơn hàng của bạn đang được xử lý. Bạn có thể theo dõi trạng thái tại trang Đơn hàng của tôi.
            </p>
            <div className={styles.successActions}>
              <Link href="/orders" className={styles.btnViewOrders}>
                Xem đơn hàng
              </Link>
              <Link href="/" className={styles.btnContinue}>
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Main Checkout ────────────────────────────────────────────────

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <Link href="/cart" className={styles.backLink}>
            ← Quay lại giỏ hàng
          </Link>
          <h1 className={styles.title}>Thanh toán</h1>
        </header>

        {/* Stepper */}
        <div className={styles.stepper}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div className={`${styles.step} ${step === s.id ? styles.stepActive : ""} ${step > s.id ? styles.stepDone : ""}`}>
                <div className={styles.stepNumber}>
                  {step > s.id ? "✓" : s.id}
                </div>
                <span className={styles.stepLabel}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${styles.stepLine} ${step > s.id ? styles.stepLineDone : ""}`} />
              )}
            </div>
          ))}
        </div>

        {/* Main Layout */}
        <div className={styles.layout}>
          {/* Left: Form or Confirmation */}
          <div>
            {/* Step 1: Shipping Info */}
            {step === 1 && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Thông tin giao hàng</h2>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>Họ và tên *</label>
                    <input
                      className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
                      placeholder="Nguyễn Thị Hoa"
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    />
                    {errors.fullName && <span className={styles.errorMsg}>{errors.fullName}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Số điện thoại *</label>
                    <input
                      className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                      placeholder="0912 345 678"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    />
                    {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
                  </div>
                  <div className={`${styles.field} ${styles.formGridFull}`}>
                    <label className={styles.label}>Địa chỉ *</label>
                    <input
                      className={`${styles.input} ${errors.address ? styles.inputError : ""}`}
                      placeholder="123 Đường ABC, Phường XYZ"
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    />
                    {errors.address && <span className={styles.errorMsg}>{errors.address}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Thành phố *</label>
                    <input
                      className={`${styles.input} ${errors.city ? styles.inputError : ""}`}
                      placeholder="Hà Nội"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    />
                    {errors.city && <span className={styles.errorMsg}>{errors.city}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Ghi chú (tuỳ chọn)</label>
                    <input
                      className={styles.input}
                      placeholder="Giao giờ hành chính, gọi trước..."
                      value={shipping.note}
                      onChange={(e) => setShipping({ ...shipping, note: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <Link href="/cart" className={styles.btnBack}>← Giỏ hàng</Link>
                  <button className={styles.btnNext} onClick={handleNextStep}>
                    Tiếp theo →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Phương thức thanh toán</h2>
                <div className={styles.paymentOptions}>
                  {PAYMENT_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      className={`${styles.paymentOption} ${paymentMethod === opt.id ? styles.paymentOptionSelected : ""}`}
                      onClick={() => setPaymentMethod(opt.id)}
                    >
                      <div className={styles.paymentRadio}>
                        <div className={styles.paymentRadioInner} />
                      </div>
                      <div className={styles.paymentLabel}>
                        <div className={styles.paymentName}>{opt.name}</div>
                        <div className={styles.paymentDesc}>{opt.desc}</div>
                      </div>
                      <span className={styles.paymentIcon}>{opt.icon}</span>
                    </div>
                  ))}
                </div>

                {/* Bank Transfer Details */}
                {paymentMethod === "bank_transfer" && (
                  <div className={styles.bankDetails}>
                    <div className={styles.bankRow}>
                      <span className={styles.bankKey}>Ngân hàng</span>
                      <span className={styles.bankVal}>Vietcombank</span>
                    </div>
                    <div className={styles.bankRow}>
                      <span className={styles.bankKey}>Số tài khoản</span>
                      <span className={styles.bankVal}>0123 4567 8901</span>
                    </div>
                    <div className={styles.bankRow}>
                      <span className={styles.bankKey}>Chủ tài khoản</span>
                      <span className={styles.bankVal}>NGUYEN THI MEI</span>
                    </div>
                    <div className={styles.bankRow}>
                      <span className={styles.bankKey}>Nội dung CK</span>
                      <span className={styles.bankVal}>MEICLOSET {shipping.phone}</span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--color-foreground-muted)", marginTop: "1rem", lineHeight: 1.5 }}>
                      ⚠️ Vui lòng chuyển khoản trước khi đặt hàng. Đơn hàng sẽ được xử lý sau khi nhận được thanh toán.
                    </p>
                  </div>
                )}

                {paymentMethod === "momo" && (
                  <div className={styles.bankDetails}>
                    <div className={styles.bankRow}>
                      <span className={styles.bankKey}>Số MoMo</span>
                      <span className={styles.bankVal}>0987 654 321</span>
                    </div>
                    <div className={styles.bankRow}>
                      <span className={styles.bankKey}>Chủ ví</span>
                      <span className={styles.bankVal}>NGUYEN THI MEI</span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--color-foreground-muted)", marginTop: "1rem", lineHeight: 1.5 }}>
                      📱 Mở app MoMo → Chuyển tiền → Nhập số điện thoại trên → Nhập số tiền và ghi nội dung tên của bạn.
                    </p>
                  </div>
                )}

                <div className={styles.formActions}>
                  <button className={styles.btnBack} onClick={() => setStep(1)}>← Quay lại</button>
                  <button className={styles.btnNext} onClick={handleNextStep}>
                    Xem lại đơn →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className={styles.confirmBox}>
                <h2 className={styles.sectionTitle}>Xác nhận đơn hàng</h2>

                <div className={styles.confirmGroup}>
                  <div className={styles.confirmGroupTitle}>Thông tin giao hàng</div>
                  <div className={styles.confirmRow}><span>Họ tên</span><span>{shipping.fullName}</span></div>
                  <div className={styles.confirmRow}><span>Điện thoại</span><span>{shipping.phone}</span></div>
                  <div className={styles.confirmRow}><span>Địa chỉ</span><span>{shipping.address}</span></div>
                  <div className={styles.confirmRow}><span>Thành phố</span><span>{shipping.city}</span></div>
                  {shipping.note && <div className={styles.confirmRow}><span>Ghi chú</span><span>{shipping.note}</span></div>}
                </div>

                <div className={styles.confirmGroup}>
                  <div className={styles.confirmGroupTitle}>Thanh toán</div>
                  <div className={styles.confirmRow}>
                    <span>Phương thức</span>
                    <span>{PAYMENT_OPTIONS.find(p => p.id === paymentMethod)?.name}</span>
                  </div>
                </div>

                <div className={styles.confirmGroup}>
                  <div className={styles.confirmGroupTitle}>Sản phẩm đặt mua ({items.length} món)</div>
                  <div className={styles.confirmItems}>
                    {items.map((item) => (
                      <div key={item.id} className={styles.confirmItem}>
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={48}
                          height={60}
                          className={styles.confirmItemImg}
                          style={{ objectFit: "cover" }}
                        />
                        <span className={styles.confirmItemName}>
                          {item.title}
                          {item.size && ` (${item.size})`}
                          {item.quantity > 1 && ` × ${item.quantity}`}
                        </span>
                        <span className={styles.confirmItemPrice}>
                          {formatUsd(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button className={styles.btnBack} onClick={() => setStep(2)}>← Quay lại</button>
                  <button
                    className={styles.btnConfirm}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : "🛒 Đặt hàng ngay"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary Sidebar */}
          <aside className={styles.summary}>
            <h3 className={styles.summaryTitle}>Đơn hàng của bạn</h3>
            <div className={styles.summaryItems}>
              {items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={52}
                    height={65}
                    className={styles.summaryItemImg}
                    style={{ objectFit: "cover" }}
                  />
                  <div className={styles.summaryItemInfo}>
                    <div className={styles.summaryItemName}>{item.title}</div>
                    <div className={styles.summaryItemMeta}>
                      {item.size && `Cỡ ${item.size} · `}Số lượng: {item.quantity}
                    </div>
                  </div>
                  <span className={styles.summaryItemPrice}>
                    {formatUsd(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <hr className={styles.summaryDivider} />
            <div className={styles.summaryRow}>
              <span>Tạm tính</span>
              <span>{formatUsd(totalPrice)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Phí vận chuyển</span>
              <span style={{ color: "var(--color-success)", fontWeight: 600 }}>Miễn phí</span>
            </div>
            <div className={styles.summaryTotal}>
              <span className={styles.totalLabel}>Tổng cộng</span>
              <span className={styles.totalValue}>{formatUsd(totalPrice)}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
