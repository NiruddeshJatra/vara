import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import config from "@/config";
import authService from "@/services/auth.service";
import { toast } from "sonner";

const VerifyEmailSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setCurrentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get verification token from URL
        const token = searchParams.get("token");

        if (!token) {
          throw new Error("Missing verification token in URL");
        }

        // 1. Verify email with backend
        const verificationResponse = await authService.verifyEmail(token);

        // 2. Get tokens from verification response (adjust based on your API response)
        const accessToken = verificationResponse.access;
        const refreshToken = verificationResponse.refresh;

        if (!accessToken || !refreshToken) {
          throw new Error("Failed to retrieve authentication tokens");
        }

        // 3. Store tokens
        localStorage.setItem(config.auth.tokenStorageKey, accessToken);
        localStorage.setItem(config.auth.refreshTokenStorageKey, refreshToken);

        // 4. Get user profile
        const userResponse = await axios.get(
          `${config.baseUrl}${config.auth.loginEndpoint}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // 5. Update auth state
        setCurrentUser(userResponse.data);
        localStorage.setItem(
          config.auth.userStorageKey,
          JSON.stringify(userResponse.data)
        );

        // 6. Redirect to dashboard
        toast.success("Email verified successfully! Welcome to your account.");
        navigate("/advertisements");
      } catch (error: any) {
        console.error("Verification error:", error);
        setError(
          error.response?.data?.detail ||
            error.message ||
            "Email verification failed. Please try again."
        );
        toast.error("Verification failed. Please contact support.");
        navigate("/login?verified=0");
      } finally {
        setIsLoading(false);
      }
    };

    handleEmailVerification();
  }, [navigate, searchParams, setCurrentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full text-center">
          <div className="animate-pulse mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-500 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verifying Email...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your email
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full text-center">
        {error ? (
          <>
            <div className="mb-4 text-red-500">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </>
        ) : (
          <>
            <div className="mb-4 text-green-500">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-4">
              Your account has been successfully verified.
            </p>
            <button
              onClick={() => navigate("/advertisements")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailSuccess;
