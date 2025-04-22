import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Label } from "@/components/ui/label";

const ResetPasswordForm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { confirmPasswordReset, loading } = useAuth();
  const [passwords, setPasswords] = useState({
    password1: "",
    password2: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwords.password1 !== passwords.password2) {
      setError("Passwords do not match");
      return;
    }

    if (passwords.password1.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      await confirmPasswordReset(uid!, token!, passwords.password1, passwords.password2);
      toast({
        title: 'Password Reset Successful',
        description: 'Password reset successful. Please log in with your new password.',
        variant: 'success',
      });
      navigate("/auth/login/");
    } catch (error) {
      toast({
        title: 'Validation Error',
        description: 'Failed to reset password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-16">
        <div className="bg-gradient-to-b from-green-300 to-lime-100/20">
          <div className="container max-w-md mx-auto px-4 py-12">
            <div className="bg-gradient-to-b from-white to-lime-50 backdrop-blur-sm shadow-lg rounded-xl p-8 relative animate-fade-up">
              <div className="text-center mb-8 animate-fade-up">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Set New Password</h1>
                <p className="text-gray-600">
                  Please enter your new password below
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 animate-fade-in">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 animate-fade-up delay-100">
                  <Label htmlFor="password1">New Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password1"
                      type={showPassword ? "text" : "password"}
                      value={passwords.password1}
                      onChange={(e) => setPasswords({ ...passwords, password1: e.target.value })}
                      placeholder="••••••••"
                      className="pl-10"
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
                </div>

                <div className="space-y-2 animate-fade-up delay-200">
                  <Label htmlFor="password2">Confirm New Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password2"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwords.password2}
                      onChange={(e) => setPasswords({ ...passwords, password2: e.target.value })}
                      placeholder="••••••••"
                      className="pl-10"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="animate-fade-up delay-300">
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-150 ease-in-out hover-lift"
                    disabled={loading}
                  >
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordForm; 