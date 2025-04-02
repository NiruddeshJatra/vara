import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error) {
      toast.error("Failed to send password reset email. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow pt-16">
          <div className="bg-gradient-to-b from-green-300 to-lime-100/20">
            <div className="container max-w-md mx-auto px-4 py-12">
              <div className="bg-gradient-to-b from-white to-lime-50 backdrop-blur-sm shadow-lg rounded-xl p-8 relative animate-fade-up">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h1>
                  <p className="text-gray-600 mb-6">
                    We have sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                  </p>
                  <Link to="/auth/login/">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Return to Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-16">
        <div className="bg-gradient-to-b from-green-300 to-lime-100/20">
          <div className="container max-w-md mx-auto px-4 py-12">
            <div className="bg-gradient-to-b from-white to-lime-50 backdrop-blur-sm shadow-lg rounded-xl p-8 relative animate-fade-up">
              <div className="relative z-10">
                <Link to="/auth/login/" className="inline-flex items-center text-sm text-green-600 hover:text-green-800 mb-6">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Login
                </Link>

                <div className="text-center mb-8 animate-fade-up">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
                  <p className="text-gray-600">
                    Enter your email address and we'll send you instructions to reset your password
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 animate-fade-up delay-100">
                    <Label htmlFor="email">Email Address</Label>
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
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="animate-fade-up delay-200">
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-150 ease-in-out hover-lift"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reset Instructions'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordForm; 