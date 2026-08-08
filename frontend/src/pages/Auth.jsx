import React, { useState } from "react";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ShoppingBag
} from "lucide-react";

export default function Auth({ initialMode = "login", onLoginSuccess, onBackHome }) {
  const [mode, setMode] = useState(initialMode); // "login" | "register"
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Demo Accounts Quick Login Handler
  const handleQuickDemoLogin = (role) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    setTimeout(() => {
      setIsLoading(false);
      let userObj;
      if (role === "admin") {
        userObj = {
          name: "Admin User",
          email: "admin@circle.com",
          role: "admin"
        };
        setEmail("admin@circle.com");
        setPassword("admin123");
      } else {
        userObj = {
          name: "Sarah Jenkins",
          email: "seller@circle.com",
          role: "seller"
        };
        setEmail("seller@circle.com");
        setPassword("seller123");
      }

      setSuccessMessage(`Logged in as Demo ${role.toUpperCase()}! Redirecting...`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(userObj);
      }, 600);
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic Validation
    if (!email.trim() || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (mode === "register") {
      if (!fullName.trim()) {
        setErrorMessage("Full Name is required for registration.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match. Please check again.");
        return;
      }
      if (!agreeTerms) {
        setErrorMessage("You must agree to the Terms of Service & Privacy Policy.");
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      let role = "seller";
      let name = fullName || email.split("@")[0];

      // Check credentials for demo accounts
      if (email.toLowerCase().trim() === "admin@circle.com" && password === "admin123") {
        role = "admin";
        name = "Admin User";
      } else if (email.toLowerCase().trim() === "seller@circle.com" && password === "seller123") {
        role = "seller";
        name = "Sarah Jenkins";
      }

      const userObj = { email, name, role };
      setSuccessMessage(`Welcome back ${name}! Logged in as ${role.toUpperCase()}. Redirecting...`);
      
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(userObj);
      }, 800);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/25 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />

      {/* Main Glassmorphism Card Container */}
      <div className="relative z-10 w-full max-w-md glass-panel bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/50 space-y-6 animate-in fade-in duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div 
            onClick={onBackHome}
            className="inline-flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-6 h-6 fill-current" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
            Circle <span className="text-blue-500">Marketplace</span>
          </h1>

          <p className="text-xs text-slate-400 font-medium">
            {mode === "login" 
              ? "Sign in with your Seller or Admin credentials" 
              : "Create a free account to start buying and selling"}
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block text-center tracking-wider">
            ⚡ Quick Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("seller")}
              className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Demo Seller</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("admin")}
              className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle: Sign In vs Create Account */}
        <div className="p-1 bg-slate-950/60 rounded-2xl border border-white/5 grid grid-cols-2 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode("login"); setErrorMessage(""); setSuccessMessage(""); }}
            className={`py-2.5 rounded-xl transition-all ${
              mode === "login"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setErrorMessage(""); setSuccessMessage(""); }}
            className={`py-2.5 rounded-xl transition-all ${
              mode === "register"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Main Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name (Only in Register Mode) */}
          {mode === "register" && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="seller@circle.com or admin@circle.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              {mode === "login" && (
                <span className="text-[10px] text-slate-400">
                  seller123 / admin123
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Only in Register Mode) */}
          {mode === "register" && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Options Row */}
          {mode === "login" ? (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Remember me on this device</span>
              </label>
            </div>
          ) : (
            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 mt-0.5"
                />
                <span className="leading-tight text-[11px] text-slate-400">
                  I agree to the Terms of Service & Privacy Policy
                </span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === "login" ? "Sign In to Marketplace" : "Create My Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Return to Catalog Link */}
        <div className="text-center pt-2">
          <button
            onClick={onBackHome}
            className="text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            ← Return to Marketplace Catalog
          </button>
        </div>

      </div>

    </div>
  );
}
