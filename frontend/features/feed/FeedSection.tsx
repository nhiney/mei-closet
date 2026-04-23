import { ProductGrid } from "@/components/ProductGrid";
import { FeedError } from "@/components/FeedError";
import { fetchProductsList, type ListProductsParams } from "@/lib/api/products";
import { mapApiProductsToFeed } from "./mapApiProductToFeed";

type FeedSectionProps = { 
  params?: ListProductsParams;
  masonry?: boolean;
};

export async function FeedSection({ params = {}, masonry }: FeedSectionProps) {
  try {
    const fetchParams: ListProductsParams = {
      limit: 24,
      sort: "createdAt_desc",
      ...params,
    };
    
    // Normalize categories/styles for the backend
    const styleCategories = ["vintage", "streetwear", "colourful"];
    if (fetchParams.category && styleCategories.includes(fetchParams.category as string)) {
      fetchParams.search = fetchParams.category as string;
      fetchParams.category = undefined;
    }

    // Handle knitwear specifically as it has a dedicated boolean field
    if (fetchParams.category === ("knitwear" as any)) {
      fetchParams.isKnitwear = true;
      fetchParams.category = undefined;
    }

    const { data } = await fetchProductsList(fetchParams);
    const products = mapApiProductsToFeed(data);
    
    return <ProductGrid products={products} masonry={masonry} />;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not load listings.";
    return <FeedError message={message} />;
  }
}
