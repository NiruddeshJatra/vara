import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from '@/components/ui/use-toast';
import AuthService from "@/services/auth.service";
import { LoginData } from '@/types/auth';
import { validateLoginForm } from '@/utils/validations/auth.validations';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isResending, setIsResending] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we were redirected from verification
  const verified = new URLSearchParams(location.search).get('verified') === '1';

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      await AuthService.resendVerificationEmail(email);
      toast({
        title: 'Verification Email Sent',
        description: 'Verification email sent successfully. Please check your inbox.',
        variant: 'success',
      });
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send verification email',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateLoginForm({ email, password });
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        await login(email, password, rememberMe);
        // The AuthContext will handle redirection to /advertisements
      } catch (error: any) {
        if (error.message === 'UNVERIFIED_EMAIL') {
          setErrors({
            general: 'Please verify your email before logging in.',
            email: 'Email not verified'
          });
          return;
        }
        toast({
          title: 'Login Error',
          description: 'Login failed. Please check your credentials.',
          variant: 'destructive',
        });
        setErrors({
          general: error.response?.data?.detail || 'Invalid email or password'
        });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow pt-14">
        <div className="bg-gradient-to-b from-green-300 to-lime-100/20">
          <div className="container max-w-md mx-auto px-4 py-12">
            <div className="bg-gradient-to-b from-white to-lime-50 backdrop-blur-sm shadow-lg rounded-xl p-8 relative animate-fade-up">
              {/* Decorative background elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-400/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-lime-300/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="text-center mb-8 animate-fade-up">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                  <p className="text-gray-600">Sign in to your Bhara account</p>

                  {verified && (
                    <div className="mt-3 p-3 bg-green-50 text-green-800 rounded-lg border border-green-200 animate-fade-in">
                      <p>Your email has been verified successfully! You can now log in.</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.general && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 animate-fade-in">
                      <p className="text-red-700 text-sm">{errors.general}</p>
                      {errors.email === 'Email not verified' && (
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={isResending}
                          className="mt-2 text-sm text-green-600 hover:text-green-800 underline"
                        >
                          {isResending ? 'Sending...' : 'Resend verification email'}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 animate-fade-up delay-100">
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
                        disabled={loading}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2 animate-fade-up delay-200">
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
                        disabled={loading}
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

                  <div className="flex items-center justify-between mb-4 animate-fade-up delay-300">
                    <div className="flex items-center">
                      <Checkbox
                        id="remember-me"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="h-4 w-4 border-2 border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white rounded"
                        disabled={loading}
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <Link to="/auth/forgot-password/" className="text-sm text-green-600 hover:text-green-800">
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="animate-fade-up delay-400">
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-150 ease-in-out hover-lift"
                      disabled={loading}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </div>

                  <div className="text-center mt-6 animate-fade-up delay-500">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link to="/auth/registration/" className="font-medium text-green-600 hover:text-green-500">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-8 flex justify-center items-center space-x-6 animate-fade-up delay-600">
              <div className="flex items-center text-gray-500 text-sm">
                <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                <span>Secure Login</span>
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
