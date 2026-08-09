import React, { useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import FeaturedCategories from "../components/FeaturedCategories";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { Sparkles, Flame, Clock, ArrowRight, Loader2, Package, X, Filter } from "lucide-react";

export default function Home({ selectedCategory, setSelectedCategory, onNavigateCreate, onOpenDetails, onNavigateCategories }) {
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
      if (Array.isArray(apiData)) {
        setProducts(apiData);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products from backend:", err);
      setError("Failed to load products. Please check your connection.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Category Filtering Logic
  const filteredProducts = products.filter((prod) => {
    if (!selectedCategory || selectedCategory === "all") return true;
    const catId = typeof selectedCategory === "object" ? selectedCategory._id : selectedCategory;
    const catName = typeof selectedCategory === "object" ? selectedCategory.name : selectedCategory;

    const prodCatId = typeof prod.category === "object" ? prod.category?._id : prod.category;
    const prodCatName = typeof prod.category === "object" ? prod.category?.name : prod.category;

    if (prodCatId && catId && String(prodCatId) === String(catId)) return true;
    if (prodCatName && catName && String(prodCatName).toLowerCase() === String(catName).toLowerCase()) return true;
    if (prodCatName && typeof selectedCategory === "string" && String(prodCatName).toLowerCase().includes(selectedCategory.toLowerCase())) return true;
    return false;
  });

  const activeCategoryName = selectedCategory 
    ? (typeof selectedCategory === "object" ? selectedCategory.name : selectedCategory)
    : null;

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

  const recentProducts = filteredProducts.slice(0, 8);
  const popularProducts = filteredProducts.length > 4 ? filteredProducts.slice(4, 12) : filteredProducts;

  return (
    <div className="space-y-12">
      
      {/* 1. Hero Banner with Search */}
      <HeroBanner 
        onSearch={({ category }) => {
          if (category && category !== "all") {
            setSelectedCategory && setSelectedCategory(category);
          }
        }}
      />

      {/* 2. Featured Categories Section */}
      <FeaturedCategories 
        onSelectCategory={(cat) => setSelectedCategory && setSelectedCategory(cat)}
        onBrowseAll={() => onNavigateCategories && onNavigateCategories()}
      />

      {/* 3. Filtered Products Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Active Category Filter Notification Banner */}
        {activeCategoryName && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-between gap-3 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Showing product listings in <strong>"{activeCategoryName}"</strong></span>
              <span className="text-blue-600 font-mono font-bold">({filteredProducts.length} items)</span>
            </div>
            <button
              onClick={() => setSelectedCategory && setSelectedCategory(null)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-200 shadow-sm transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Category Filter</span>
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-blue-100 text-blue-600">
                <Clock className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {activeCategoryName ? `${activeCategoryName} Products` : "Latest Marketplace Listings"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {activeCategoryName ? `Available Items in ${activeCategoryName}` : "Recently Added Products"}
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

        {/* Product Cards Grid or Loading/Empty State */}
        {isLoading ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading live products...</p>
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center space-y-3 p-8">
            <Package className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              {activeCategoryName ? `No Products Listed in "${activeCategoryName}"` : "No Products Found"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeCategoryName 
                ? `Be the first seller to list an item in ${activeCategoryName}!`
                : "Be the first seller to post a product listing!"}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              {activeCategoryName && (
                <button
                  onClick={() => setSelectedCategory && setSelectedCategory(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  View All Categories
                </button>
              )}
              <button
                onClick={onNavigateCreate}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Post First Listing
              </button>
            </div>
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
      {!activeCategoryName && popularProducts.length > 0 && (
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
      )}

    </div>
  );
}
