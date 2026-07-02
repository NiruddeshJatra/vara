import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Phone, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import { toast } from '@/components/ui/use-toast';
import authService from "@/services/auth.service";
import { OtpInput } from "@/components/auth/OtpInput";
import { phoneSchema, otpSchema } from "@/utils/validators";
import { getApiError } from "@/utils/apiError";
import { useTranslation } from "react-i18next";

const passwordResetSchema = z.object({
  password: z
    .string()
    .min(8, "validation.passwordMin")
    .regex(/[A-Za-z]/, "validation.passwordLetter")
    .regex(/\d/, "validation.passwordNumber"),
});

type PhoneFormData = { phone_number: string };
type OtpFormData = { otp: string };
type ResetFormData = z.infer<typeof passwordResetSchema>;

type ResetStage = 'phone' | 'otp' | 'reset';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [stage, setStage] = useState<ResetStage>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ephemeralToken, setEphemeralToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (stage !== 'otp') return;
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    setCanResend(true);
  }, [resendTimer, stage]);

  const phoneForm = useForm<PhoneFormData>({ resolver: zodResolver(phoneSchema) });
  const otpForm = useForm<OtpFormData>({ resolver: zodResolver(otpSchema) });
  const resetForm = useForm<ResetFormData>({ resolver: zodResolver(passwordResetSchema) });

  const otpValue = otpForm.watch('otp', '');

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const showApiError = (error: any, fallback: string) => {
    const message = getApiError(error);
    toast({
      title: t('auth.forgot.errorTitle'),
      description: message === 'Something went wrong' ? fallback : message,
      variant: "destructive",
    });
  };

  const onSubmitPhone = async (data: PhoneFormData) => {
    setIsLoading(true);
    try {
      await authService.requestOtp(data.phone_number, 'password_reset');
      setPhoneNumber(data.phone_number);
      setResendTimer(300);
      setCanResend(false);
      setStage('otp');
      toast({ title: t('auth.otpSentTitle'), description: t('auth.otpSentDesc') });
    } catch (error: any) {
      showApiError(error, t('auth.otpSendFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !phoneNumber) return;
    try {
      await authService.requestOtp(phoneNumber, 'password_reset');
      toast({ title: t('auth.otpSentTitle'), description: t('auth.otpResentDesc') });
      setResendTimer(300);
      setCanResend(false);
      otpForm.setValue('otp', '');
    } catch (error: any) {
      showApiError(error, t('auth.otpResendFailed'));
    }
  };

  const onSubmitOtp = async (data: OtpFormData) => {
    setIsLoading(true);
    try {
      const token = await authService.verifyOtp(phoneNumber, data.otp, 'password_reset');
      setEphemeralToken(token);
      setStage('reset');
      toast({ title: t('auth.otpVerifiedTitle'), description: t('auth.otpVerifiedDesc') });
    } catch (error: any) {
      showApiError(error, t('auth.otpVerifyFailed'));
      otpForm.setValue('otp', '');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReset = async (data: ResetFormData) => {
    setIsLoading(true);
    try {
      await authService.passwordResetComplete(ephemeralToken, data.password);
      toast({ title: t('common.toastSuccess'), description: t('auth.forgot.successToast') });
      navigate('/auth/login/', { replace: true });
    } catch (error: any) {
      showApiError(error, t('auth.forgot.resetFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const stageHeader = {
    phone: { title: t('auth.forgot.phoneTitle'), subtitle: t('auth.forgot.phoneSubtitle') },
    otp: { title: t('auth.forgot.otpTitle'), subtitle: t('auth.otpSentTo', { phone: phoneNumber }) },
    reset: { title: t('auth.forgot.resetTitle'), subtitle: t('auth.forgot.resetSubtitle') },
  }[stage];

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
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{stageHeader.title}</h1>
                  <p className="text-gray-600">{stageHeader.subtitle}</p>
                </div>

                {stage === 'phone' && (
                  <form onSubmit={phoneForm.handleSubmit(onSubmitPhone)} className="space-y-6">
                    <div className="space-y-2 animate-fade-up delay-100">
                      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                        {t('auth.phoneNumber')}
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
                        <p className="text-red-500 text-xs mt-1">{t(phoneForm.formState.errors.phone_number.message as string)}</p>
                      )}
                      <p className="text-xs text-gray-500">{t('auth.otpHint')}</p>
                    </div>

                    <div className="animate-fade-up delay-200">
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-150 ease-in-out hover-lift"
                        disabled={isLoading}
                      >
                        {isLoading ? t('auth.sendingOtp') : t('auth.sendOtp')}
                      </Button>
                    </div>

                    <div className="text-center mt-6 animate-fade-up delay-300">
                      <p className="text-sm text-gray-600">
                        {t('auth.forgot.remembered')}{" "}
                        <Link to="/auth/login/" className="font-medium text-green-600 hover:text-green-500">
                          {t('auth.register.signinLink')}
                        </Link>
                      </p>
                    </div>
                  </form>
                )}

                {stage === 'otp' && (
                  <form onSubmit={otpForm.handleSubmit(onSubmitOtp)} className="space-y-6">
                    <div className="animate-fade-up delay-100">
                      <OtpInput
                        value={otpValue}
                        onChange={(value) => otpForm.setValue('otp', value)}
                      />
                      {otpForm.formState.errors.otp && (
                        <p className="mt-2 text-xs text-red-500 text-center">
                          {t(otpForm.formState.errors.otp.message as string)}
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
                          {t('auth.resendOtp')}
                        </button>
                      ) : (
                        <p className="text-gray-500 text-sm">{t('auth.resendOtpIn', { time: formatTime(resendTimer) })}</p>
                      )}
                    </div>

                    <div className="animate-fade-up delay-300">
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-150 ease-in-out hover-lift"
                        disabled={isLoading || otpValue.length !== 6}
                      >
                        {isLoading ? t('auth.verifying') : t('auth.verify')}
                      </Button>
                    </div>

                    <div className="text-center mt-6 animate-fade-up delay-400">
                      <button
                        type="button"
                        onClick={() => setStage('phone')}
                        className="text-sm text-gray-600 hover:text-gray-700 transition-colors"
                      >
                        &larr; {t('auth.changeNumber')}
                      </button>
                    </div>
                  </form>
                )}

                {stage === 'reset' && (
                  <form onSubmit={resetForm.handleSubmit(onSubmitReset)} className="space-y-6">
                    <div className="space-y-2 animate-fade-up delay-100">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        {t('auth.forgot.newPassword')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t('auth.forgot.newPasswordPlaceholder')}
                          className={`pl-10 ${resetForm.formState.errors.password ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                          {...resetForm.register('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {resetForm.formState.errors.password && (
                        <p className="text-red-500 text-xs mt-1">{t(resetForm.formState.errors.password.message as string)}</p>
                      )}
                    </div>

                    <div className="animate-fade-up delay-200">
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-150 ease-in-out hover-lift"
                        disabled={isLoading}
                      >
                        {isLoading ? t('auth.forgot.submitting') : t('auth.forgot.submit')}
                      </Button>
                    </div>

                    <div className="text-center mt-6 animate-fade-up delay-300">
                      <p className="text-sm text-gray-600">
                        {t('auth.forgot.backTo')}{" "}
                        <Link to="/auth/login/" className="font-medium text-green-600 hover:text-green-500">
                          {t('auth.register.signinLink')}
                        </Link>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-center items-center space-x-6 animate-fade-up delay-600">
              <div className="flex items-center text-gray-500 text-sm">
                <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                <span>{t('auth.forgot.secureBadge')}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
