export type FeedProduct = {
  id: string;
  title: string;
  price: number;
  condition: "new" | "like_new" | "good" | "fair";
  status: "available" | "sold";
  imageUrl: string;
  isKnitwear?: boolean;
  knitType?: "scarf" | "sweater" | "hat" | "custom" | null;
  handmade?: boolean;
  size?: string;
};
