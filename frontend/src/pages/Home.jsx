import React, { useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import FeaturedCategories from "../components/FeaturedCategories";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { getProducts } from "../services/productService";
import { Sparkles, Flame, Clock, ArrowRight, Loader2, Package } from "lucide-react";

// Fallback seed products if database is completely empty on initial setup
const FALLBACK_PRODUCTS = [
  {
    _id: "p1",
    title: "Apple MacBook Pro 16'' M3 Max (36GB RAM, 1TB SSD) - Space Black",
    price: 189999,
    category: { name: "Electronics" },
    location: "Mumbai, MH",
    postedTime: "10 mins ago",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"],
    verifiedSeller: true,
    badge: "Just In"
  },
  {
    _id: "p2",
    title: "2023 Tesla Model 3 Long Range AWD - Clean Title, Low Miles",
    price: 2500000,
    category: { name: "Vehicles" },
    location: "Bengaluru, KA",
    postedTime: "35 mins ago",
    images: ["https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80"],
    verifiedSeller: true,
    badge: "Hot Price"
  },
  {
    _id: "p3",
    title: "Modern Minimalist Italian Leather Sectional Sofa (Cream White)",
    price: 45000,
    category: { name: "Home & Furniture" },
    location: "Delhi, DL",
    postedTime: "1 hour ago",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80"],
    verifiedSeller: false
  },
  {
    _id: "p4",
    title: "Sony PlayStation 5 Slim Digital Edition + 2 DualSense Controllers",
    price: 39999,
    category: { name: "Electronics" },
    location: "Hyderabad, TS",
    postedTime: "2 hours ago",
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80"],
    verifiedSeller: true
  }
];

export default function Home({ onNavigateCreate, onOpenDetails, onNavigateCategories }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getProducts();
      const apiData = response.data?.data || response.data || [];
      if (Array.isArray(apiData) && apiData.length > 0) {
        setProducts(apiData);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch (err) {
      console.error("Error fetching products from backend:", err);
      setError("Note: Displaying featured items catalog.");
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format product data for ProductCard
  const formatProductForCard = (prod) => ({
    ...prod,
    id: prod._id || prod.id,
    title: prod.title,
    price: prod.price,
    category: typeof prod.category === "object" ? prod.category?.name : (prod.category || "General"),
    location: prod.location || "Mumbai, MH",
    postedTime: prod.createdAt ? new Date(prod.createdAt).toLocaleDateString() : (prod.postedTime || "Just now"),
    image: (prod.images && prod.images.length > 0) ? prod.images[0] : (prod.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80")
  });

  const recentProducts = products.slice(0, 4);
  const popularProducts = products.length > 4 ? products.slice(4, 8) : products;

  return (
    <div className="space-y-12">
      
      {/* 1. Hero Banner with Multi-Filter Search */}
      <HeroBanner />

      {/* 2. Featured Categories Section */}
      <FeaturedCategories 
        onSelectCategory={() => onNavigateCategories && onNavigateCategories()}
        onBrowseAll={() => onNavigateCategories && onNavigateCategories()}
      />

      {/* 3. Recently Added Products Section (Fetched from GET /api/products) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-blue-100 text-blue-600">
                <Clock className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Latest Listings
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Recently Added Products
            </h2>
          </div>
          <button 
            onClick={() => onNavigateCreate && onNavigateCreate()}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
          >
            <span>+ Sell An Item</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid or Loading State */}
        {isLoading ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading live products...</p>
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center space-y-3 p-8">
            <Package className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Products Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Be the first seller to post a product listing!</p>
            <button
              onClick={onNavigateCreate}
              className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Post First Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((prod) => {
              const formatted = formatProductForCard(prod);
              return (
                <ProductCard 
                  key={formatted.id} 
                  product={formatted} 
                  onClick={() => onOpenDetails && onOpenDetails(formatted)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Sell CTA Interstitial Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-blue-600/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/20 text-white rounded-full inline-block">
              Zero Listing Fees
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Got Items to Sell? Turn Unused Stuff into Cash.
            </h3>
            <p className="text-sm text-blue-100">
              List your item on Circle Marketplace in under 60 seconds. Connect with verified buyers in your neighborhood.
            </p>
          </div>

          <button
            onClick={onNavigateCreate}
            className="px-8 py-4 bg-white hover:bg-slate-100 text-blue-700 font-extrabold text-sm rounded-2xl shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          >
            Post Free Listing Now
          </button>
        </div>
      </section>

      {/* 5. Popular Listings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-rose-100 text-rose-600">
                <Flame className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                High Demand
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Listings Nearby
            </h2>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((prod) => {
            const formatted = formatProductForCard(prod);
            return (
              <ProductCard 
                key={formatted.id} 
                product={formatted} 
                onClick={() => onOpenDetails && onOpenDetails(formatted)}
              />
            );
          })}
        </div>
      </section>

      {/* 6. Footer */}
      <Footer />

    </div>
  );
}
