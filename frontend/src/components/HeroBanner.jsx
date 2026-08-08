import React, { useState } from "react";
import { Search, MapPin, Grid, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function HeroBanner({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch({ searchTerm, category, location });
  };

  return (
    <section className="relative bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          <span>The Trusted Local Marketplace</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>

        {/* Headline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Buy & Sell Everything in Your <span className="bg-gradient-to-r from-blue-200 via-indigo-200 to-pink-200 bg-clip-text text-transparent">Circle</span>
          </h1>
          <p className="text-base sm:text-lg text-blue-100/90 font-medium max-w-2xl mx-auto">
            Discover thousands of deals from verified sellers nearby. Fast, local, and hassle-free.
          </p>
        </div>

        {/* Integrated Search Bar Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-3 sm:p-4 shadow-2xl shadow-blue-950/40 text-slate-800 max-w-4xl mx-auto border border-white/20">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            {/* Search Keyword */}
            <div className="sm:col-span-5 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="What are you looking for today? (e.g. iPhone, Toyota, Sofa)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Category Dropdown */}
            <div className="sm:col-span-3 relative flex items-center">
              <Grid className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 focus:bg-white transition appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics & Gadgets</option>
                <option value="vehicles">Vehicles & Autos</option>
                <option value="property">Real Estate & Rentals</option>
                <option value="fashion">Fashion & Apparel</option>
                <option value="home">Home & Living</option>
              </select>
            </div>

            {/* Location Selector */}
            <div className="sm:col-span-2 relative flex items-center">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 focus:bg-white transition appearance-none cursor-pointer"
              >
                <option value="all">All India</option>
                <option value="mumbai">Mumbai, Maharashtra</option>
                <option value="bengaluru">Bengaluru, Karnataka</option>
                <option value="delhi">Delhi NCR</option>
                <option value="hyderabad">Hyderabad, Telangana</option>
                <option value="chennai">Chennai, Tamil Nadu</option>
                <option value="kolkata">Kolkata, West Bengal</option>
                <option value="pune">Pune, Maharashtra</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </form>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-blue-200">
          <span className="font-semibold text-blue-300">Popular Searches:</span>
          {["MacBook Pro", "Electric Scooter", "Rolex Watch", "Leather Sofa", "Mountain Bike"].map((chip) => (
            <button
              key={chip}
              onClick={() => setSearchTerm(chip)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition"
            >
              {chip}
            </button>
          ))}
        </div>

      </div>

    </section>
  );
}
