"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchDashboardMetrics, AdminMetrics } from "@/lib/api/admin";
import { MetricCard } from "@/features/admin/components/MetricCard";
import { TopItemsList } from "@/features/admin/components/TopItemsList";

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user || user.role !== "admin") {
        router.replace("/");
        return;
      }

      fetchDashboardMetrics()
        .then((json) => setMetrics(json.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-[#F5F1E8]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 border-4 border-[#8B6F5C] border-t-transparent rounded-full animate-spin" />
          <p className="mt-6 handwritten text-2xl text-[#8B6F5C]">Preparing the Atelier...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-16 text-center bg-[#F5F1E8]">
        <h1 className="handwritten text-4xl text-[#D8A7A7]">Access Restricted</h1>
        <p className="mt-4 text-[#8B6F5C] italic font-serif">"{error || "This ledger is for authorized eyes only."}"</p>
      </div>
    );
  }

  return (
    <main className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <header className="mb-20 text-center">
          <h1 className="font-serif text-5xl font-bold tracking-tight text-[#2B2B2B] sm:text-7xl">
            The Atelier Ledger
          </h1>
          <p className="mt-6 handwritten text-2xl text-[#8B6F5C]">
            Insights into our shared pre-loved ecosystem.
          </p>
          <div className="h-px w-48 bg-[#D1C4B0] mx-auto mt-8 opacity-50" />
        </header>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 text-center">
          <div className="paper-panel bg-white p-8 border-1 border-dashed border-[#D1C4B0] shadow-[10px_10px_0_#E8DCCB] rotate-[-1deg]">
            <p className="handwritten text-xl text-[#8B6F5C] mb-2">Total Collection</p>
            <p className="font-serif text-4xl font-bold text-[#2B2B2B]">{metrics.totalProducts}</p>
            <p className="text-[0.6rem] uppercase tracking-widest text-[#D1C4B0] mt-4">Active Listings</p>
          </div>
          <div className="paper-panel bg-white p-8 border-1 border-dashed border-[#D1C4B0] shadow-[10px_10px_0_#E8DCCB] rotate-[1deg]">
            <p className="handwritten text-xl text-[#8B6F5C] mb-2">Global Reach</p>
            <p className="font-serif text-4xl font-bold text-[#2B2B2B]">{metrics.totalViews.toLocaleString()}</p>
            <p className="text-[0.6rem] uppercase tracking-widest text-[#D1C4B0] mt-4">Product Views</p>
          </div>
          <div className="paper-panel bg-white p-8 border-1 border-dashed border-[#D1C4B0] shadow-[10px_10px_0_#E8DCCB] rotate-[-2deg]">
            <p className="handwritten text-xl text-[#8B6F5C] mb-2">Correspondence</p>
            <p className="font-serif text-4xl font-bold text-[#2B2B2B]">{metrics.totalMessages}</p>
            <p className="text-[0.6rem] uppercase tracking-widest text-[#D1C4B0] mt-4">Total Letters</p>
          </div>
          <div className="paper-panel bg-white p-8 border-1 border-dashed border-[#D1C4B0] shadow-[10px_10px_0_#E8DCCB] rotate-[2deg]">
            <p className="handwritten text-xl text-[#8B6F5C] mb-2">Handcrafted</p>
            <p className="font-serif text-4xl font-bold text-[#2B2B2B]">{metrics.knitwearStats.total}</p>
            <p className="text-[0.6rem] uppercase tracking-widest text-[#D1C4B0] mt-4">{metrics.knitwearStats.views} Views recorded</p>
          </div>
        </div>

        {/* Deep Dive Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="paper-panel bg-white/70 p-10 border border-[#D1C4B0]">
            <TopItemsList 
              title="Most Coveted Items" 
              metricLabel="views"
              items={metrics.topProductsByViews.map(p => ({ id: p.id, title: p.title, metric: p.views }))}
            />
          </div>
          <div className="paper-panel bg-white/70 p-10 border border-[#D1C4B0]">
            <TopItemsList 
              title="Most Loved Treasures" 
              metricLabel="saves"
              items={metrics.topProductsByWishlist.map(p => ({ id: p.id, title: p.title, metric: p.wishlistCount }))}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
