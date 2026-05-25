import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, ArrowRight, AlertCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    document.title = "Log In — PASKIN";
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "Email or mobile number is required";
    } else if (email.length < 5) {
      newErrors.email = "Please enter a valid email or mobile number";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    return newErrors;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please check your input fields");
      return;
    }
    
    setErrors({});
    
    try {
      await login(email, password);
      toast.success("Welcome back!");
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      const errorMessage = error.message;
      toast.error(errorMessage);
      
      // Show specific field errors
      if (errorMessage.includes("not found")) {
        setErrors({ email: "This email or mobile is not registered" });
      } else if (errorMessage.includes("incorrect") || errorMessage.includes("Invalid password")) {
        setErrors({ password: "Your password is incorrect" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-32">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <img src={logo} alt="PASKIN" className="h-12 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold font-display">Welcome Back</h1>
          <p className="text-muted-foreground mt-2 font-medium">Log in to your PASKIN account</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-border/50">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email or Mobile</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
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
              <div className="flex justify-between items-end ml-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot Password?</button>
              </div>
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

            <button 
              disabled={loading}
              onClick={handleLogin}
              className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-glow transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Log In"}
              {!loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>


        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground font-medium">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-bold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}
