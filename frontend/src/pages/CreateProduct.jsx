import React, { useEffect, useState, useRef } from "react";
import { getCategories, createCategory } from "../services/categoryService";
import { createProduct } from "../services/productService";
import { 
  UploadCloud, 
  X, 
  Sparkles, 
  IndianRupee, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Save, 
  Send,
  Image as ImageIcon,
  Info,
  Sliders,
  Layers,
  Plus
} from "lucide-react";

export default function CreateProduct({ onProductCreated }) {
  // Categories from Backend API
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [attributes, setAttributes] = useState({});
  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");

  // UI & Loading States
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Feedback alerts
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // 1. Fetch categories from GET /api/categories
  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    setApiError("");
    try {
      const response = await getCategories();
      // Handle response structure: response.data.data or response.data
      const catList = response.data?.data || response.data || [];
      setCategories(catList);
      if (catList.length > 0) {
        handleSelectCategory(catList[0]);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setApiError(err.response?.data?.message || "Failed to load categories from backend server");
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  // 2. Category selection handler
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setApiError("");
    setValidationErrors({});
    
    // Reset dynamic attributes for the new category
    const initialAttrs = {};
    if (category && category.fields) {
      category.fields.forEach((field) => {
        if (field.type === "select" || field.type === "dropdown") {
          initialAttrs[field.label] = field.options && field.options.length > 0 ? field.options[0] : "";
        } else if (field.type === "radio") {
          initialAttrs[field.label] = field.options && field.options.length > 0 ? field.options[0] : "";
        } else if (field.type === "checkbox") {
          initialAttrs[field.label] = [];
        } else {
          initialAttrs[field.label] = "";
        }
      });
    }
    setAttributes(initialAttrs);
  };

  // 3. Dynamic field change handler
  const handleAttributeChange = (label, value, isCheckbox = false) => {
    setAttributes((prev) => {
      if (isCheckbox) {
        const currentList = Array.isArray(prev[label]) ? prev[label] : [];
        const updatedList = currentList.includes(value)
          ? currentList.filter((item) => item !== value)
          : [...currentList, value];
        return { ...prev, [label]: updatedList };
      }
      return { ...prev, [label]: value };
    });

    if (validationErrors[label]) {
      setValidationErrors((prev) => ({ ...prev, [label]: null }));
    }
  };

  // 4. Image Management
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput("");
    if (validationErrors.images) {
      setValidationErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    // Allow dragging image files or image URLs
    const sampleImg = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
    setImages((prev) => [...prev, sampleImg]);
  };

  // 5. Submit Form to POST /api/products
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    // Basic Validation
    const errors = {};
    if (!selectedCategory) errors.category = "Category selection is required.";
    if (!title.trim()) errors.title = "Product title is required.";
    if (!price || Number(price) <= 0) errors.price = "Enter a valid positive price.";

    // Validate required dynamic fields from backend schema
    if (selectedCategory && selectedCategory.fields) {
      selectedCategory.fields.forEach((field) => {
        if (field.required) {
          const val = attributes[field.label];
          if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === "string" && !val.trim())) {
            errors[field.label] = `"${field.label}" is a required attribute.`;
          }
        }
      });
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setApiError("Please correct the highlighted validation errors.");
      return;
    }

    setIsSubmitting(true);

    const getCategoryFallbackImage = (catName = "") => {
      const cat = String(catName).toLowerCase();
      if (cat.includes("mobile") || cat.includes("phone")) {
        return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80";
      } else if (cat.includes("laptop") || cat.includes("computer")) {
        return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80";
      } else if (cat.includes("vehicle") || cat.includes("car") || cat.includes("auto")) {
        return "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&auto=format&fit=crop&q=80";
      } else if (cat.includes("fashion") || cat.includes("cloth") || cat.includes("wear")) {
        return "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80";
      } else if (cat.includes("furniture") || cat.includes("home") || cat.includes("sofa")) {
        return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80";
      } else if (cat.includes("electronic") || cat.includes("tech")) {
        return "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80";
      }
      return "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80";
    };

    const finalImage = getCategoryFallbackImage(selectedCategory?.name);

    try {
      const payload = {
        title: title.trim(),
        price: Number(price),
        description: description.trim(),
        category: selectedCategory._id,
        attributes: attributes,
        images: images.length > 0 ? images : [finalImage]
      };

      const response = await createProduct(payload);

      if (response.data && (response.data.success || response.status === 201)) {
        const rawCreated = response.data?.data || response.data;
        const createdProd = {
          ...rawCreated,
          title: title.trim(),
          price: Number(price),
          description: description.trim(),
          category: selectedCategory,
          attributes: attributes,
          images: images.length > 0 ? images : [finalImage]
        };
        setSuccessMessage("🎉 Product successfully created and published!");
        
        // Reset Form
        setTitle("");
        setPrice("");
        setDescription("");
        setImages([]);
        setAttributes({});

        if (onProductCreated) {
          onProductCreated(createdProd);
        }
      }
    } catch (err) {
      console.error("Error publishing product:", err);
      setApiError(err.response?.data?.message || err.message || "Failed to publish product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryCreated = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    handleSelectCategory(newCategory);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-full">
                Verified Listing
              </span>
              <span className="text-xs text-slate-400 font-medium">• Instant Publish</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Create Product Listing
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a category configured by Admin to populate its custom specifications.
            </p>
          </div>
        </div>

        {/* Status Notification Alerts */}
        {apiError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
            <button onClick={() => setApiError("")} className="text-rose-400 hover:text-rose-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage("")} className="text-emerald-400 hover:text-emerald-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Product Listing Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 lg:p-10 space-y-8">
          
          {/* Section 1: Category Selector (Fetched from GET /api/categories) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>1. Select Category *</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {isCategoriesLoading ? "Loading..." : `${categories.length} categories available`}
              </span>
            </div>

            {isCategoriesLoading ? (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                <p className="text-xs text-slate-500">No categories configured. Please contact administrator to set up category schemas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const isSelected = selectedCategory?._id === cat._id;
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{cat.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                        {cat.fields ? `${cat.fields.length} custom fields` : "0 fields"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Basic Info */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              <span>2. Basic Product Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (validationErrors.title) setValidationErrors({ ...validationErrors, title: null });
                  }}
                  className={`input-field ${validationErrors.title ? "border-rose-400 focus:ring-rose-200" : ""}`}
                  required
                />
                {validationErrors.title && (
                  <p className="text-xs font-semibold text-rose-500">{validationErrors.title}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Price (₹ INR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="1"
                    placeholder="29999"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (validationErrors.price) setValidationErrors({ ...validationErrors, price: null });
                    }}
                    className={`input-field pl-9 ${validationErrors.price ? "border-rose-400 focus:ring-rose-200" : ""}`}
                    required
                  />
                </div>
                {validationErrors.price && (
                  <p className="text-xs font-semibold text-rose-500">{validationErrors.price}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Detailed Description
              </label>
              <textarea
                rows={4}
                placeholder="Include item condition, features, warranty, and pickup instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field resize-y"
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Dynamically Rendered Category Custom Fields */}
          {selectedCategory && selectedCategory.fields && selectedCategory.fields.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <span>3. Dynamic Custom Fields ({selectedCategory.name})</span>
                </h3>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  Category Specifications
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80">
                {selectedCategory.fields.map((field, idx) => (
                  <div 
                    key={idx} 
                    className={field.type === "textarea" ? "md:col-span-2 space-y-1.5" : "space-y-1.5"}
                  >
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>

                    {/* TEXT INPUT */}
                    {(field.type === "text" || field.type === "input" || !field.type) && (
                      <input
                        type="text"
                        placeholder={`Enter ${field.label}`}
                        value={attributes[field.label] || ""}
                        onChange={(e) => handleAttributeChange(field.label, e.target.value)}
                        className={`input-field ${validationErrors[field.label] ? "border-rose-400" : ""}`}
                      />
                    )}

                    {/* NUMBER INPUT */}
                    {field.type === "number" && (
                      <input
                        type="number"
                        placeholder={`Enter ${field.label}`}
                        value={attributes[field.label] || ""}
                        onChange={(e) => handleAttributeChange(field.label, e.target.value)}
                        className={`input-field ${validationErrors[field.label] ? "border-rose-400" : ""}`}
                      />
                    )}

                    {/* DROPDOWN / SELECT */}
                    {(field.type === "select" || field.type === "dropdown") && (
                      <select
                        value={attributes[field.label] || ""}
                        onChange={(e) => handleAttributeChange(field.label, e.target.value)}
                        className="input-field bg-white"
                      >
                        <option value="">Select {field.label}...</option>
                        {field.options?.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* RADIO BUTTONS */}
                    {field.type === "radio" && (
                      <div className="flex flex-wrap gap-3 pt-1">
                        {field.options?.map((opt, oIdx) => {
                          const isChecked = attributes[field.label] === opt;
                          return (
                            <label
                              key={oIdx}
                              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                                isChecked
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <input
                                type="radio"
                                name={field.label}
                                value={opt}
                                checked={isChecked}
                                onChange={(e) => handleAttributeChange(field.label, e.target.value)}
                                className="hidden"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* CHECKBOX GROUP */}
                    {field.type === "checkbox" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {field.options?.map((opt, oIdx) => {
                          const checkedList = Array.isArray(attributes[field.label]) ? attributes[field.label] : [];
                          const isChecked = checkedList.includes(opt);
                          return (
                            <label
                              key={oIdx}
                              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                                isChecked
                                  ? "bg-blue-50 text-blue-900 border-blue-200"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleAttributeChange(field.label, opt, true)}
                                className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* TEXTAREA */}
                    {field.type === "textarea" && (
                      <textarea
                        rows={3}
                        placeholder={`Enter details for ${field.label}`}
                        value={attributes[field.label] || ""}
                        onChange={(e) => handleAttributeChange(field.label, e.target.value)}
                        className={`input-field resize-y ${validationErrors[field.label] ? "border-rose-400" : ""}`}
                      />
                    )}

                    {validationErrors[field.label] && (
                      <p className="text-[11px] font-semibold text-rose-500">{validationErrors[field.label]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className="border-slate-100" />

          {/* Section 4: Image URLs */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>4. Image Gallery</span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="Paste high-res image URL (e.g. https://...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 input-field text-xs"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              >
                + Add Image
              </button>
            </div>

            {images.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((imgUrl, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 group">
                    <img src={imgUrl} alt={`Uploaded ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute inset-0 bg-rose-900/80 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Submit Action Buttons */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing product...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish Listing</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}