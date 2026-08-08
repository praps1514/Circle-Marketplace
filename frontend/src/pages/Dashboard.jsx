import React, { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  Eye, 
  MessageSquare, 
  PlusCircle, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Tag, 
  X, 
  AlertCircle,
  BarChart2,
  Settings,
  ChevronRight,
  Menu,
  Loader2,
  RefreshCw
} from "lucide-react";

import { getProducts } from "../services/productService";

export default function Dashboard({ onNavigateCreate, onOpenDetails }) {
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState("listings");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Modal States
  const [deleteId, setDeleteId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  // Fetch real products from GET /api/products
  const fetchListings = async () => {
    setIsLoading(true);
    setApiError("");
    try {
      const response = await getProducts();
      const apiData = response.data?.data || response.data || [];
      if (Array.isArray(apiData)) {
        const formatted = apiData.map((item) => ({
          ...item,
          id: item._id || item.id,
          title: item.title || "Untitled Product",
          price: item.price || 0,
          category: typeof item.category === "object" ? (item.category?.name || "General") : (item.category || "General"),
          status: item.status || "Active",
          views: item.views || 0,
          likes: item.likes || 0,
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently",
          image: (item.images && item.images.length > 0) ? item.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80"
        }));
        setListings(formatted);
      } else {
        setListings([]);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to load listings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Logic
  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Action Handlers
  const handleDelete = (id) => {
    setListings(listings.filter((item) => item.id !== id));
    setDeleteId(null);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setListings(listings.map((item) => (item.id === editingItem.id ? editingItem : item)));
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full justify-between p-6">
          
          <div className="space-y-6">
            {/* Seller Info Badge */}
            <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Seller Avatar"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-300"
              />
              <div className="flex-1 overflow-hidden">
                <h4 className="text-xs font-bold text-slate-900 truncate">Sarah's Store</h4>
                <span className="text-[10px] font-semibold text-blue-600 block">Pro Seller Account</span>
              </div>
            </div>

            {/* Nav Menu Items */}
            <nav className="space-y-1">
              {[
                { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
                { id: "listings", label: "My Listings", icon: Package, badge: listings.length },
                { id: "sales", label: "Orders & Sales", icon: DollarSign },
                { id: "inbox", label: "Messages & Offers", icon: MessageSquare, badge: 3 },
                { id: "analytics", label: "Store Analytics", icon: BarChart2 },
                { id: "settings", label: "Account Settings", icon: Settings }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Create CTA in Sidebar */}
          <div className="p-4 bg-gradient-to-tr from-blue-900 to-indigo-900 rounded-2xl text-white space-y-3 shadow-lg shadow-blue-950/20">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Seller Pro Tip</span>
            </div>
            <p className="text-[11px] text-blue-100/90 leading-relaxed">
              Listings with 3+ photos receive 4x more buyer inquiries!
            </p>
            <button
              onClick={onNavigateCreate}
              className="w-full py-2 bg-white hover:bg-slate-100 text-blue-900 font-bold text-xs rounded-xl transition shadow-sm"
            >
              + Post New Item
            </button>
          </div>

        </div>
      </aside>

      {/* 2. MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-x-hidden">
        
        {/* Mobile Header Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Seller Dashboard</h2>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-full">
                Seller Command Center
              </span>
              <span className="text-xs text-slate-400 font-medium">• Live Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              My Listings & Products
            </h1>
          </div>

          {/* Primary Create Product Button */}
          <button
            onClick={onNavigateCreate}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create Product</span>
          </button>
        </div>

        {/* API ERROR ALERT BANNER */}
        {apiError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <div>
                <span className="font-bold">Backend Connection Notice:</span> {apiError}
              </div>
            </div>
            <button
              onClick={fetchListings}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg shadow-sm hover:bg-rose-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry API</span>
            </button>
          </div>
        )}

        {/* 3. STATISTICS METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Active Listings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Listings</span>
              <h3 className="text-2xl font-black text-slate-900">
                {listings.filter((l) => l.status === "Active" || !l.status).length} Items
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Live Listings
              </span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Catalog Valuation</span>
              <h3 className="text-2xl font-black text-slate-900">
                ${listings.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0).toLocaleString("en-US")}
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Total Value
              </span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Total Impressions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Listing Views</span>
              <h3 className="text-2xl font-black text-slate-900">
                {listings.reduce((acc, curr) => acc + (curr.views || 0), 0)}
              </h3>
              <span className="text-[11px] font-bold text-blue-600">High Visibility</span>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Eye className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Inquiries & Messages */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Buyer Inquiries</span>
              <h3 className="text-2xl font-black text-slate-900">3 Messages</h3>
              <span className="text-[11px] font-bold text-amber-600">Active Seller</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* 4. SEARCH & FILTER CONTROLS BAR */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search my listings by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-blue-600"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="vehicles">Vehicles</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Goods</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-blue-600"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="sold">Sold</option>
              </select>

            </div>

          </div>
        </div>

        {/* 5. MY LISTINGS TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500">Loading products...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="py-16 text-center space-y-4 p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-900">No Listings Found</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                    ? "No product listings match your current search and filter criteria."
                    : "You haven't posted any product listings yet."}
                </p>
              </div>
              <button
                onClick={onNavigateCreate}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Your First Product Listing</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Product Details</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Views & Likes</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredListings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Product Thumbnail & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <h4 
                              onClick={() => onOpenDetails && onOpenDetails(item)}
                              className="font-bold text-slate-900 line-clamp-1 hover:text-blue-600 cursor-pointer"
                            >
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium">Added on {item.date}</span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-black text-blue-600">
                        ${Number(item.price).toLocaleString("en-US")}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded-md">
                          {item.category}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md ${
                          item.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.status === "Sold"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Views & Likes */}
                      <td className="py-4 px-4 text-slate-500 font-medium">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-400" /> {item.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5 text-slate-400" /> {item.likes}
                          </span>
                        </div>
                      </td>

                      {/* Actions Buttons: Edit, Delete, View */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* View Button */}
                          <button
                            onClick={() => onOpenDetails && onOpenDetails(item)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Public Listing"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit Listing"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* EDIT MODAL DIALOG */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Listing Details</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    className="input-field bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Listing?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
              >
                Yes, Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
