import { useState, useEffect } from "react";
import herbs from "@/assets/hero-herbs.jpg";
import lifestyle from "@/assets/hero-lifestyle.jpg";
import prep from "@/assets/hero-prep.jpg";
import { getPublicBlogs } from "@/lib/api";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getPublicBlogs();
      
      const mappedPosts = data.map((b: any, index: number) => {
        const fallbackImages = [herbs, lifestyle, prep];
        const excerpt = b.description
          ? b.description.substring(0, 120) + (b.description.length > 120 ? "..." : "")
          : "Read our latest health tips and ayurvedic wellness guides from our herbal experts.";
        
        const dateStr = b.createdAt
          ? new Date(b.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "May 24, 2026";

        return {
          id: b._id,
          title: b.title || "Ayurvedic Health Tip",
          date: dateStr,
          tag: b.tag || (index % 2 === 0 ? "Wisdom" : "Wellness"),
          image: b.images?.[0] || fallbackImages[index % fallbackImages.length],
          excerpt,
        };
      });

      setPosts(mappedPosts);
    } catch (error: any) {
      toast.error(error.message || "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <section className="py-24 container mx-auto px-6">
      <div className="flex items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-primary text-sm uppercase tracking-[0.2em] mb-3">Journal</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium max-w-xl text-balance">
            Stories from the herbal world.
          </h2>
        </div>
        <a href="/blog" className="hidden md:inline-block text-sm font-medium text-primary hover:underline underline-offset-4">
          Refresh Articles ↻
        </a>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-slate-50 rounded-3xl border border-slate-100/50">
          <Loader className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : posts.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {posts.map((post) => (
            <article key={post.id} className="group rounded-2xl overflow-hidden bg-card border border-border hover-lift flex flex-col h-full">
              <div className="aspect-[4/3] overflow-hidden bg-slate-50">
                <img src={post.image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-accent/30 text-primary font-medium">{post.tag}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="font-display text-xl font-medium leading-snug group-hover:text-primary transition line-clamp-2 mb-3">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="mt-auto pt-4 border-t border-border/50">
                  <a href={`/blog`} className="inline-block text-sm font-semibold text-primary">
                    Read article →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-lg font-medium">No blog articles are published yet.</p>
        </div>
      )}
    </section>
  );
}
