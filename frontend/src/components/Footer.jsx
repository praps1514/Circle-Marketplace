import React from "react";
import { Sparkles, ShieldCheck, HeartHandshake, Zap, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Local Sellers</h4>
              <p className="text-xs text-slate-400">All accounts undergo email & identity verification</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Safe Community Trades</h4>
              <p className="text-xs text-slate-400">In-person pickup & secure buyer protection</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Instant Free Listings</h4>
              <p className="text-xs text-slate-400">Post items in less than 60 seconds with zero fees</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Circle <span className="text-blue-500">Marketplace</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Circle Marketplace is the modern buy & sell platform connecting neighbors and verified local communities for seamless transactions.
            </p>

            {/* Newsletter */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-200 block">
                Subscribe for Weekly Deals & Neighborhood Updates
              </label>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><a href="#" className="hover:text-blue-400 transition">Home Catalog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Featured Categories</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Trending Deals</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Verified Sellers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Post Free Listing</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Top Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><a href="#" className="hover:text-blue-400 transition">Electronics & Tech</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Vehicles & Automotive</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Real Estate & Rentals</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Furniture & Home Goods</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Sports & Outdoors</a></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Help & Support</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><a href="#" className="hover:text-blue-400 transition">Trust & Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Buyer Protection</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Community Rules</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Circle Marketplace Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300">Privacy</a>
            <a href="#" className="hover:text-slate-300">Terms</a>
            <a href="#" className="hover:text-slate-300">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
