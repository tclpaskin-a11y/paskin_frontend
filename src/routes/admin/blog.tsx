import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Image as ImageIcon,
  X,
  Check,
  Calendar,
  Eye,
  Crop,
  ArrowRight,
  BookOpen,
  Loader,
} from "lucide-react";
import { toast } from "sonner";
import { createBlog, getAllBlogs, updateBlog, deleteBlog, Blog } from "@/lib/api/blogs";
import ImageCropper from "@/components/admin/ImageCropper";
import { getReadableErrorMessage } from "@/lib/api";

interface BlogFormData {
  title: string;
  description: string;
  isPublished: boolean;
}

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    description: "",
    isPublished: true,
  });

  // Cropping States
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null);

  const handleCropComplete = (croppedFile: File) => {
    if (croppingIndex !== null) {
      const updatedFiles = [...selectedImages];
      updatedFiles[croppingIndex] = croppedFile;
      setSelectedImages(updatedFiles);

      const updatedPreviews = [...selectedImagePreviews];
      URL.revokeObjectURL(updatedPreviews[croppingIndex]);
      updatedPreviews[croppingIndex] = URL.createObjectURL(croppedFile);
      setSelectedImagePreviews(updatedPreviews);
    }
    setCroppingFile(null);
    setCroppingIndex(null);
    toast.success("Image cropped successfully");
  };

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsFetching(true);
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (error) {
      toast.error(getReadableErrorMessage(error));
    } finally {
      setIsFetching(false);
    }
  };

  const MAX_IMAGE_COUNT = 5;
  const MAX_IMAGE_SIZE_MB = 4;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const newFiles = Array.from(files);
    const totalFiles = selectedImages.length + newFiles.length;
    if (totalFiles > MAX_IMAGE_COUNT) {
      toast.error(`You can upload up to ${MAX_IMAGE_COUNT} images only.`);
      return;
    }

    const oversized = newFiles.find((file) => file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024);
    if (oversized) {
      toast.error(`Each image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setSelectedImages((prev) => [...prev, ...newFiles]);
    setSelectedImagePreviews((prev) => [
      ...prev,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      isPublished: true,
    });
    setExistingImages([]);
    setSelectedImages([]);
    setSelectedImagePreviews([]);
    setIsEditMode(false);
    setEditingBlogId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a blog post title.");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter the blog post content.");
      return;
    }

    try {
      setIsLoading(true);

      if (isEditMode && editingBlogId) {
        const totalImages =
          selectedImages.length > 0 ? selectedImages.length : existingImages.length;
        if (totalImages < 1) {
          toast.error("Please provide at least one image for the blog post.");
          return;
        }
        if (totalImages > 5) {
          toast.error("A blog post can have a maximum of 5 images.");
          return;
        }

        await updateBlog(editingBlogId, {
          title: formData.title,
          description: formData.description,
          media: selectedImages.length > 0 ? selectedImages : undefined,
          isPublished: formData.isPublished,
        });
        toast.success("Blog updated successfully!");
      } else {
        if (selectedImages.length === 0) {
          toast.error("Please upload at least one image");
          return;
        }
        if (selectedImages.length > 5) {
          toast.error("A blog post can have a maximum of 5 images.");
          return;
        }
        await createBlog({
          title: formData.title,
          description: formData.description,
          media: selectedImages,
          isPublished: formData.isPublished,
        });
        toast.success("Blog created successfully!");
      }

      setIsFormOpen(false);
      resetForm();
      await fetchBlogs();
    } catch (error) {
      toast.error(getReadableErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      description: blog.description,
      isPublished: blog.isPublished,
    });
    setExistingImages(blog.images ?? []);
    setSelectedImages([]);
    setSelectedImagePreviews([]);
    setEditingBlogId(blog._id);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this blog post?")) {
      try {
        await deleteBlog(id);
        toast.success("Blog post deleted");
        await fetchBlogs();
      } catch (error) {
        toast.error(getReadableErrorMessage(error));
      }
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Blog Content</h2>
          <p className="text-slate-500 mt-1">Publish health tips and medicinal news.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="bg-primary hover:bg-primary-glow text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
          Create Post
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
        />
      </div>

      {/* Loading State */}
      {isFetching && (
        <div className="flex items-center justify-center py-20">
          <Loader className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {/* Blogs Grid */}
      {!isFetching && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog, i) => (
                <motion.div
                  key={blog._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col"
                >
                  <div className="h-64 relative overflow-hidden bg-slate-100">
                    {blog.images && blog.images.length > 0 ? (
                      <img
                        src={blog.images[0]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={blog.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <div className="flex gap-2 w-full">
                        <a
                          href={`/blog/${blog._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-white hover:bg-slate-50 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all text-center"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </a>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar className="h-3 w-3" />
                        {formatDate(blog.createdAt)}
                      </div>
                      <span className="text-slate-300">•</span>
                      <div className="text-[10px] font-bold text-primary uppercase tracking-widest">
                        {typeof blog.createdBy === "object" ? blog.createdBy.name : "Admin"}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2 leading-relaxed mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-6">{blog.description}</p>
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit Post
                      </button>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No blogs found</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Blog Editor Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsFormOpen(false);
                resetForm();
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 sm:p-12 overflow-y-auto">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                    {isEditMode ? "Edit Blog Post" : "Create New Post"}
                  </h3>
                  <button
                    onClick={() => {
                      setIsFormOpen(false);
                      resetForm();
                    }}
                    className="p-3 hover:bg-slate-100 rounded-2xl transition-colors border border-slate-100"
                  >
                    <X className="h-6 w-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                      Post Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-slate-50 border-transparent rounded-[1.5rem] py-5 px-6 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-xl font-bold"
                      placeholder="Enter a catchy title..."
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Blog Images
                      </label>
                      <label className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 group hover:bg-primary/5 hover:border-primary transition-all cursor-pointer">
                        {selectedImagePreviews.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3 w-full h-full p-3 overflow-hidden">
                            {selectedImagePreviews.map((preview, index) => (
                              <div
                                key={preview}
                                className="relative rounded-[1.85rem] overflow-hidden border border-slate-200 h-full group/thumb"
                              >
                                <img
                                  src={preview}
                                  alt={`Selected image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center gap-2 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      event.preventDefault();
                                      setCroppingFile(selectedImages[index]);
                                      setCroppingIndex(index);
                                    }}
                                    className="p-1.5 bg-white text-slate-800 hover:bg-primary hover:text-white rounded-lg transition-all"
                                    title="Crop Image"
                                  >
                                    <Crop className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      event.preventDefault();
                                      removeSelectedImage(index);
                                    }}
                                    className="p-1.5 bg-white text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                                    title="Remove Image"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>
                            <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                              <ImageIcon className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-slate-600">
                                Click to upload images
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                                You can select multiple images
                              </p>
                            </div>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </label>
                    </div>

                    {existingImages.length > 0 && (
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                          Existing Images
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {existingImages.map((image, index) => (
                            <div
                              key={`${image}-${index}`}
                              className="rounded-[1.85rem] overflow-hidden border border-slate-200 h-32"
                            >
                              <img
                                src={image}
                                alt={`Existing blog image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                      Post Content
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className="w-full min-h-[300px] bg-slate-50 rounded-[2rem] p-8 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none font-medium text-slate-700"
                      placeholder="Write your blog content here..."
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFormOpen(false);
                        resetForm();
                      }}
                      className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all disabled:opacity-50"
                      disabled={isLoading}
                    >
                      Discard Draft
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary-glow text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5" />
                          {isEditMode ? "Update Post" : "Publish Now"}
                        </>
                      )}
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
            aspectRatio={16 / 9}
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
