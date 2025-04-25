import { useLocation } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';

const VerifyEmailNotice = () => {
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email') || 'your email';
  const { resendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendVerificationEmail(email);
      toast({
        title: 'Verification Email Sent',
        description: 'Verification email sent successfully. Please check your inbox.',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend verification email.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md p-8 text-center">
          <MailCheck className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to {email}.
            Please check your inbox and click the link to activate your account.
          </p>
          <div className="text-sm text-gray-500">
            Didn't receive the email?
            <button
              type="button"
              className="text-green-600 hover:underline ml-1 bg-transparent border-none p-0 cursor-pointer"
              style={{ textDecoration: 'underline', color: '#16a34a', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              onClick={handleResend}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;