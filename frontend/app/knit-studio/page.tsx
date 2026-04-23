import { Suspense } from "react";
import Image from "next/image";
import { FeedSkeleton } from "@/components/FeedSkeleton";
import { FeedSection } from "@/features/feed/FeedSection";

export const metadata = {
  title: "🧶 Knit Studio - Handmade Knitwear - Mei Closet",
  description: "Explore our collection of handcrafted wool treasures, where every stitch is made with love.",
};

export default function KnitStudioPage() {
  return (
    <div className="bg-[#FCF9F5] min-h-screen font-serif">
      {/* Artistic Hero Section */}
      <section className="relative w-full overflow-hidden bg-white border-b border-[#E8E1D5]">
        <div className="mx-auto flex flex-col md:flex-row items-center min-h-[60vh]">
          {/* Left Side: Content */}
          <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center items-start gap-8">
            <div className="flex items-center gap-3">
              <span className="w-12 h-px bg-[#8A9A5B]" />
              <span className="text-[#8A9A5B] font-sans text-xs font-bold uppercase tracking-widest">Handmade Artisan Studio</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[#2B2B2B] leading-[0.9]">
              The Knit <br />
              <span className="text-[#8B6F5C] italic font-normal">Studio</span>
            </h1>
            
            <p className="max-w-md text-lg text-[#5C5C5C] leading-relaxed handwritten">
              "We believe in the beauty of the slow process. Each piece in our collection is hand-knitted using the finest natural fibers, designed to bring warmth to your home and heart."
            </p>

            <div className="mt-4 flex gap-4 text-xs font-sans font-medium text-[#8B6F5C]">
              <span className="px-3 py-1 border border-[#D1C4B0] rounded-full">100% Organic Wool</span>
              <span className="px-3 py-1 border border-[#D1C4B0] rounded-full">Ethically Made</span>
              <span className="px-3 py-1 border border-[#D1C4B0] rounded-full">One-of-a-kind</span>
            </div>
          </div>

          {/* Right Side: Visual */}
          <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden">
            <Image
              src="/knit-studio-header.png"
              alt="Handmade knitwear on a wooden table"
              fill
              className="object-cover"
              priority
            />
            {/* Artistic Overlay */}
            <div className="absolute inset-0 bg-[#8B6F5C]/5" />
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <main className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-4xl font-bold text-[#2B2B2B] mb-4">Artisan Collection</h2>
            <p className="text-[#8B6F5C] font-sans text-sm tracking-wide">BROWSE OUR LATEST HAND-STITCHED CREATIONS</p>
          </div>
          <div className="h-px flex-1 bg-[#E8E1D5] mx-8 hidden md:block" />
          <div className="text-right">
            <span className="text-6xl font-light text-[#E8E1D5]/60 italic select-none">2026</span>
          </div>
        </div>

        <div className="relative">
          {/* Decorative Background Elements */}
          <div className="absolute -left-12 top-0 bottom-0 w-px bg-dashed border-l border-dashed border-[#D1C4B0] hidden xl:block" />
          
          <div className="bg-white/40 backdrop-blur-sm border border-[#E8E1D5] p-8 md:p-16 shadow-sm rounded-2xl">
            <Suspense fallback={<FeedSkeleton />}>
              <FeedSection params={{ isKnitwear: true }} masonry />
            </Suspense>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-32 text-center">
          <div className="inline-block p-12 border-t border-b border-[#E8E1D5]">
            <p className="text-2xl italic text-[#8B6F5C]">"Slow fashion is not just a trend, it's a commitment to quality."</p>
          </div>
        </div>
      </main>
    </div>
  );
}
