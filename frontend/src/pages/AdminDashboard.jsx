import React, { useEffect, useState } from "react";
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../services/categoryService";
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Sliders, 
  Settings, 
  Grid,
  Info
} from "lucide-react";

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Modal / Form state for Create & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [fields, setFields] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (selectId = null) => {
    setLoading(true);
    setError("");
    try {
      const res = await getCategories();
      const catList = res.data?.data || res.data || [];
      setCategories(catList);

      if (catList.length > 0) {
        if (selectId) {
          const found = catList.find((c) => c._id === selectId);
          setSelectedCategory(found || catList[0]);
        } else {
          setSelectedCategory((prev) => {
            if (prev) {
              const matching = catList.find((c) => c._id === prev._id);
              return matching || catList[0];
            }
            return catList[0];
          });
        }
      } else {
        setSelectedCategory(null);
      }
    } catch (err) {
      console.error("Failed to load categories in Admin:", err);
      setError("Failed to fetch category schemas from backend server.");
    } finally {
      setLoading(false);
    }
  };

  // Open modal for Create Category
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditCategoryId(null);
    setCategoryName("");
    setFields([
      { label: "Brand", type: "text", options: [], required: true },
      { label: "Condition", type: "select", options: ["New", "Like New", "Good", "Fair"], required: true }
    ]);
    setError("");
    setIsModalOpen(true);
  };

  // Open modal for Edit Category
  const handleOpenEditModal = (cat, e) => {
    if (e) e.stopPropagation();
    setModalMode("edit");
    setEditCategoryId(cat._id);
    setCategoryName(cat.name);
    
    // Format existing fields
    const formattedFields = (cat.fields || []).map((f) => ({
      _id: f._id,
      label: f.label || "",
      type: f.type || "text",
      options: f.options ? [...f.options] : [],
      required: Boolean(f.required)
    }));

    setFields(formattedFields);
    setError("");
    setIsModalOpen(true);
  };

  // Field manipulation inside modal
  const handleAddField = () => {
    setFields([
      ...fields,
      { label: "", type: "text", options: [], required: false }
    ]);
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleMoveField = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= fields.length) return;
    const updated = [...fields];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFields(updated);
  };

  const handleFieldChange = (index, key, value) => {
    const updated = [...fields];
    if (key === "optionsStr") {
      updated[index].options = value.split(",").map((s) => s.trim()).filter(Boolean);
    } else {
      updated[index][key] = value;
    }
    setFields(updated);
  };

  // Save (Create or Edit) Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError("Category Name is required.");
      return;
    }

    for (let f of fields) {
      if (!f.label.trim()) {
        setError("All specification fields must have a valid non-empty label.");
        return;
      }
    }

    setFormSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        name: categoryName.trim(),
        fields: fields.map((f) => ({
          label: f.label.trim(),
          type: f.type,
          options: f.options || [],
          required: Boolean(f.required)
        }))
      };

      if (modalMode === "create") {
        const res = await createCategory(payload);
        const createdCat = res.data?.data || res.data;
        setSuccessMessage(`✅ Category "${createdCat.name}" successfully created!`);
        setIsModalOpen(false);
        await fetchCategories(createdCat._id);
      } else {
        const res = await updateCategory(editCategoryId, payload);
        const updatedCat = res.data?.data || res.data;
        setSuccessMessage(`✅ Category "${updatedCat.name}" successfully updated!`);
        setIsModalOpen(false);
        await fetchCategories(updatedCat._id);
      }
    } catch (err) {
      console.error("Error saving category schema:", err);
      setError(err.response?.data?.message || err.message || "Failed to save category schema.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Category Execution
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError("");
    setSuccessMessage("");

    try {
      await deleteCategory(deleteTarget._id);
      setSuccessMessage(`🗑️ Category "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      await fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(err.response?.data?.message || "Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrator Panel
              </span>
              <span className="text-xs text-slate-400 font-medium">• Category & Field Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Admin Schema Controller
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Configure product category schemas and dynamic input specification fields consumed by sellers.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Category</span>
          </button>
        </div>

        {/* Global Feedback Notifications */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError("")} className="text-rose-400 hover:text-rose-600">
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

        {/* Main Grid Workspace: Left Category Sidebar & Right Field Inspector */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading category schemas from database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDEBAR: Categories List (4 Cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Configured Categories ({categories.length})</span>
                </span>
              </div>

              {categories.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl space-y-3">
                  <p className="text-xs text-slate-500">No categories found in MongoDB.</p>
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-3.5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
                  >
                    Create First Category
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory?._id === cat._id;
                    const fieldCount = cat.fields ? cat.fields.length : 0;

                    return (
                      <div
                        key={cat._id}
                        onClick={() => setSelectedCategory(cat)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? "bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <h3 className={`text-sm font-bold ${isSelected ? "text-blue-950" : "text-slate-800"}`}>
                            {cat.name}
                          </h3>
                          <span className="text-[11px] font-medium text-slate-400 block">
                            {fieldCount} field specification{fieldCount !== 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(e) => handleOpenEditModal(cat, e)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition"
                            title="Edit Category Schema"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(cat);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT PANEL: Selected Category Schema Details & Inspection (8 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              {selectedCategory ? (
                <>
                  {/* Category Banner Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        Active Category Schema
                      </span>
                      <h2 className="text-2xl font-black text-slate-900 mt-2">
                        {selectedCategory.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleOpenEditModal(selectedCategory, e)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Category & Fields</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(selectedCategory)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Schema Field Specifications Table */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-blue-600" />
                        <span>Configured Specification Fields ({(selectedCategory.fields || []).length})</span>
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">Form Renderer Contract</span>
                    </div>

                    {(selectedCategory.fields || []).length === 0 ? (
                      <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                        <p className="text-xs text-slate-500">No dynamic fields defined for this category.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedCategory.fields.map((field, idx) => (
                          <div
                            key={field._id || idx}
                            className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-slate-900">
                                  {idx + 1}. {field.label}
                                </span>
                                {field.required && (
                                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-100 text-rose-700 rounded-md">
                                    Required
                                  </span>
                                )}
                              </div>
                              {field.options && field.options.length > 0 && (
                                <p className="text-xs text-slate-500 font-mono">
                                  Options: <span className="text-slate-700 font-semibold">{field.options.join(", ")}</span>
                                </p>
                              )}
                            </div>

                            <span className="self-start sm:self-auto px-3 py-1 bg-white border border-slate-200 text-xs font-mono font-bold text-blue-600 rounded-lg uppercase">
                              {field.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-20 text-center text-slate-400 text-xs space-y-2">
                  <Grid className="w-8 h-8 mx-auto text-slate-300" />
                  <p>Select a category from the sidebar to inspect its field schema.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {modalMode === "create" ? "Create New Category Schema" : `Edit Category: ${categoryName}`}
                  </h2>
                  <p className="text-xs text-slate-500">Configure dynamic input fields and options for sellers</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Category Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smartwatches, Cameras, Gaming Consoles"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              {/* Dynamic Fields Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Dynamic Listing Fields ({fields.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-xl transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Field</span>
                  </button>
                </div>

                {fields.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-4 text-center border border-dashed border-slate-200 rounded-2xl">
                    No custom fields defined. Sellers will only see basic title, price & description.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
                        
                        {/* Field Label, Type, Required & Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          
                          <div className="sm:col-span-5">
                            <input
                              type="text"
                              placeholder="Field Label (e.g. Storage, RAM, Warranty)"
                              value={field.label}
                              onChange={(e) => handleFieldChange(idx, "label", e.target.value)}
                              className="input-field text-xs"
                              required
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <select
                              value={field.type}
                              onChange={(e) => handleFieldChange(idx, "type", e.target.value)}
                              className="input-field text-xs bg-white cursor-pointer"
                            >
                              <option value="text">Text Input</option>
                              <option value="number">Number</option>
                              <option value="select">Dropdown Select</option>
                              <option value="radio">Radio Buttons</option>
                              <option value="checkbox">Multi-Checkbox</option>
                              <option value="textarea">Textarea</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2 flex items-center">
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => handleFieldChange(idx, "required", e.target.checked)}
                                className="rounded text-blue-600 focus:ring-0"
                              />
                              <span>Required</span>
                            </label>
                          </div>

                          <div className="sm:col-span-2 flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveField(idx, -1)}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveField(idx, 1)}
                              disabled={idx === fields.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveField(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition"
                              title="Delete Field"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </div>

                        {/* Options Input for Select, Radio, Checkbox */}
                        {(field.type === "select" || field.type === "dropdown" || field.type === "radio" || field.type === "checkbox") && (
                          <div className="pt-1">
                            <input
                              type="text"
                              placeholder="Options (comma-separated, e.g. 64GB, 128GB, 256GB)"
                              value={field.options ? field.options.join(", ") : ""}
                              onChange={(e) => handleFieldChange(idx, "optionsStr", e.target.value)}
                              className="input-field text-xs text-blue-700 bg-white"
                            />
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Schema...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{modalMode === "create" ? "Save Category Schema" : "Update Category Schema"}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Category</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              Are you sure you want to permanently delete category <strong className="text-slate-900 font-bold">"{deleteTarget.name}"</strong> along with its configured specification schema?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Category</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
