import React, { useState } from "react";
import { MapPin, Clock, Heart, Tag, Sparkles, ShieldCheck } from "lucide-react";

export default function ProductCard({ product, onClick }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >

      
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/10 opacity-80" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 rounded-lg shadow-sm flex items-center gap-1">
            <Tag className="w-3 h-3 text-blue-600" />
            {product.category}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isLiked
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-110"
              : "bg-slate-900/40 hover:bg-white text-white hover:text-rose-500"
          }`}
          title="Save listing"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>

        {/* Featured / Popular Badge if applicable */}
        {product.badge && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white rounded-md shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-extrabold text-blue-600 tracking-tight">
              ₹{Number(product.price).toLocaleString("en-IN", { minimumFractionDigits: 0 })}
            </span>
            {product.verifiedSeller && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mt-1 leading-snug">
            {product.title}
          </h3>
        </div>

        {/* Location & Posted Time */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 line-clamp-1 max-w-[60%]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{product.postedTime}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
