import React, { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { 
  Smartphone, 
  Laptop, 
  Car, 
  Shirt, 
  Armchair, 
  Tv, 
  Layers, 
  ArrowRight,
  Loader2 
} from "lucide-react";

// Category icon & style mapping helper
const getCategoryIconAndColor = (name) => {
  const lower = (name || "").toLowerCase();
  if (lower.includes("mobile") || lower.includes("phone")) {
    return { icon: Smartphone, color: "bg-blue-50 text-blue-600 border-blue-200" };
  }
  if (lower.includes("laptop") || lower.includes("computer")) {
    return { icon: Laptop, color: "bg-indigo-50 text-indigo-600 border-indigo-200" };
  }
  if (lower.includes("vehicle") || lower.includes("car") || lower.includes("auto")) {
    return { icon: Car, color: "bg-amber-50 text-amber-600 border-amber-200" };
  }
  if (lower.includes("fashion") || lower.includes("clothing") || lower.includes("apparel")) {
    return { icon: Shirt, color: "bg-pink-50 text-pink-600 border-pink-200" };
  }
  if (lower.includes("home") || lower.includes("furniture")) {
    return { icon: Armchair, color: "bg-emerald-50 text-emerald-600 border-emerald-200" };
  }
  if (lower.includes("electronic") || lower.includes("tech") || lower.includes("gadget")) {
    return { icon: Tv, color: "bg-purple-50 text-purple-600 border-purple-200" };
  }
  return { icon: Layers, color: "bg-slate-50 text-slate-600 border-slate-200" };
};

const FALLBACK_CATEGORIES = [
  {
    _id: "c1",
    name: "Mobile Phones",
    fields: [1, 2, 3]
  },
  {
    _id: "c2",
    name: "Laptops",
    fields: [1, 2, 3, 4, 5]
  },
  {
    _id: "c3",
    name: "Vehicles",
    fields: [1, 2, 3, 4, 5]
  },
  {
    _id: "c4",
    name: "Fashion",
    fields: [1, 2, 3, 4]
  },
  {
    _id: "c5",
    name: "Home & Furniture",
    fields: [1, 2, 3, 4]
  },
  {
    _id: "c6",
    name: "Electronics",
    fields: [1, 2, 3, 4]
  }
];

export default function FeaturedCategories({ onSelectCategory, onBrowseAll }) {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const catList = res.data?.data || res.data || [];
      if (Array.isArray(catList) && catList.length > 0) {
        setCategories(catList);
      } else {
        setCategories(FALLBACK_CATEGORIES);
      }
    } catch (err) {
      console.warn("Failed to fetch featured categories:", err);
      setCategories(FALLBACK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Explore Collection
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Featured Categories
          </h2>
        </div>
        <button 
          onClick={() => onBrowseAll && onBrowseAll()}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
        >
          <span>Browse All Categories</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Categories Grid */}
      {loading ? (
        <div className="py-8 text-center flex items-center justify-center gap-2 text-xs text-slate-500 font-semibold">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <span>Fetching dynamic categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
          No active categories configured in backend database.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const { icon: Icon, color } = getCategoryIconAndColor(cat.name);
            const fieldCount = cat.fields ? cat.fields.length : 0;
            return (
              <div
                key={cat._id || cat.name}
                onClick={() => onSelectCategory && onSelectCategory(cat)}
                className="group bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center space-y-2.5"
              >
                <div className={`p-3 rounded-2xl border ${color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                    {fieldCount} custom field{fieldCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
