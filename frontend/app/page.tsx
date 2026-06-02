import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { FilterBar } from "@/components/product/FilterBar";
import { PuzzleGame } from "@/components/games/PuzzleGame";
import { StyleForecast } from "@/components/ai/StyleForecast";
import { AIAssistantHero } from "@/components/ai/AIAssistantHero";
import { NewArrivalSection } from "@/components/sections/NewArrivalSection";
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

  return (
    <div className="bg-background min-h-screen">
      <Hero />
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>
      <main>
        <NewArrivalSection params={fetchParams} />
        <StyleForecast />
        <PuzzleGame />
        <AIAssistantHero />
      </main>
    </div>
  );
}
