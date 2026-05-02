"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { FeedSkeleton } from "@/components/FeedSkeleton";
import { FeedSection } from "@/features/feed/FeedSection";
import { FilterBar } from "@/components/FilterBar";
import { BrandStory } from "@/components/BrandStory";
import { NewArrivalSection } from "@/components/NewArrivalSection";
import { useLanguage } from "@/context/LanguageContext";

const BANNER_IMAGES = [
  "/banner/img1.jpg", "/banner/img2.jpg", "/banner/img3.jpg",
  "/banner/img4.jpg", "/banner/img5.jpg", "/banner/img6.jpg",
  "/banner/img7.jpg", "/banner/img8.jpg", "/banner/img9.png",
  "/banner/img10.jpg", "/banner/img11.jpg", "/banner/img12.jpg",
  "/banner/img13.jpg", "/banner/img14.jpg", "/banner/img15.jpg",
  "/banner/img16.jpg", "/banner/img17.jpg", "/banner/img18.jpg",
  "/banner/img19.jpg", "/banner/img20.jpg"
];

export function KnitStudioClient() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Slider - Styled like Home Page */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          {BANNER_IMAGES.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt="Knit Studio Background"
                fill
                priority={index === 0}
                className="object-cover contrast-[0.9] saturate-[0.9]"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        <div className="relative z-20 text-center text-white px-6">
          <span className="text-sm uppercase tracking-[0.4em] font-medium mb-4 block">Handmade Artisan Studio</span>
          <h1 className="text-6xl md:text-8xl font-serif mb-6 leading-tight">
            Knit <span className="italic font-light">Studio</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl font-light opacity-90 italic handwritten">
            "Every stitch is a story, every thread is a memory. Explore our handcrafted collection."
          </p>
        </div>
      </section>

      {/* Components exactly like Home Page */}
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>
      
      <main>
        {/* Main Product Section - Handles Knitwear Arrivals */}
        <NewArrivalSection params={{ isKnitwear: true }} />

        {/* Brand Narrative */}
        <BrandStory />
      </main>
    </div>
  );
}
