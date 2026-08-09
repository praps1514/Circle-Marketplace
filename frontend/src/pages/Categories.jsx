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
  Loader2, 
  AlertCircle, 
  PlusCircle, 
  ArrowRight,
  CheckCircle2,
  List
} from "lucide-react";

// Icon mapping helper for backend categories
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
    fields: [
      { label: "Brand", type: "text", required: true },
      { label: "Storage", type: "select", options: ["64GB", "128GB", "256GB", "512GB", "1TB"], required: true },
      { label: "Condition", type: "select", options: ["New", "Like New", "Good", "Fair"], required: true }
    ]
  },
  {
    _id: "c2",
    name: "Laptops",
    fields: [
      { label: "Brand", type: "text", required: true },
      { label: "RAM", type: "select", options: ["8GB", "16GB", "32GB", "64GB"], required: true },
      { label: "Storage", type: "select", options: ["256GB SSD", "512GB SSD", "1TB SSD"], required: true },
      { label: "Processor", type: "text", required: false },
      { label: "Condition", type: "select", options: ["New", "Like New", "Good", "Fair"], required: true }
    ]
  },
  {
    _id: "c3",
    name: "Vehicles",
    fields: [
      { label: "Brand", type: "text", required: true },
      { label: "Model", type: "text", required: true },
      { label: "Year", type: "number", required: true },
      { label: "Fuel Type", type: "radio", options: ["Petrol", "Diesel", "Electric", "Hybrid"], required: true }
    ]
  },
  {
    _id: "c4",
    name: "Fashion",
    fields: [
      { label: "Brand", type: "text", required: false },
      { label: "Size", type: "select", options: ["S", "M", "L", "XL", "XXL"], required: true },
      { label: "Gender", type: "radio", options: ["Men", "Women", "Unisex"], required: true }
    ]
  },
  {
    _id: "c5",
    name: "Home & Furniture",
    fields: [
      { label: "Item Type", type: "text", required: true },
      { label: "Material", type: "text", required: false },
      { label: "Condition", type: "select", options: ["New", "Like New", "Good", "Fair"], required: true }
    ]
  },
  {
    _id: "c6",
    name: "Electronics",
    fields: [
      { label: "Brand", type: "text", required: true },
      { label: "Model", type: "text", required: false },
      { label: "Warranty", type: "select", options: ["None", "6 Months", "1 Year", "2 Years"], required: false }
    ]
  }
];

export default function Categories({ onNavigateCreate, onSelectCategory }) {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const catList = res.data?.data || res.data || [];
      if (Array.isArray(catList) && catList.length > 0) {
        setCategories(catList);
      }
    } catch (err) {
      console.warn("Using fallback categories:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-full">
                Active Catalog
              </span>
              <span className="text-xs text-slate-400 font-medium">• Circle Marketplace</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Marketplace Categories
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Click any category to view its listed products or post a new item.
            </p>
          </div>

          <button
            onClick={() => onNavigateCreate && onNavigateCreate()}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Listing</span>
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-500">Fetching categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-center space-y-3 p-8">
            <Layers className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Categories Found</h3>
            <p className="text-xs text-slate-500">No categories currently exist.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const { icon: Icon, color } = getCategoryIconAndColor(cat.name);
              const fields = cat.fields || [];

              return (
                <div
                  key={cat._id || cat.name}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 p-6 flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4 cursor-pointer" onClick={() => onSelectCategory && onSelectCategory(cat)}>
                    {/* Header icon and title */}
                    <div className="flex items-center gap-3.5">
                      <div className={`p-3.5 rounded-2xl border ${color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {cat.name}
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">
                          {fields.length} dynamic field{fields.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Fields List preview */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Specification Schema:
                      </span>
                      {fields.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No custom attributes configured</span>
                      ) : (
                        <div className="space-y-1.5">
                          {fields.map((field, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {field.label}
                                {field.required && <span className="text-rose-500 font-bold">*</span>}
                              </span>
                              <span className="text-[11px] font-mono px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500">
                                {field.type}
                                {field.options && field.options.length > 0 ? ` (${field.options.length})` : ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onSelectCategory && onSelectCategory(cat)}
                      className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 group/btn"
                    >
                      <span>View Products</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => onNavigateCreate && onNavigateCreate()}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <span>+ Post Item</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
