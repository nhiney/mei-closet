"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "vi" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "vi" || savedLang === "en")) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // Translation helper function
  const t = (path: string) => {
    const keys = path.split(".");
    let current: any = translations[language];
    
    for (const key of keys) {
      if (current[key] === undefined) return path;
      current = current[key];
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Inline translations for now to avoid additional file overhead during setup
const translations: Record<Language, any> = {
  vi: {
    nav: {
      home: "Trang chủ",
      info: "Thông tin",
      contact: "Liên hệ",
      knit: "Shop len",
      clothing: "Quần áo",
      accessories: "Phụ kiện",
      
      // Subcategories
      shirts: "Áo",
      pants: "Quần",
      skirts: "Váy",
      jackets: "Áo khoác",
      shoes: "Giày dép",
      bags: "Túi xách",
      otherAcc: "Phụ kiện khác",
      
      about: "VỀ CHÚNG TÔI",

      // Legacy style tags (used in FilterBar)
      all: "TẤT CẢ",
      vintage: "VINTAGE",
      streetwear: "STREETWEAR",
      colourful: "COLOURFUL",
    },
    hero: {
      subtitle: "Hoài Niệm Được Tuyển Chọn",
      description: "Thời trang secondhand & những câu chuyện đan móc thủ công",
      explore: "Khám Phá Cửa Hàng",
      knitStudio: "Tiệm Đồ Thủ Công"
    },
    about: {
      story: "🧵 Câu Chuyện",
      description1: "Mei Closet là một tiệm thời trang secondhand tuyển chọn ra đời từ tình yêu với phong cách vượt thời gian và cam kết với hành tinh xanh.",
      description2: "Chúng tôi tin rằng thời trang không nên là thứ dùng một lần; nó nên là vật gia bảo. Mỗi món đồ trong bộ sưu tập đều được lựa chọn kỹ lưỡng vì cá tính riêng và chất lượng.",
      description3: "Bằng cách chọn đồ cũ, bạn không chỉ tìm thấy một món đồ độc nhất—bạn đang tham gia vào vòng tuần hoàn thời trang bền vững. Mỗi món đồ đều xứng đáng có cuộc đời thứ hai.",
      crafted: "Đan Móc Với Tình Yêu",
      studioDesc: "Khám phá những món đồ đan móc thủ công, chậm rãi trong không gian studio riêng của chúng tôi.",
      quote: "“Mọi món đồ đều xứng đáng có cuộc đời thứ hai.”"
    },
    philosophy: {
      eyebrow: "TRIẾT LÝ CỦA CHÚNG TÔI",
      heading: "Nuôi Dưỡng Tủ Đồ Của Những Kỷ Niệm",
      p1: "Tại Mei Closet, chúng tôi tin rằng thời trang nên là một cuộc khám phá chậm rãi, có chủ đích. Bộ sưu tập của chúng tôi là cuộc đối thoại giữa quá khứ và hiện tại.",
      p2: "Bền vững không chỉ là mục tiêu; đó là nền tảng của chúng tôi. Bằng cách thổi sức sống mới vào những món đồ vintage, chúng tôi đang xây dựng một tương lai nơi mọi trang phục đều được trân trọng."
    },
    artisan: {
      tag: "TUYỂN CHỌN THỦ CÔNG",
      title: "Đồ Đan Thủ Công Bởi Mei Studio",
      desc: "Mỗi mũi kim là một câu chuyện. Bộ sưu tập đan móc của chúng tôi được chế tác chậm rãi, sử dụng sợi bền vững và kỹ thuật truyền thống.",
      explore: "Khám Phá Xưởng Đồ 🧶"
    },
    home: {
      discovery: "Xu Hướng Mới",
      editorsPicks: "Lựa Chọn Của Biên Tập Viên",
      picksDesc: "Những báu vật được tuyển chọn với câu chuyện vượt thời gian.",
      exploreMore: "Khám Phá Thêm",
      newArrival: "Hàng Mới Về"
    },
    filter: {
      size: "KÍCH THƯỚC",
      sortAZ: "Tên: A-Z",
      sortZA: "Tên: Z-A",
      sortPriceLow: "Giá: Thấp đến Cao",
      sortPriceHigh: "Giá: Cao đến Thấp"
    },
    product: {
      newDrop: "NEW DROP",
      soldOut: "Hết hàng",
      addToCart: "THÊM VÀO GIỎ",
      condition: "Tình trạng",
      quantity: "Số lượng",
      buyNow: "MUA NGAY",
      backToShop: "Quay lại cửa hàng",
      noDesc: "Chưa có mô tả cho sản phẩm này.",
      category: "Danh mục",
      care: "Bảo quản",
      careInstructions: "Giặt tay, phơi mát",
      guarantee: "Được tuyển chọn & xác nhận bởi Mei Closet",
      sizeGuide: "Bảng Size",
      chest: "Ngực",
      waist: "Eo",
      length: "Dài",
      reviews: "Đánh Giá",
      related: "Sản Phẩm Liên Quan",
      viewDetail: "Xem chi tiết"
    },
    cart: {
      title: "Giỏ Hàng",
      empty: "Giỏ hàng trống",
      emptyDesc: "Khám phá cửa hàng để tìm món đồ yêu thích!",
      continueShopping: "Tiếp Tục Mua Sắm",
      itemCount: "sản phẩm",
      subtotal: "Tạm tính",
      shipping: "Vận chuyển",
      shippingFree: "Miễn phí",
      total: "Tổng cộng",
      checkout: "THANH TOÁN",
      clear: "XÓA TẤT CẢ",
      added: "Đã thêm"
    },
    footer: {
      about: "Về Chúng Tôi",
      aboutDesc: "Mei Closet — Tiệm thời trang secondhand tuyển chọn và đồ len handmade.",
      quickLinks: "Liên Kết",
      shop: "Cửa hàng",
      knitStudio: "Shop Len",
      wishlist: "Yêu thích",
      contact: "Liên Hệ",
      email: "hello@meicloset.vn",
      phone: "0909 123 456",
      address: "TP. Hồ Chí Minh, Việt Nam",
      hours: "T2-T7: 9:00 - 21:00",
      followUs: "Theo dõi",
      copyright: "Mọi quyền được bảo lưu.",
      tagline: "Mỗi món đồ secondhand đều xứng đáng có cuộc đời thứ hai."
    }
  },
  en: {
    nav: {
      home: "Home",
      info: "Info",
      contact: "Contact",
      knit: "Knit Shop",
      clothing: "Clothing",
      accessories: "Accessories",
      
      // Subcategories
      shirts: "Shirts",
      pants: "Pants",
      skirts: "Skirts",
      jackets: "Jackets",
      shoes: "Shoes",
      bags: "Bags",
      otherAcc: "Other Accessories",
      
      about: "ABOUT",

      // Legacy style tags (used in FilterBar)
      all: "ALL",
      vintage: "VINTAGE",
      streetwear: "STREETWEAR",
      colourful: "COLOURFUL",
    },
    hero: {
      subtitle: "Curated Nostalgia",
      description: "Second-hand fashion & handmade knitwear stories",
      explore: "Explore Shop",
      knitStudio: "Knit Studio"
    },
    about: {
      story: "🧵 Our Story",
      description1: "Mei Closet is a curated second-hand fashion marketplace born from a love for timeless style and a commitment to our planet.",
      description2: "We believe that fashion shouldn't be disposable; it should be an heirloom. Every item in our collection is handpicked for its unique character and quality.",
      description3: "By choosing pre-loved, you're not just finding a unique piece—you're participating in a sustainable fashion loop.",
      crafted: "Crafted with Love",
      studioDesc: "Explore handmade, slow-fashion knitwear pieces in our dedicated studio space.",
      quote: "“Every piece deserves a second life.”"
    },
    philosophy: {
      eyebrow: "OUR PHILOSOPHY",
      heading: "Cultivating a Wardrobe of Memories",
      p1: "At Mei Closet, we believe that fashion should be a slow, intentional discovery. Our collection is a dialogue between the past and the present.",
      p2: "Sustainability isn't just a goal; it's our foundation. By breathing new life into vintage pieces, we're building a future where every garment is cherished."
    },
    artisan: {
      tag: "ARTISAN SELECTION",
      title: "Handmade Knitwear by Mei Studio",
      desc: "Every stitch is a story. Our knitwear collection is crafted slowly, using sustainable fibers and traditional techniques.",
      explore: "Explore the Atelier 🧶"
    },
    home: {
      discovery: "Discover Trends",
      editorsPicks: "Editor's Picks",
      picksDesc: "Handpicked treasures with timeless stories.",
      exploreMore: "Explore More",
      newArrival: "New Arrival"
    },
    filter: {
      size: "SIZE",
      sortAZ: "Name: A-Z",
      sortZA: "Name: Z-A",
      sortPriceLow: "Price: Low to High",
      sortPriceHigh: "Price: High to Low"
    },
    product: {
      newDrop: "NEW DROP",
      soldOut: "Out of stock",
      addToCart: "ADD TO CART",
      condition: "Condition",
      quantity: "Quantity",
      buyNow: "BUY NOW",
      backToShop: "Back to shop",
      noDesc: "No description available for this item.",
      category: "Category",
      care: "Care",
      careInstructions: "Hand wash, dry flat",
      guarantee: "Handpicked & Authenticated by Mei Closet",
      sizeGuide: "Size Guide",
      chest: "Chest",
      waist: "Waist",
      length: "Length",
      reviews: "Reviews",
      related: "Related Products",
      viewDetail: "View details"
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      emptyDesc: "Explore the shop to find something you love!",
      continueShopping: "Continue Shopping",
      itemCount: "items",
      subtotal: "Subtotal",
      shipping: "Shipping",
      shippingFree: "Free",
      total: "Total",
      checkout: "CHECKOUT",
      clear: "CLEAR ALL",
      added: "Added"
    },
    footer: {
      about: "About Us",
      aboutDesc: "Mei Closet — A curated second-hand fashion marketplace and handmade knitwear studio.",
      quickLinks: "Quick Links",
      shop: "Shop",
      knitStudio: "Knit Shop",
      wishlist: "Wishlist",
      contact: "Contact",
      email: "hello@meicloset.vn",
      phone: "0909 123 456",
      address: "Ho Chi Minh City, Vietnam",
      hours: "Mon-Sat: 9:00 AM - 9:00 PM",
      followUs: "Follow Us",
      copyright: "All rights reserved.",
      tagline: "Every second-hand gem deserves a second life."
    }
  }
};
