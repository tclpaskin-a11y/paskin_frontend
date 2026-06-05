import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Loader, 
  Share2, 
  CheckCircle2, 
  HelpCircle,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { getPublicBlog, Blog } from "@/lib/api";
import { toast } from "sonner";

export default function BlogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function loadBlogDetails() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getPublicBlog(id);
        setBlog(data);
        document.title = `${data.title} — PASKIN`;
      } catch (error: any) {
        toast.error(error.message || "Failed to load blog details");
      } finally {
        setLoading(false);
      }
    }
    loadBlogDetails();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
        <ArrowLeft className="h-12 w-12 text-slate-300 mb-4 stroke-1" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Article Not Found</h2>
        <p className="text-slate-500 mb-6 max-w-sm">We couldn't retrieve the details for this blog post. It may have been removed or is temporarily unavailable.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-3 font-bold transition-all shadow-lg hover:bg-primary-glow">
          Back to Journal
        </Link>
      </div>
    );
  }

  const dateFormatted = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "June 5, 2026";

  // Parsing helper to structure content nicely
  const renderContent = (text: string) => {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    const elements: JSX.Element[] = [];

    // Helper to identify list items
    const isListItem = (line: string) => {
      // Known bullet points or lines that are short list items
      const knownItems = [
        "Omega-3 fatty acids", "Omega-6 fatty acids", "Omega-7 fatty acids", "Omega-9 fatty acids",
        "Vitamin C", "Vitamin E", "Carotenoids", "Polyphenols",
        "Hair vitality", "Natural shine", "Scalp nourishment", "Stronger-looking strands",
        "Take them consistently.", "Maintain a balanced diet.", "Drink sufficient water daily.", "Exercise regularly.", "Get adequate sleep."
      ];
      return knownItems.includes(line) || line.startsWith("-") || line.startsWith("•");
    };

    // Helper to identify headings
    const isHeading = (line: string) => {
      const knownHeadings = [
        "Introduction", "Understanding the Nutritional Power of Sea Buckthorn",
        "Skin Wellness Benefits", "Hydration Support", "Elasticity Support",
        "Antioxidant Defense", "Hair and Scalp Support", "Immune Wellness",
        "Healthy Aging Support", "Daily Wellness Tips", "Frequently Asked Questions",
        "Final Thoughts"
      ];
      return knownHeadings.includes(line) || (line.length < 60 && !line.endsWith(".") && !line.endsWith("?") && !line.endsWith("!"));
    };

    // Helper to identify questions
    const isQuestion = (line: string) => {
      return line.endsWith("?");
    };

    let currentList: string[] = [];

    const flushList = (key: number) => {
      if (currentList.length === 0) return null;
      const listItems = [...currentList];
      currentList = [];
      return (
        <ul key={`list-${key}`} className="my-6 space-y-3 pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-700 text-lg leading-relaxed">
              <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>{item.replace(/^[-•]\s*/, "")}</span>
            </li>
          ))}
        </ul>
      );
    };

    lines.forEach((line, index) => {
      if (isListItem(line)) {
        currentList.push(line);
      } else {
        // Flush previous list if any
        if (currentList.length > 0) {
          const listElem = flushList(index);
          if (listElem) elements.push(listElem);
        }

        if (isQuestion(line)) {
          elements.push(
            <div key={`q-${index}`} className="mt-8 mb-3 flex items-start gap-3 bg-accent/10 p-5 rounded-2xl border border-accent/20">
              <HelpCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
              <h4 className="font-display text-xl font-bold text-slate-800 leading-snug">
                {line}
              </h4>
            </div>
          );
        } else if (isHeading(line)) {
          // Determine if it is a major heading or subheading
          const isMajor = [
            "Introduction", "Understanding the Nutritional Power of Sea Buckthorn",
            "Skin Wellness Benefits", "Hair and Scalp Support", "Immune Wellness",
            "Healthy Aging Support", "Daily Wellness Tips", "Frequently Asked Questions",
            "Final Thoughts"
          ].includes(line);

          if (isMajor) {
            elements.push(
              <h2 key={`h-${index}`} className="font-display text-2xl md:text-3xl font-bold text-slate-900 mt-12 mb-5 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {line}
              </h2>
            );
          } else {
            elements.push(
              <h3 key={`h-${index}`} className="font-display text-xl md:text-2xl font-semibold text-slate-800 mt-8 mb-4">
                {line}
              </h3>
            );
          }
        } else {
          // Regular paragraph
          elements.push(
            <p key={`p-${index}`} className="text-slate-600 text-lg leading-relaxed mb-6 font-normal">
              {line}
            </p>
          );
        }
      }
    });

    // Flush remaining list
    if (currentList.length > 0) {
      const listElem = flushList(lines.length);
      if (listElem) elements.push(listElem);
    }

    return elements;
  };

  // Safe fallback image
  const authorName = typeof blog.createdBy === "object" ? blog.createdBy.name : "Paskin Admin";
  const authorRole = typeof blog.createdBy === "object" ? blog.createdBy.role : "Editorial Team";
  const fallbackImg = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Navigation back */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Journal
        </Link>

        {/* Article Header */}
        <article className="animate-in fade-in duration-700">
          <header className="mb-10 text-center md:text-left">
            <span className="px-3.5 py-1 rounded-full bg-accent/40 text-primary font-bold text-xs uppercase tracking-widest inline-block mb-4">
              {blog.tag || "Wellness"}
            </span>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6 max-w-3xl">
              {blog.title}
            </h1>
            
            {/* Meta Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {authorName[0]}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">{authorName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{authorRole}</p>
                </div>
              </div>

              <div className="hidden sm:block h-6 w-px bg-slate-200" />

              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{dateFormatted}</span>
              </div>

              <div className="hidden sm:block h-6 w-px bg-slate-200" />

              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>5 min read</span>
              </div>

              <button 
                onClick={handleShare}
                className="ml-auto flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-glow border border-slate-100 hover:border-primary/20 bg-slate-50 hover:bg-primary/5 px-4 py-2 rounded-xl transition-all"
              >
                <Share2 className="h-4 w-4" />
                {isCopied ? "Copied!" : "Share"}
              </button>
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-xl mb-12 relative group">
            <img 
              src={blog.images?.[0] || fallbackImg} 
              alt={blog.title} 
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
          </div>

          {/* Reading content wrapper */}
          <div className="prose prose-slate max-w-3xl mx-auto px-1 md:px-4">
            {renderContent(blog.description)}
          </div>
          
          {/* Footer of the article */}
          <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tags:</span>
              <span className="text-sm font-semibold text-primary hover:underline cursor-pointer">#{blog.tag || "Wellness"}</span>
              <span className="text-sm font-semibold text-primary hover:underline cursor-pointer">#HerbalCare</span>
            </div>
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              View all articles
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
