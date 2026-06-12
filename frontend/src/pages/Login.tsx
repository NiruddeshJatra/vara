import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from '@/components/ui/use-toast';
import authService from "@/services/auth.service";
import { loginSchema } from "@/utils/validators";

type FormData = {
  phone_number: string;
  password: string;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data.phone_number, data.password);

      login(response.access_token, response.user);
      toast({
        title: "Success",
        description: "Login successful!",
        variant: "default"
      });

      if (!response.user.profile_completed) {
        toast({
          title: "Complete your profile",
          description: "Complete your profile to start renting",
        });
      }

      navigate('/advertisements', { replace: true });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      const fieldErrors = error.response?.data?.data;
      toast({
        title: 'Login Error',
        description: fieldErrors?.detail || fieldErrors?.phone_number?.[0] || errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2 animate-fade-up delay-100">
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="phone_number"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        className={`pl-10 ${errors.phone_number ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                        {...register('phone_number')}
                      />
                    </div>
                    {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>}
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
                        placeholder="••••••••"
                        className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center justify-end mb-4 animate-fade-up delay-300">
                    <Link
                      to="/auth/forgot-password/"
                      className="text-sm text-green-600 hover:text-green-800"
                      style={{ textDecoration: 'underline', color: '#16a34a' }}
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="animate-fade-up delay-400">
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-150 ease-in-out hover-lift"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </div>

                  <div className="text-center mt-6 animate-fade-up delay-500">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <a href="/auth/registration/" className="font-medium text-green-600 hover:text-green-500">
                        Sign up
                      </a>
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
