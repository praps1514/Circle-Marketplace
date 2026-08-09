import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateProduct from "./pages/CreateProduct";
import ProductDetails from "./pages/ProductDetails";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Categories from "./pages/Categories";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";

function App() {
  const [activeNav, setActiveNav] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Global currentUser state initialized from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("circle_user");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading stored user:", e);
    }
    return null;
  });

  // Sync currentUser with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("circle_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("circle_user");
    }
  }, [currentUser]);

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setActiveNav("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setActiveNav("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    if (userObj.role === "admin") {
      setActiveNav("admin");
    } else {
      setActiveNav("home");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("circle_user");
    setActiveNav("auth");
  };

  // Route Guard: Prevent non-admins from rendering AdminDashboard
  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation Bar (hidden on dedicated Auth page) */}
      {activeNav !== "auth" && (
        <Navbar 
          activeNav={activeNav} 
          setActiveNav={setActiveNav} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Router View */}
      <main className="flex-1">
        {activeNav === "auth" ? (
          <Auth
            onLoginSuccess={handleLoginSuccess}
            onBackHome={() => setActiveNav("home")}
          />
        ) : activeNav === "admin" ? (
          // Route Guard: Only render AdminDashboard if currentUser is admin
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <Home
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onNavigateCreate={() => setActiveNav("create")}
              onNavigateCategories={() => setActiveNav("categories")}
              onOpenDetails={handleOpenDetails}
            />
          )
        ) : activeNav === "categories" ? (
          <Categories
            onSelectCategory={handleSelectCategory}
            onNavigateCreate={() => setActiveNav("create")}
          />
        ) : activeNav === "create" ? (
          <CreateProduct
            onProductCreated={(newProduct) => handleOpenDetails(newProduct)}
          />
        ) : activeNav === "details" ? (
          <ProductDetails
            product={selectedProduct}
            onBack={() => setActiveNav("home")}
          />
        ) : activeNav === "my-listings" ? (
          <Dashboard
            onNavigateCreate={() => setActiveNav("create")}
            onOpenDetails={handleOpenDetails}
          />
        ) : (
          <Home
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onNavigateCreate={() => setActiveNav("create")}
            onNavigateCategories={() => setActiveNav("categories")}
            onOpenDetails={handleOpenDetails}
          />
        )}
      </main>

      {/* Footer rendered on Home & Category pages */}
      {(activeNav === "home" || activeNav === "categories") && <Footer />}

    </div>
  );
}

export default App;