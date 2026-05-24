import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; mobile?: string; password?: string }>({});

  useEffect(() => {
    document.title = "Sign Up — PASKIN";
  }, []);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; mobile?: string; password?: string } = {};
    
    if (!name) {
      newErrors.name = "Full name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobile.replace(/\D/g, ""))) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    return newErrors;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please check your input fields");
      return;
    }
    
    setErrors({});

    try {
      await signup(name, email, mobile, password);
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.message;
      toast.error(errorMessage);
      
      // Show specific field errors
      if (errorMessage.includes("already exists")) {
        if (errorMessage.includes("email")) {
          setErrors({ email: "This email is already registered" });
        } else if (errorMessage.includes("mobile")) {
          setErrors({ mobile: "This mobile number is already registered" });
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-32 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <img src={logo} alt="PASKIN" className="h-12 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold font-display">Create Account</h1>
          <p className="text-muted-foreground mt-2 font-medium">Join PASKIN for organic wellness</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-border/50">
          <form className="space-y-5" onSubmit={handleSignup}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="John Doe" 
                  className={`w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border transition-all font-medium focus:bg-white focus:outline-none ${
                    errors.name 
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                      : "border-transparent focus:border-primary/30 focus:ring-0"
                  }`}
                />
              </div>
              {errors.name && (
                <div className="flex items-center gap-2 text-sm text-red-600 ml-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="name@example.com" 
                  className={`w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border transition-all font-medium focus:bg-white focus:outline-none ${
                    errors.email 
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                      : "border-transparent focus:border-primary/30 focus:ring-0"
                  }`}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 text-sm text-red-600 ml-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    if (errors.mobile) setErrors({ ...errors, mobile: undefined });
                  }}
                  placeholder="+91 00000 00000" 
                  className={`w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border transition-all font-medium focus:bg-white focus:outline-none ${
                    errors.mobile 
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                      : "border-transparent focus:border-primary/30 focus:ring-0"
                  }`}
                />
              </div>
              {errors.mobile && (
                <div className="flex items-center gap-2 text-sm text-red-600 ml-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.mobile}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••" 
                  className={`w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border transition-all font-medium focus:bg-white focus:outline-none ${
                    errors.password 
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                      : "border-transparent focus:border-primary/30 focus:ring-0"
                  }`}
                />
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 text-sm text-red-600 ml-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button 
                disabled={loading}
                className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-glow transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "Sign Up"}
                {!loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>

          <p className="text-[10px] text-center text-muted-foreground mt-6 leading-relaxed">
            By signing up, you agree to our <button className="font-bold hover:underline">Terms of Service</button> and <button className="font-bold hover:underline">Privacy Policy</button>.
          </p>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
