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
  User,
  LogIn
} from "lucide-react";

export default function Navbar({ activeNav, setActiveNav, currentUser, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isLoggedIn = Boolean(currentUser);
  const isAdmin = currentUser?.role === "admin";

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            
            {/* Brand Logo */}
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

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
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

              {/* Seller Links */}
              {isLoggedIn && !isAdmin && (
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

              {/* Admin Dashboard Tab (Strictly for logged in Admin) */}
              {isLoggedIn && isAdmin && (
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

          {/* Right Section: Post Listing & Profile / Auth */}
          <div className="flex items-center gap-3">
            
            {/* Create Listing Button (Visible for sellers / logged in users) */}
            {(!isLoggedIn || !isAdmin) && (
              <button
                onClick={() => handleNavClick(isLoggedIn ? "create" : "auth")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Listing</span>
              </button>
            )}

            {/* Notification Bell */}
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            {/* User Profile / Auth State */}
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 border-l border-slate-200 group focus:outline-none"
                >
                  <div className="relative">
                    <img
                      src={isAdmin ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-100 group-hover:ring-blue-400 transition"
                    />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${isAdmin ? "bg-purple-600" : "bg-emerald-500"}`} />
                  </div>

                  <div className="hidden sm:flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</span>
                      <span className={`px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded tracking-wide ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {currentUser.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{currentUser.email}</span>
                  </div>

                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-12 right-0 z-50 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* User Header */}
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                      <img
                        src={isAdmin ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900">{currentUser.name}</h4>
                          <span className={`px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                            {currentUser.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">{currentUser.email}</p>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavClick("home")}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Home className="w-4 h-4 text-blue-600" />
                        <span>Home Catalog</span>
                      </button>

                      <button
                        onClick={() => handleNavClick("categories")}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Grid className="w-4 h-4 text-blue-600" />
                        <span>Browse Categories</span>
                      </button>

                      {!isAdmin && (
                        <button
                          onClick={() => handleNavClick("my-listings")}
                          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <ListOrdered className="w-4 h-4 text-blue-600" />
                          <span>My Listings</span>
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick("admin")}
                          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}
                    </div>

                    {/* LOG OUT BUTTON */}
                    <div className="pt-3 border-t border-slate-100">
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition border border-rose-100 shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </div>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              /* Logged Out: Sign In / Sign Up Button */
              <button
                onClick={() => handleNavClick("auth")}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Sign Up</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
