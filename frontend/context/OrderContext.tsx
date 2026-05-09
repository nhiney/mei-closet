"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem } from "./CartContext";
import { loadSession } from "@/lib/auth/session";
import { apiCreateOrder, apiListOrders, apiGetOrder, apiCancelOrder } from "@/lib/api/orders";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShippingInfo = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
};

export type PaymentMethod = "cod" | "bank_transfer" | "momo";

export type OrderStatus =
  | "pending"       // Chờ xác nhận
  | "confirmed"     // Đã xác nhận
  | "shipping"      // Đang giao
  | "delivered"     // Đã giao
  | "cancelled";    // Đã hủy

export type OrderItem = CartItem;

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  note?: string;
};

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  createOrder: (
    items: OrderItem[],
    shippingInfo: ShippingInfo,
    paymentMethod: PaymentMethod
  ) => Promise<Order>;
  getOrderById: (id: string) => Promise<Order | undefined>;
  cancelOrder: (id: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const ORDERS_KEY = "mei-closet-orders";

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const fetchOrders = useCallback(async () => {
    const session = loadSession();
    if (session) {
      try {
        setLoading(true);
        const apiOrders = await apiListOrders(session.accessToken);
        // Map backend Order to frontend Order
        const mapped: Order[] = apiOrders.map(o => ({
          id: o._id,
          createdAt: o.createdAt,
          status: o.status as OrderStatus,
          items: o.items.map(i => ({
            id: i.productId,
            productId: i.productId,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            imageUrl: i.imageUrl
          })),
          shippingInfo: o.shippingInfo,
          paymentMethod: o.paymentMethod as PaymentMethod,
          totalPrice: o.totalPrice
        }));
        setOrders(mapped);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    } else {
      // Fallback to local storage for guests
      try {
        const saved = localStorage.getItem(ORDERS_KEY);
        if (saved) setOrders(JSON.parse(saved));
      } catch { /* ignore */ }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders().then(() => setHydrated(true));
  }, [fetchOrders]);

  useEffect(() => {
    if (hydrated && !loadSession()) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  }, [orders, hydrated]);

  const createOrder = useCallback(
    async (items: OrderItem[], shippingInfo: ShippingInfo, paymentMethod: PaymentMethod): Promise<Order> => {
      const session = loadSession();
      if (session) {
        const apiOrder = await apiCreateOrder(session.accessToken, {
          items: items.map(i => ({
            productId: i.id,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            imageUrl: i.imageUrl
          })),
          shippingInfo,
          paymentMethod
        });
        
        const newOrder: Order = {
          id: apiOrder._id,
          createdAt: apiOrder.createdAt,
          status: apiOrder.status as OrderStatus,
          items,
          shippingInfo,
          paymentMethod,
          totalPrice: apiOrder.totalPrice,
        };
        setOrders((prev) => [newOrder, ...prev]);
        return newOrder;
      } else {
        // Guest order (local only)
        const newOrder: Order = {
          id: `MEI-GUEST-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: "pending",
          items,
          shippingInfo,
          paymentMethod,
          totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        };
        setOrders((prev) => [newOrder, ...prev]);
        return newOrder;
      }
    },
    []
  );

  const getOrderById = useCallback(
    async (id: string) => {
      // Check local state first
      const local = orders.find((o) => o.id === id);
      if (local) return local;

      const session = loadSession();
      if (session && !id.startsWith("MEI-GUEST")) {
        try {
          const o = await apiGetOrder(session.accessToken, id);
          return {
            id: o._id,
            createdAt: o.createdAt,
            status: o.status as OrderStatus,
            items: o.items.map(i => ({
              id: i.productId,
              productId: i.productId,
              title: i.title,
              price: i.price,
              quantity: i.quantity,
              size: i.size,
              imageUrl: i.imageUrl
            })),
            shippingInfo: o.shippingInfo,
            paymentMethod: o.paymentMethod as PaymentMethod,
            totalPrice: o.totalPrice
          };
        } catch (err) {
          console.error("Failed to fetch order details:", err);
        }
      }
      return undefined;
    },
    [orders]
  );

  const cancelOrder = useCallback(async (id: string) => {
    const session = loadSession();
    if (session && !id.startsWith("MEI-GUEST")) {
      await apiCancelOrder(session.accessToken, id);
    }
    
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o))
    );
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, createOrder, getOrderById, cancelOrder, refreshOrders: fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within an OrderProvider");
  return ctx;
}
