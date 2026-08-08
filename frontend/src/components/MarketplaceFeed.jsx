import React, { useState } from "react";
import { Search, Filter, Store, Sparkles, PlusCircle } from "lucide-react";
import ProductCard from "./ProductCard";

export default function MarketplaceFeed({ products, categories, activeCategory, setActiveCategory, onGoToCreate }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    // Filter by Category
    const matchesCategory =
      !activeCategory ||
      (typeof product.category === "object"
        ? product.category?._id === activeCategory
        : product.category === activeCategory);

    // Filter by Search Query
    const matchesSearch =
      !searchQuery.trim() ||
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Search & Filter Header */}
      <div className="glass-panel bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Store className="w-6 h-6 text-indigo-400" />
              <span>Explore Marketplace</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Browse products posted live on Circle Marketplace
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, keywords or attributes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
              activeCategory === null
                ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            All Categories ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter(
              (p) => (typeof p.category === "object" ? p.category?._id : p.category) === cat._id
            ).length;

            return (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === cat._id
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                    : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <span>{cat.name}</span>
                <span className="px-1.5 py-0.2 text-[10px] bg-slate-800/80 rounded-md">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid List */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-200">No Listings Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchQuery || activeCategory
                ? "No products match your current search criteria or category filter."
                : "There are currently no products in the database. Be the first to create one!"}
            </p>
          </div>
          <button
            onClick={onGoToCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post First Listing</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
