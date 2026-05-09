"use client";

import { useLanguage } from "@/context/LanguageContext";

/**
 * Discovery Feed Heading
 */
export function DiscoveryHeading() {
  const { t } = useLanguage();
  return (
    <div className="px-8 mb-8">
      <h2 className="font-serif text-3xl font-medium text-primary">{t("home.discovery")}</h2>
    </div>
  );
}

/**
 * Editor's Picks Heading
 */
export function EditorsPicksHeading() {
  const { t } = useLanguage();
  return (
    <div className="px-8 mb-12 text-center">
      <h2 className="font-serif text-5xl font-italic text-primary mb-4">{t("home.editorsPicks")}</h2>
      <p className="font-serif text-xl italic text-muted-foreground">{t("home.picksDesc")}</p>
    </div>
  );
}

/**
 * Explore More Heading
 */
export function ExploreMoreHeading() {
  const { t } = useLanguage();
  return (
    <div className="px-8 mb-8">
      <h2 className="font-serif text-2xl text-primary">{t("home.exploreMore")}</h2>
    </div>
  );
}
