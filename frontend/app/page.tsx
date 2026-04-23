import { Suspense } from "react";
import { FeedSkeleton } from "@/components/FeedSkeleton";
import { FeedSection } from "@/features/feed/FeedSection";
import { Hero } from "@/components/Hero";
import { FilterBar } from "@/components/FilterBar";
import { KnitStudioFeatured } from "@/components/KnitStudioFeatured";
import { BrandStory } from "@/components/BrandStory";
import { NewArrivalSection } from "@/components/NewArrivalSection";
import { DiscoveryHeading, EditorsPicksHeading, ExploreMoreHeading } from "@/components/HomeHeadings";
import type { ListProductsParams } from "@/lib/api/products";

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  
  const fetchParams: ListProductsParams = {
    search: typeof params.search === "string" ? params.search : undefined,
    category: typeof params.category === "string" ? params.category as any : undefined,
    sort: typeof params.sort === "string" ? params.sort as any : undefined,
    priceMin: params.priceMin ? Number(params.priceMin) : undefined,
    priceMax: params.priceMax ? Number(params.priceMax) : undefined,
  };

  const isFiltering = !!(fetchParams.search || fetchParams.category || fetchParams.priceMin || fetchParams.priceMax);

  return (
    <div className="bg-background min-h-screen">
      <Hero />
      <FilterBar />
      
      <main>
        {/* Main Product Section - Handles New Arrivals & Search Results */}
        <NewArrivalSection params={fetchParams} />

        {/* Featured Brand Block */}
        <KnitStudioFeatured />

        {/* Brand Narrative */}
        <BrandStory />
      </main>
    </div>
  );
}
