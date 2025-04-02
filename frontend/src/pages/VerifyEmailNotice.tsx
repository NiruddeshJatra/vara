import { Link, useLocation } from 'react-router-dom';
import { MailCheck } from 'lucide-react';

const VerifyEmailNotice = () => {
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email') || 'your email';

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
            <Link to="/resend-verification" className="text-green-600 hover:underline ml-1">
              Resend verification email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;