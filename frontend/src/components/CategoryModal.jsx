import React, { useState } from "react";
import { X, Plus, Trash2, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { createCategory } from "../services/categoryService";

export default function CategoryModal({ isOpen, onClose, onCategoryCreated }) {
  const [name, setName] = useState("");
  const [fields, setFields] = useState([
    { label: "Condition", type: "select", options: ["New", "Like New", "Good", "Fair"], required: true },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAddField = () => {
    setFields([
      ...fields,
      { label: "", type: "text", options: [], required: false }
    ]);
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    // Validate fields
    for (let f of fields) {
      if (!f.label.trim()) {
        setError("All custom fields must have a valid label name.");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: name.trim(),
        fields: fields.map((f) => ({
          label: f.label.trim(),
          type: f.type,
          options: f.options,
          required: Boolean(f.required)
        }))
      };

      const res = await createCategory(payload);
      if (res.data && res.data.success) {
        onCategoryCreated(res.data.data);
        setName("");
        setFields([]);
        onClose();
      }
    } catch (err) {
      console.error("Failed to create category:", err);
      setError(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Create New Category</h2>
              <p className="text-xs text-slate-400">Define custom dynamic fields for listings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Category Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Category Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Electronics, Vehicles, Real Estate, Fashion"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              required
            />
          </div>

          {/* Dynamic Fields Definition */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Dynamic Attributes / Specifications Schema
              </label>
              <button
                type="button"
                onClick={handleAddField}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Field
              </button>
            </div>

            {fields.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 text-center border border-dashed border-slate-800 rounded-xl">
                No custom dynamic fields defined. Products in this category will only have standard title, price & description.
              </p>
            ) : (
              <div className="space-y-3">
                {fields.map((field, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Field Label (e.g. Brand, Storage, Engine)"
                        value={field.label}
                        onChange={(e) => handleFieldChange(idx, "label", e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg glass-input text-xs"
                        required
                      />

                      <select
                        value={field.type}
                        onChange={(e) => handleFieldChange(idx, "type", e.target.value)}
                        className="px-3 py-1.5 rounded-lg glass-input text-xs bg-slate-900"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="select">Dropdown Options</option>
                      </select>

                      <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer px-2 py-1 bg-slate-900 rounded-lg border border-slate-800">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => handleFieldChange(idx, "required", e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-0 bg-slate-950 border-slate-700"
                        />
                        <span>Required</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {field.type === "select" && (
                      <div>
                        <input
                          type="text"
                          placeholder="Options (comma separated, e.g. Red, Blue, Green)"
                          value={field.options ? field.options.join(", ") : ""}
                          onChange={(e) => handleFieldChange(idx, "optionsStr", e.target.value)}
                          className="w-full px-3 py-1 rounded-lg glass-input text-xs text-indigo-300"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Category...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Category</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
