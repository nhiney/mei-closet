"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./FilterBar.module.css";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const CATEGORIES = [
    { id: "all", label: t("nav.all") || "All Inspiration" },
    { id: "vintage", label: t("nav.vintage") },
    { id: "streetwear", label: t("nav.streetwear") },
    { id: "knitwear", label: t("nav.knit") },
    { id: "colourful", label: t("nav.colourful") },
  ];

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "all") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      }
      return newParams.toString();
    },
    [searchParams]
  );

  const updateFilters = (params: Record<string, string | null>) => {
    const qs = createQueryString(params);
    router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const currentCategory = searchParams.get("category") || "all";

  return (
    <div className={styles.filterBar}>
      <div className={styles.container}>
        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.navLink} ${
                currentCategory === cat.id ? styles.active : ""
              }`}
              onClick={() => updateFilters({ category: cat.id })}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
