import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Upload, 
  X, 
  Check,
  ChevronDown,
  Crop
} from "lucide-react";
import { toast } from "sonner";
import { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAllCategories, 
  createCategory,
  Product, 
  Category 
} from "@/lib/api";
import ImageCropper from "@/components/admin/ImageCropper";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [gst, setGst] = useState<number>(10);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  
  // Image Upload / Preview States
  const [images, setImages] = useState<string[]>([]); // New uploads previews (ObjectURLs)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // New uploads files
  const [existingImages, setExistingImages] = useState<string[]>([]); // Pre-existing image URLs
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Add Category State
  const [showQuickAddCategory, setShowQuickAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Cropping State
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null);

  const handleCropComplete = (croppedFile: File) => {
    if (croppingIndex !== null) {
      const updatedFiles = [...uploadedFiles];
      updatedFiles[croppingIndex] = croppedFile;
      setUploadedFiles(updatedFiles);

      const updatedPreviews = [...images];
      URL.revokeObjectURL(updatedPreviews[croppingIndex]);
      updatedPreviews[croppingIndex] = URL.createObjectURL(croppedFile);
      setImages(updatedPreviews);
    }
    setCroppingFile(null);
    setCroppingIndex(null);
    toast.success("Image cropped successfully");
  };

  const handleQuickAddCategorySubmit = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    setIsAddingCategory(true);
    try {
      const newCat = await createCategory({ name: newCategoryName.trim() });
      toast.success("Category created successfully");
      setCategories((prev) => [...prev, newCat]);
      setCategory(newCat._id);
      setShowQuickAddCategory(false);
      setNewCategoryName("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    } finally {
      setIsAddingCategory(false);
    }
  };

  // Fetch products and categories on mount
  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const [prodsList, catsList] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
      ]);
      setProducts(prodsList);
      setCategories(catsList);
      
      // Default category for add form
      if (catsList.length > 0 && !category) {
        setCategory(catsList[0]._id);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      const currentTotal = existingImages.length + uploadedFiles.length;
      
      if (currentTotal + fileList.length > 5) {
        toast.error("You can upload a maximum of 5 images total.");
        const allowedCount = 5 - currentTotal;
        if (allowedCount <= 0) return;
        const allowedFiles = fileList.slice(0, allowedCount);
        setUploadedFiles([...uploadedFiles, ...allowedFiles]);
        
        const newPreviews = allowedFiles.map(file => URL.createObjectURL(file));
        setImages([...images, ...newPreviews]);
        toast.success(`Added ${allowedFiles.length} images (capped at 5 total)`);
      } else {
        setUploadedFiles([...uploadedFiles, ...fileList]);
        const newPreviews = fileList.map(file => URL.createObjectURL(file));
        setImages([...images, ...newPreviews]);
        toast.success(`${files.length} images added`);
      }
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index]);
    setImages(images.filter((_, i) => i !== index));
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product from the inventory?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully");
        fetchInventoryData();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete product");
      }
    }
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setBasePrice(p.basePrice);
    setSellPrice(p.sellPrice);
    setGst(p.gst ?? 10);
    setCategory(typeof p.category === "object" ? p.category._id : p.category);
    setColor(p.color ?? "");
    setSize(p.size ?? "");
    setExistingImages(p.images || []);
    setImages([]);
    setUploadedFiles([]);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setBasePrice(0);
    setSellPrice(0);
    setGst(10);
    setCategory(categories[0]?._id || "");
    setColor("");
    setSize("");
    setExistingImages([]);
    setImages([]);
    setUploadedFiles([]);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || basePrice <= 0 || sellPrice <= 0) {
      toast.error("Please fill in all required fields (Name, Category, Prices)");
      return;
    }

    const totalImagesCount = existingImages.length + uploadedFiles.length;
    if (totalImagesCount < 1) {
      toast.error("Please upload at least one product image.");
      return;
    }
    if (totalImagesCount > 5) {
      toast.error("A product can have a maximum of 5 images.");
      return;
    }

    try {
      const productPayload: any = {
        name,
        category,
        description,
        basePrice,
        sellPrice,
        gst,
        color,
        size,
      };

      // Multer files uploads goes through 'media' key
      if (uploadedFiles.length > 0) {
        productPayload.media = uploadedFiles;
      }

      // Pre-existing images
      if (existingImages.length > 0) {
        productPayload.images = existingImages;
      }

      if (editingProduct) {
        // Update API
        await updateProduct(editingProduct._id, productPayload);
        toast.success("Product updated successfully");
      } else {
        // Create API
        await createProduct(productPayload);
        toast.success("Product published successfully");
      }

      setIsFormOpen(false);
      fetchInventoryData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save product details");
    }
  };

  // Filters logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const catId = typeof p.category === "object" ? p.category._id : p.category;
    const matchesCategory = selectedCategory === "All" || catId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Product Inventory</h2>
          <p className="text-slate-500 mt-1">Manage your medicine catalog and stock levels.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="flex-1 min-w-[280px] relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search products by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          
          <div className="relative group min-w-[180px]">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-5 text-sm appearance-none focus:ring-2 focus:ring-primary/20 transition-all font-medium pr-10"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
          </div>

          <button 
            onClick={handleAddClick}
            className="bg-primary hover:bg-primary-glow text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group ml-auto sm:ml-0"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
            Add Product
          </button>
        </div>
      </div>

      {/* Loading state or Empty grid */}
      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="h-96 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8">
          <p className="text-slate-400 text-lg font-medium">No products found in this inventory.</p>
          <button onClick={handleAddClick} className="mt-4 text-primary font-bold hover:underline flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add your first product
          </button>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p, i) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden"
              >
                {/* Product Image */}
                <div className="aspect-square rounded-[1.75rem] overflow-hidden mb-6 relative bg-slate-50">
                  <img 
                    src={p.images?.[0] || "https://images.unsplash.com/photo-1611073103901-09605d8f6cc9?auto=format&fit=crop&q=80&w=300"} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleDelete(p._id)}
                      className="p-2.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-xl shadow-lg hover:bg-rose-500 hover:text-white transition-all transform translate-y-[-120%] group-hover:translate-y-0 duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.isPaused ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'}`}>
                      {p.isPaused ? 'Paused' : 'Active'}
                     </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3 px-1">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                    {typeof p.category === "object" ? p.category.name : "Uncategorized"}
                  </p>
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">{p.name}</h3>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-slate-800">₹{p.sellPrice}</span>
                      <span className="text-sm text-slate-400 line-through">₹{p.basePrice}</span>
                    </div>
                    <button 
                      onClick={() => handleEditClick(p)}
                      className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-colors"
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit Product Modal (Side Sheet Style) */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-screen overflow-y-auto shadow-2xl"
            >
              <div className="p-8 sm:p-12 space-y-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                      {editingProduct ? "Edit Product" : "New Product"}
                    </h3>
                    <p className="text-slate-500 mt-1">
                      {editingProduct ? "Modify the product details below." : "Fill in the details to add a new item."}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="p-3 hover:bg-slate-100 rounded-2xl transition-colors border border-slate-100"
                  >
                    <X className="h-6 w-6 text-slate-400" />
                  </button>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Product Name *</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                        placeholder="Amoxicillin..." 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category *</label>
                      <select 
                        required
                        value={category}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "ADD_NEW") {
                            setShowQuickAddCategory(true);
                            setNewCategoryName("");
                          } else {
                            setCategory(val);
                          }
                        }}
                        className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                        <option value="ADD_NEW" className="text-primary font-bold">+ Add New Category</option>
                      </select>

                      {showQuickAddCategory && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          className="mt-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3"
                        >
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Create New Category</p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Category name..." 
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <button
                              type="button"
                              disabled={isAddingCategory}
                              onClick={handleQuickAddCategorySubmit}
                              className="bg-primary hover:bg-primary-glow text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                            >
                              {isAddingCategory ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowQuickAddCategory(false);
                                setNewCategoryName("");
                              }}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Attributes Color and Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Color</label>
                      <input 
                        type="text" 
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                        placeholder="e.g. blue, red" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Size</label>
                      <input 
                        type="text" 
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                        placeholder="e.g. 6-12 months, 500mg" 
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Base Price *</label>
                      <input 
                        type="number" 
                        required
                        value={basePrice}
                        onChange={(e) => setBasePrice(Number(e.target.value))}
                        className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                        placeholder="₹" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Sell Price *</label>
                      <input 
                        type="number" 
                        required
                        value={sellPrice}
                        onChange={(e) => setSellPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                        placeholder="₹" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">GST %</label>
                      <input 
                        type="number" 
                        value={gst}
                        onChange={(e) => setGst(Number(e.target.value))}
                        className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                        placeholder="10%" 
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Product Images</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <input type="file" multiple hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                      <div className="bg-slate-100 p-4 rounded-2xl w-fit mx-auto group-hover:bg-primary/10 transition-colors">
                        <Upload className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="mt-4 text-sm font-bold text-slate-600">Drag & drop or <span className="text-primary">browse files</span></p>
                      <p className="text-xs text-slate-400 mt-1">Support JPG, PNG, WEBP (Max 5MB)</p>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                      {/* Pre-existing Images */}
                      {existingImages.map((img, i) => (
                        <div key={`existing-${i}`} className="relative w-24 h-24 rounded-2xl overflow-hidden group border border-slate-100 bg-slate-50">
                          <img src={img} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}
                            className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}

                      {/* New Uploads Preview */}
                      {images.map((img, i) => (
                        <div key={`new-${i}`} className="relative w-24 h-24 rounded-2xl overflow-hidden group border border-slate-100 bg-slate-50">
                          <img src={img} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => {
                                setCroppingFile(uploadedFiles[i]);
                                setCroppingIndex(i);
                              }}
                              className="p-1.5 bg-white text-slate-800 hover:bg-primary hover:text-white rounded-lg transition-all"
                              title="Crop Image"
                            >
                              <Crop className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="p-1.5 bg-white text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                              title="Remove Image"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium h-32" 
                      placeholder="Tell us about the product..."
                    />
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setIsFormOpen(false)} 
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-5 rounded-2xl transition-all"
                    >
                      Discard
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 bg-primary hover:bg-primary-glow text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="h-5 w-5" />
                      {editingProduct ? "Save Changes" : "Publish Product"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {croppingFile && (
          <ImageCropper
            file={croppingFile}
            aspectRatio={1}
            onClose={() => {
              setCroppingFile(null);
              setCroppingIndex(null);
            }}
            onCropComplete={handleCropComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
