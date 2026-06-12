import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Phone, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from '@/components/ui/use-toast';
import authService from "@/services/auth.service";
import { OtpInput } from "@/components/auth/OtpInput";
import { PasswordStrengthBar } from "@/components/auth/PasswordStrengthBar";
import { phoneSchema, otpSchema, signupDetailsSchema } from "@/utils/validators";

type PhoneFormData = { phone_number: string };
type OtpFormData = { otp: string };
type DetailsFormData = {
  full_name: string;
  password: string;
  confirm_password: string;
  marketing_consent: boolean;
};

type SignupStep = 'phone' | 'otp' | 'details';

const Register = () => {
  const [step, setStep] = useState<SignupStep>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ephemeralToken, setEphemeralToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // OTP resend countdown
  useEffect(() => {
    if (step !== 'otp') return;
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    setCanResend(true);
  }, [resendTimer, step]);

  const phoneForm = useForm<PhoneFormData>({ resolver: zodResolver(phoneSchema) });
  const otpForm = useForm<OtpFormData>({ resolver: zodResolver(otpSchema) });
  const detailsForm = useForm<DetailsFormData>({
    resolver: zodResolver(signupDetailsSchema),
    defaultValues: { marketing_consent: false },
  });

  const otpValue = otpForm.watch('otp', '');
  const password = detailsForm.watch('password', '');

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const showApiError = (error: any, fallback: string) => {
    const errorMessage = error.response?.data?.message || fallback;
    const fieldErrors = error.response?.data?.data;
    let description = errorMessage;
    if (fieldErrors && typeof fieldErrors === 'object') {
      const firstField = Object.values(fieldErrors).find((v) => Array.isArray(v) && v.length);
      if (firstField) description = (firstField as string[])[0];
    }
    toast({ title: "Registration Error", description, variant: "destructive" });
  };

  const onSubmitPhone = async (data: PhoneFormData) => {
    setIsLoading(true);
    try {
      await authService.requestOtp(data.phone_number, 'signup');
      setPhoneNumber(data.phone_number);
      setResendTimer(300);
      setCanResend(false);
      setStep('otp');
      toast({ title: "OTP Sent", description: "OTP sent successfully!" });
    } catch (error: any) {
      showApiError(error, 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !phoneNumber) return;
    try {
      await authService.requestOtp(phoneNumber, 'signup');
      toast({ title: "OTP Sent", description: "OTP resent successfully!" });
      setResendTimer(300);
      setCanResend(false);
      otpForm.setValue('otp', '');
    } catch (error: any) {
      showApiError(error, 'Failed to resend OTP');
    }
  };

  const onSubmitOtp = async (data: OtpFormData) => {
    setIsLoading(true);
    try {
      const token = await authService.verifyOtp(phoneNumber, data.otp, 'signup');
      setEphemeralToken(token);
      setStep('details');
      toast({ title: "Verified", description: "OTP verified successfully!" });
    } catch (error: any) {
      showApiError(error, 'OTP verification failed');
      otpForm.setValue('otp', '');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitDetails = async (data: DetailsFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.signupComplete(ephemeralToken, {
        full_name: data.full_name,
        password: data.password,
        marketing_consent: data.marketing_consent,
      });

      login(response.access_token, response.user);
      toast({ title: "Success", description: "Account created successfully!" });

      if (!response.user.profile_completed) {
        toast({
          title: "Complete your profile",
          description: "Complete your profile to start renting",
        });
      }

      navigate('/advertisements', { replace: true });
    } catch (error: any) {
      showApiError(error, 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const stepHeader = {
    phone: { title: 'Create Account', subtitle: 'Enter your phone number to get started' },
    otp: { title: 'Verify Your Number', subtitle: `Enter the 6-digit code sent to ${phoneNumber}` },
    details: { title: 'Almost There!', subtitle: 'Set up your account details' },
  }[step];

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
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{stepHeader.title}</h1>
                  <p className="text-gray-600">{stepHeader.subtitle}</p>
                </div>

                {step === 'phone' && (
                  <form onSubmit={phoneForm.handleSubmit(onSubmitPhone)} className="space-y-6">
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
                          className={`pl-10 ${phoneForm.formState.errors.phone_number ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                          {...phoneForm.register('phone_number')}
                        />
                      </div>
                      {phoneForm.formState.errors.phone_number && (
                        <p className="text-red-500 text-xs mt-1">{phoneForm.formState.errors.phone_number.message}</p>
                      )}
                      <p className="text-xs text-gray-500">We'll send a 6-digit OTP to this number</p>
                    </div>

                    <div className="animate-fade-up delay-200">
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-150 ease-in-out hover-lift"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Sending...' : 'Send OTP'}
                      </Button>
                    </div>

                    <div className="text-center mt-6 animate-fade-up delay-300">
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/auth/login/" className="font-medium text-green-600 hover:text-green-500">
                          Sign in
                        </a>
                      </p>
                    </div>
                  </form>
                )}

                {step === 'otp' && (
                  <form onSubmit={otpForm.handleSubmit(onSubmitOtp)} className="space-y-6">
                    <div className="animate-fade-up delay-100">
                      <OtpInput
                        value={otpValue}
                        onChange={(value) => otpForm.setValue('otp', value)}
                      />
                      {otpForm.formState.errors.otp && (
                        <p className="mt-2 text-xs text-red-500 text-center">
                          {otpForm.formState.errors.otp.message}
                        </p>
                      )}
                    </div>

                    <div className="text-center animate-fade-up delay-200">
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <p className="text-gray-500 text-sm">Resend OTP in {formatTime(resendTimer)}</p>
                      )}
                    </div>

                    <div className="animate-fade-up delay-300">
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-150 ease-in-out hover-lift"
                        disabled={isLoading || otpValue.length !== 6}
                      >
                        {isLoading ? 'Verifying...' : 'Verify'}
                      </Button>
                    </div>

                    <div className="text-center mt-6 animate-fade-up delay-400">
                      <button
                        type="button"
                        onClick={() => setStep('phone')}
                        className="text-sm text-gray-600 hover:text-gray-700 transition-colors"
                      >
                        &larr; Change number
                      </button>
                    </div>
                  </form>
                )}

                {step === 'details' && (
                  <form onSubmit={detailsForm.handleSubmit(onSubmitDetails)} className="space-y-6">
                    <div className="space-y-2 animate-fade-up delay-100">
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="full_name"
                          type="text"
                          placeholder="Your full name"
                          className={`pl-10 ${detailsForm.formState.errors.full_name ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                          {...detailsForm.register('full_name')}
                        />
                      </div>
                      {detailsForm.formState.errors.full_name && (
                        <p className="text-red-500 text-xs mt-1">{detailsForm.formState.errors.full_name.message}</p>
                      )}
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
                          placeholder="Create a password"
                          className={`pl-10 ${detailsForm.formState.errors.password ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                          {...detailsForm.register('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {detailsForm.formState.errors.password && (
                        <p className="text-red-500 text-xs mt-1">{detailsForm.formState.errors.password.message}</p>
                      )}
                      <PasswordStrengthBar password={password} />
                    </div>

                    <div className="space-y-2 animate-fade-up delay-300">
                      <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className={`pl-10 ${detailsForm.formState.errors.confirm_password ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                          {...detailsForm.register('confirm_password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {detailsForm.formState.errors.confirm_password && (
                        <p className="text-red-500 text-xs mt-1">{detailsForm.formState.errors.confirm_password.message}</p>
                      )}
                    </div>

                    <div className="flex items-start animate-fade-up delay-400">
                      <input
                        type="checkbox"
                        id="marketing_consent"
                        className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        disabled={isLoading}
                        {...detailsForm.register('marketing_consent')}
                      />
                      <label htmlFor="marketing_consent" className="ml-2 text-sm text-gray-600">
                        I'd like to receive updates and offers from Bhara
                      </label>
                    </div>

                    <div className="animate-fade-up delay-500">
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-150 ease-in-out hover-lift"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-center items-center space-x-6 animate-fade-up delay-600">
              <div className="flex items-center text-gray-500 text-sm">
                <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                <span>Secure Signup</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
