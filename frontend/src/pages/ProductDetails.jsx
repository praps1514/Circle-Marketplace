import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Share2, 
  MessageSquare, 
  IndianRupee, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Tag, 
  CheckCircle2, 
  Info, 
  Sparkles,
  ArrowLeft,
  Calendar,
  Zap,
  Sliders
} from "lucide-react";
import ProductCard from "../components/ProductCard";

// Mock Product Details Fallback
const MOCK_PRODUCT_DETAILS = {
  id: "p101",
  title: "Apple MacBook Pro 16'' M3 Max (36GB RAM, 1TB SSD) - Space Black",
  price: 189999,
  originalPrice: 249999,
  category: "Electronics",
  categoryPath: ["Home", "Electronics", "Laptops"],
  location: "Mumbai, Maharashtra (Bandra West)",
  postedTime: "2 hours ago",
  viewsCount: 284,
  savesCount: 38,
  condition: "Like New (Mint Condition)",
  images: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&auto=format&fit=crop&q=80"
  ],
  description: `Purchased directly from Apple Store 4 months ago. Selling because I received a company laptop and no longer need two high-performance workstations.
  
Key Features & Condition:
• Battery Health: 99% Capacity (only 24 cycle counts)
• Zero scratches, dents, or screen blemishes (always kept in a hard shell case)
• Includes original 140W USB-C Power Adapter & MagSafe 3 Cable
• Factory reset with macOS Sequoia ready for instant setup`,
  
  attributes: {
    "Brand": "Apple",
    "Model": "MacBook Pro 16-inch (2023)",
    "Processor": "Apple M3 Max (16-core CPU, 40-core GPU)",
    "RAM Memory": "36 GB Unified Memory",
    "Storage": "1 TB Superfast SSD",
    "Screen Size": "16.2-inch Liquid Retina XDR",
    "Color": "Space Black"
  },

  seller: {
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 42,
    verified: true,
    joinedDate: "Member since Oct 2021",
    responseTime: "Usually responds in under 15 mins",
    salesCompleted: 19
  }
};

export default function ProductDetails({ product = MOCK_PRODUCT_DETAILS, onBack }) {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isMessageSent, setIsMessageSent] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product]);

  // Safe data extractors to avoid rendering object crashes
  const targetProd = product || MOCK_PRODUCT_DETAILS;
  const categoryName = typeof targetProd.category === "object" 
    ? (targetProd.category?.name || "General") 
    : (targetProd.category || "General");

  const conditionName = targetProd.condition || targetProd.attributes?.Condition || "Good";
  const locationName = targetProd.location || "Mumbai, Maharashtra";
  const postedTimeStr = targetProd.postedTime || (targetProd.createdAt ? new Date(targetProd.createdAt).toLocaleDateString() : "Recently");

  // Extract raw images
  const images = (targetProd.images && targetProd.images.length > 0)
    ? targetProd.images 
    : [MOCK_PRODUCT_DETAILS.images[0]];

  // Safely extract attributes map / object
  let attributesObj = {};
  if (targetProd.attributes) {
    if (targetProd.attributes instanceof Map) {
      attributesObj = Object.fromEntries(targetProd.attributes);
    } else if (typeof targetProd.attributes === "object") {
      attributesObj = targetProd.attributes;
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    setIsMessageSent(true);
    setTimeout(() => {
      setIsContactModalOpen(false);
      setIsMessageSent(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span>{categoryName}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800 font-semibold truncate max-w-[200px]">{targetProd.title}</span>
          </div>

          {/* Share & Wishlist Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                isSaved
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Product Layout (2 Columns) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Image Gallery & Specifications */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Large Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] w-full bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <img
                  src={images[selectedImgIndex] || images[0]}
                  alt={targetProd.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                <div className="absolute bottom-4 right-4 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white border border-white/20">
                  {selectedImgIndex + 1} / {images.length} Photos
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImgIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg backdrop-blur-md transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImgIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg backdrop-blur-md transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Row */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {images.map((imgUrl, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImgIndex(i)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition ${
                        selectedImgIndex === i ? "border-blue-600 ring-2 ring-blue-600/30" : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Product Title & Location Header */}
            <div className="space-y-3 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-lg">
                  {categoryName}
                </span>
                <span className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg">
                  Condition: {conditionName}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {targetProd.title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {locationName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Posted {postedTimeStr}
                </span>
              </div>
            </div>

            {/* 3. Dynamic Specifications / Attributes Table */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <span>Item Specifications & Attributes</span>
                </h3>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  Verified Specs
                </span>
              </div>

              {Object.keys(attributesObj).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No specific custom attributes provided for this item.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(attributesObj).map(([key, val]) => {
                    const displayVal = Array.isArray(val) ? val.join(", ") : String(val ?? "");
                    return (
                      <div key={key} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">{key}</span>
                        <span className="text-xs font-bold text-slate-900">{displayVal}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Description Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Detailed Description</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {targetProd.description || "No detailed description provided by seller."}
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Pricing & Seller Card */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-6">
              
              {/* Price Display */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-blue-600 tracking-tight">
                    ₹{Number(targetProd.price || 0).toLocaleString("en-IN")}
                  </span>
                  {targetProd.originalPrice && (
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      ₹{Number(targetProd.originalPrice).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Fair Market Price • Local Pickup Available</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Contact Seller</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
