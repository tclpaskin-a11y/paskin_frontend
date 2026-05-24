import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Trash2, 
  Layers,
  X,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = "https://api.paskin.co.in/api";

interface Category {
  _id: string;
  name: string;
  createdAt: string;
  __v: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// API functions
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("admin-accessToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    headers: getAuthHeaders(),
  });
  const data: ApiResponse<Category[]> = await response.json();
  if (!data.success) {
    throw new Error("Failed to fetch categories");
  }
  return data.data || [];
};

const addCategory = async (name: string): Promise<Category> => {
  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });
  const data: ApiResponse<Category> = await response.json();
  if (!data.success) {
    throw new Error("Failed to add category");
  }
  return data.data!;
};

const deleteCategory = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data: ApiResponse<void> = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to delete category");
  }
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        toast.error("Failed to load categories");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleSave = async () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setSubmitting(true);
    try {
      const newCategory = await addCategory(categoryName.trim());
      setCategories(prev => [...prev, newCategory]);
      toast.success("Category added successfully");
      closeModal();
    } catch (error: any) {
      toast.error(error.message || "Failed to add category");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryName("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c._id !== id));
      toast.success("Category deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-slate-600">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Category Management</h2>
          <p className="text-slate-500 mt-1">Organize your products into logical sections.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-glow text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50">
                <th className="px-8 py-5">Category Name</th>
                <th className="px-8 py-5">Created At</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredCategories.map((cat) => (
                  <motion.tr 
                    key={cat._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                          <Layers className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                        {new Date(cat.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDelete(cat._id)}
                          className="p-2.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredCategories.length === 0 && (
            <div className="py-20 text-center">
              <AlertCircle className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No categories found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Add New Category
                  </h3>
                  <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="h-6 w-6 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category Name</label>
                    <input 
                      type="text" 
                      autoFocus
                      placeholder="e.g. Antibiotics" 
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full bg-slate-50 border border-transparent rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium"
                    />
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      onClick={closeModal}
                      disabled={submitting}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={submitting || !categoryName.trim()}
                      className="flex-1 bg-primary hover:bg-primary-glow text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Category"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
