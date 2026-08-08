import React, { useState } from "react";
import { 
  Home, 
  Grid, 
  ListOrdered, 
  PlusCircle, 
  Bell, 
  Sparkles,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Menu,
  X,
  User,
  RefreshCw
} from "lucide-react";

export default function Navbar({ activeNav, setActiveNav, currentUser, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = currentUser || { name: "Sarah Jenkins", email: "seller@circle.com", role: "seller" };
  const isAdmin = user.role === "admin";

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand Logo & Hamburger Button */}
          <div className="flex items-center gap-4 md:gap-8">
            
            {/* Hamburger Toggle Button (Visible on All Devices for Quick Menu & Logout) */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-1 border border-slate-200/80 shadow-sm"
              title="Open Navigation & Profile Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="hidden sm:inline text-xs font-bold text-slate-700">Menu</span>
            </button>

            {/* Logo */}
            <div 
              onClick={() => handleNavClick("home")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                  Circle <span className="text-blue-600">Marketplace</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                  Buy & Sell Community
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => handleNavClick("home")}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeNav === "home"
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleNavClick("categories")}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeNav === "categories"
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Categories</span>
              </button>

              {/* Seller: My Listings */}
              {!isAdmin && (
                <button
                  onClick={() => handleNavClick("my-listings")}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeNav === "my-listings"
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <ListOrdered className="w-4 h-4" />
                  <span>My Listings</span>
                </button>
              )}

              {/* Admin: Admin Dashboard Tab */}
              {isAdmin && (
                <button
                  onClick={() => handleNavClick("admin")}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeNav === "admin"
                      ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Admin Dashboard</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Section: Actions & Profile */}
          <div className="flex items-center gap-3">
            
            {/* Create Listing Button (Visible for sellers) */}
            {!isAdmin && (
              <button
                onClick={() => handleNavClick("create")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Listing</span>
              </button>
            )}

            {/* Profile Avatar Button (Opens Hamburger Menu) */}
            <div 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={isAdmin ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt="Profile Avatar"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-100 group-hover:ring-blue-400 transition"
                />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${isAdmin ? "bg-purple-600" : "bg-emerald-500"}`} />
              </div>

              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 leading-tight">{user.name}</span>
                  <span className={`px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded tracking-wide ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {user.role}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{user.email}</span>
              </div>

              <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
            </div>

          </div>

        </div>
      </div>

      {/* HAMBURGER MENU & USER PROFILE DROPDOWN DRAWER */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 sm:right-8 z-50 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-5 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          
          {/* User Info Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <img
              src={isAdmin ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{user.name}</h4>
                <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full tracking-wider ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{user.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2 mb-1">
              Navigation Menu
            </span>

            <button
              onClick={() => handleNavClick("home")}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition ${
                activeNav === "home" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4" />
                <span>Home Marketplace</span>
              </div>
            </button>

            <button
              onClick={() => handleNavClick("categories")}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition ${
                activeNav === "categories" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Grid className="w-4 h-4" />
                <span>Browse Categories</span>
              </div>
            </button>

            {/* Seller Links */}
            {!isAdmin && (
              <>
                <button
                  onClick={() => handleNavClick("my-listings")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition ${
                    activeNav === "my-listings" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ListOrdered className="w-4 h-4" />
                    <span>My Listings</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick("create")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition ${
                    activeNav === "create" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-blue-600">
                    <PlusCircle className="w-4 h-4" />
                    <span>Post New Listing</span>
                  </div>
                </button>
              </>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick("admin")}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition ${
                  activeNav === "admin" ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5 text-indigo-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </div>
              </button>
            )}
          </div>

          {/* Account Actions & Logout Button */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            
            <button
              onClick={() => handleNavClick("auth")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>Switch Account / Sign In</span>
              </div>
            </button>

            {/* LOG OUT BUTTON */}
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition border border-rose-100"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4" />
                <span>Log Out ({user.role.toUpperCase()})</span>
              </div>
            </button>

          </div>

        </div>
      )}
    </header>
  );
}
