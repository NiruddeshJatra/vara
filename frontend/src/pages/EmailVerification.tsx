import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MailCheck, AlertCircle, Loader2 } from 'lucide-react';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';

const EmailVerification = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const { verifyEmail } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useParams();
  const hasAttemptedVerification = useRef(false);

  useEffect(() => {
    const verifyEmailWithKey = async () => {
      try {
        if (!token) {
          setStatus('error');
          setMessage('Invalid verification link. No verification key found.');
          return;
        }

        // Prevent multiple verification attempts
        if (hasAttemptedVerification.current) {
          return;
        }

        hasAttemptedVerification.current = true;
        await verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified!');

        // Redirect to advertisements page after 5 seconds
        setTimeout(() => {
          navigate('/advertisements');
        }, 5000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.detail || 'Email verification failed. Please try again or contact support.');
      }
    };

    verifyEmailWithKey();
  }, [token, verifyEmail, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow pt-20 pb-20 bg-gradient-to-b from-green-300 to-lime-100/20">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden px-8 py-20 animate-fade-up">
          {status === 'loading' && (
            <div className="text-center">
              <Loader2 className="h-16 w-16 text-green-600 mx-auto mb-6 animate-spin" />
              <h1 className="text-2xl font-bold mb-4">Verifying Your Email</h1>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <MailCheck className="h-16 w-16 text-green-600 mx-auto mb-6 animate-bounce" />
              <h1 className="text-2xl font-bold mb-4">Email Verified!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-4">You will be redirected to the advertisements page shortly.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => navigate('/resend-verification')}
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  Resend Verification
                </Button>
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmailVerification;
