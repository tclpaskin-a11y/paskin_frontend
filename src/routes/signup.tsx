import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle, Eye, EyeOff, Loader } from "lucide-react";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { getReadableErrorMessage } from "@/lib/api";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    mobile?: string;
    password?: string;
  }>({});

  useEffect(() => {
    document.title = "Sign Up — PASKIN";
  }, []);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; mobile?: string; password?: string } = {};

    if (!name) {
      newErrors.name = "Please enter your full name.";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!email) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!mobile) {
      newErrors.mobile = "Please enter your mobile number.";
    } else if (!/^\d{10}$/.test(mobile.replace(/\D/g, ""))) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    if (!password) {
      newErrors.password = "Please enter your password.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    return newErrors;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please check your input fields.");
      return;
    }

    setErrors({});

    try {
      await signup(name, email, mobile, password);
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (error: any) {
      const friendlyMessage = getReadableErrorMessage(error);
      toast.error(friendlyMessage);

      // Show specific field errors
      if (friendlyMessage.includes("exists") || friendlyMessage.includes("registered")) {
        if (friendlyMessage.includes("email")) {
          setErrors({ email: "An account with this email already exists." });
        } else if (friendlyMessage.includes("mobile")) {
          setErrors({ mobile: "This mobile number is already registered." });
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Full Name
              </label>
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Email Address
              </label>
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Phone Number
              </label>
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••"
                  className={`w-full h-14 pl-14 pr-14 rounded-2xl bg-slate-50 border transition-all font-medium focus:bg-white focus:outline-none ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-transparent focus:border-primary/30 focus:ring-0"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-700 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
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
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-glow transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-[10px] text-center text-muted-foreground mt-6 leading-relaxed">
            By signing up, you agree to our{" "}
            <button className="font-bold hover:underline">Terms of Service</button> and{" "}
            <button className="font-bold hover:underline">Privacy Policy</button>.
          </p>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
