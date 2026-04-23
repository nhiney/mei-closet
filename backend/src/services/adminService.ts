import { Product } from "../models/Product.js";
import { Message } from "../models/Message.js";
import { Wishlist } from "../models/Wishlist.js";

export type AdminMetrics = {
  totalProducts: number;
  totalMessages: number;
  totalViews: number;
  knitwearStats: {
    total: number;
    views: number;
  };
  topProductsByViews: Array<{
    id: string;
    title: string;
    views: number;
  }>;
  topProductsByWishlist: Array<{
    id: string;
    title: string;
    wishlistCount: number;
  }>;
};

export async function getDashboardMetrics(): Promise<AdminMetrics> {
  const [totalProducts, totalMessages, viewsAgg, knitwearStatsAgg, topViews, topWishlistAgg] = await Promise.all([
    Product.countDocuments(),
    Message.countDocuments(),
    
    // Total Views
    Product.aggregate<{ total: number }>([
      { $group: { _id: null, total: { $sum: "$views" } } }
    ]),

    // Knitwear stats
    Product.aggregate<{ total: number, views: number }>([
      { $match: { isKnitwear: true } },
      { $group: { _id: null, total: { $sum: 1 }, views: { $sum: "$views" } } }
    ]),

    // Top Products by Views
    Product.find({}, "title views")
      .sort({ views: -1 })
      .limit(5)
      .lean(),

    // Top Products by Wishlist
    Wishlist.aggregate<{ _id: string; wishlistCount: number; title: string }>([
      { $group: { _id: "$productId", wishlistCount: { $sum: 1 } } },
      { $sort: { wishlistCount: -1 } },
      { $limit: 5 },
      { 
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          wishlistCount: 1,
          title: "$product.title"
        }
      }
    ])
  ]);

  return {
    totalProducts,
    totalMessages,
    totalViews: viewsAgg[0]?.total ?? 0,
    knitwearStats: {
      total: knitwearStatsAgg[0]?.total ?? 0,
      views: knitwearStatsAgg[0]?.views ?? 0,
    },
    topProductsByViews: topViews.map(p => ({
      id: String(p._id),
      title: p.title,
      views: p.views || 0,
    })),
    topProductsByWishlist: topWishlistAgg.map(p => ({
      id: String(p._id),
      title: p.title,
      wishlistCount: p.wishlistCount,
    })),
  };
}
