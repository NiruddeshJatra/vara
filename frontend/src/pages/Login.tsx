
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string; general?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Login submitted:", { email, password, rememberMe });

    if (email === "test@example.com" && password !== "password") {
      setErrors({ general: "Invalid email or password" });
    } else if (email === "unverified@example.com") {
      setErrors({ general: "Email address is not verified" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow pt-16">
        <div className="bg-gradient-to-b from-green-300 to-lime-100/20">
          <div className="container max-w-md mx-auto px-4 py-12">
            <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-8 relative">

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                  <p className="text-gray-600">Sign in to your Bhara account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.general && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                      <p className="text-red-700 text-sm">{errors.general}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="youremail@example.com"
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-150 ease-in-out"
                    >
                      Sign In
                    </Button>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-8 flex justify-center items-center space-x-6">
              <div className="flex items-center text-gray-500 text-sm">
                <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <LifeBuoy className="h-5 w-5 text-green-600 mr-2" />
                <Link to="/support" className="hover:text-green-600">Need help?</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
