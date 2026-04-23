export type ApiResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  size: string;
  condition: string;
  isKnitwear?: boolean;
  knitType?: string | null;
  handmade?: boolean;
  ownerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiProductsListResponse = {
  data: ApiProduct[];
  meta: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiFailureBody = {
  success: false;
  message: string;
};

export type CreateProductRequest = {
  title: string;
  price: number;
  condition: "new" | "like_new" | "good" | "fair";
  category: "shirt" | "pants" | "shoes" | "jacket" | "knitwear" | "others";
  size: string;
  description?: string;
  images: string[];
  status?: "available" | "sold";
  isKnitwear?: boolean;
  knitType?: "scarf" | "sweater" | "hat" | "custom" | null;
  handmade?: boolean;
};
