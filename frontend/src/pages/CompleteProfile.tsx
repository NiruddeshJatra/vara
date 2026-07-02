import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Camera, IdCard, Mail, ShieldCheck, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "@/components/ui/use-toast";
import Footer from "@/components/home/Footer";
import NavBar from "@/components/home/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/services/auth.service";
import { profileStep1Schema, profileStep2Schema } from "@/utils/validators";
import { BD_DISTRICTS, getThanas } from "@/utils/bd-districts";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { formatDateLong } from "@/utils/formatDate";
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

type Step1FormData = {
  date_of_birth: string;
  district: string;
  thana: string;
  full_address: string;
  email?: string;
  profile_picture?: File | null;
};

type Step2FormData = {
  nid_number: string;
  nid_image: File | null;
  institutional_id_image?: File | null;
};

const CompleteProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [nidPreviewName, setNidPreviewName] = useState<string | null>(null);
  const [instPreviewName, setInstPreviewName] = useState<string | null>(null);

  // Skip step 1 if personal info is already complete
  useEffect(() => {
    if (user?.profile_completed) {
      setCurrentStep(2);
    }
  }, [user]);

  const step1Form = useForm<Step1FormData>({ resolver: zodResolver(profileStep1Schema) });
  const step2Form = useForm<Step2FormData>({
    resolver: zodResolver(profileStep2Schema),
    defaultValues: { nid_image: null, institutional_id_image: null },
  });

  const selectedDistrict = step1Form.watch('district', '');
  const nidFile = step2Form.watch('nid_image');
  const instFile = step2Form.watch('institutional_id_image');

  useEffect(() => {
    setNidPreviewName(nidFile?.name ?? null);
  }, [nidFile]);

  useEffect(() => {
    setInstPreviewName(instFile?.name ?? null);
  }, [instFile]);

  const showApiError = (error: any, fallback: string) => {
    const errorMessage = error.response?.data?.message || fallback;
    const fieldErrors = error.response?.data?.data;
    let description = errorMessage;
    if (fieldErrors && typeof fieldErrors === 'object') {
      const firstField = Object.values(fieldErrors).find((v) => Array.isArray(v) && v.length);
      if (firstField) description = (firstField as string[])[0];
    }
    toast({ title: t('common.toastError'), description, variant: "destructive" });
  };

  // Profile picture dropzone
  const onDropProfile = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: t('common.toastValidationError'), description: t('completeProfile.pictureTooBig'), variant: "destructive" });
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast({ title: t('common.toastValidationError'), description: t('completeProfile.notAnImage'), variant: "destructive" });
      return;
    }
    step1Form.setValue('profile_picture', file);
    const reader = new FileReader();
    reader.onload = () => setProfilePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, [step1Form]);

  const profileDropzone = useDropzone({
    onDrop: onDropProfile,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    multiple: false,
  });

  const validateImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: t('common.toastValidationError'), description: t('completeProfile.notAnImage'), variant: "destructive" });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: t('common.toastValidationError'), description: t('completeProfile.imageTooBig'), variant: "destructive" });
      return false;
    }
    return true;
  };

  const onDropNid = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !validateImage(file)) return;
    step2Form.setValue("nid_image", file, { shouldValidate: true });
  }, [step2Form]);

  const onDropInst = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !validateImage(file)) return;
    step2Form.setValue("institutional_id_image", file, { shouldValidate: true });
  }, [step2Form]);

  const nidDropzone = useDropzone({
    onDrop: onDropNid,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] },
    maxFiles: 1,
    multiple: false,
  });

  const instDropzone = useDropzone({
    onDrop: onDropInst,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] },
    maxFiles: 1,
    multiple: false,
  });

  const onSubmitStep1 = async (data: Step1FormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'profile_picture' && value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value as string);
        }
      });

      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: t('common.toastSuccess'), description: t('completeProfile.step1Success') });
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } catch (error: any) {
      showApiError(error, t('completeProfile.step1Failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitStep2 = async (data: Step2FormData) => {
    if (!data.nid_image) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('nid_number', data.nid_number);
      formData.append('nid_image', data.nid_image);
      if (data.institutional_id_image) {
        formData.append('institutional_id_image', data.institutional_id_image);
      }

      await authService.submitIdentity(formData);
      const refreshedUser = await authService.getProfile();
      setUser(refreshedUser);
      toast({ title: t('common.toastSuccess'), description: t('completeProfile.step2Success') });
      navigate("/advertisements", { replace: true });
    } catch (error: any) {
      showApiError(error, t('completeProfile.step2Failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow pt-14">
        <div className="bg-gradient-to-b from-green-300 to-lime-100/20 pt-4 sm:pt-6 md:pt-8 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-lime-50 rounded-lg shadow-subtle p-4 sm:p-6 md:p-8 animate-fade-up">
            <div className="text-center mb-4 sm:mb-6 md:mb-8 animate-fade-up">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {t('profileCompletion.title')}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {t('completeProfile.subtitle')}
              </p>
            </div>

            <div className="mb-8 mx-4">
              <div className="flex items-center justify-between max-w-md mx-auto">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] md:text-xs font-bold
                      ${
                        currentStep >= 1
                          ? "bg-green-600 text-white ring-1 sm:ring-2 ring-green-100"
                          : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    1
                  </div>
                  <span className="text-xs sm:text-sm md:text-base font-medium mt-2 text-green-800">
                    {t('completeProfile.step1Label')}
                  </span>
                </div>

                <div className="flex-1 h-1 mx-2">
                  <div
                    className={`h-full transition-all duration-500 ease-in-out ${
                      currentStep >= 2 ? "bg-green-500" : "bg-gray-200"
                    }`}
                  ></div>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] md:text-xs font-bold transition-all duration-300 ${
                      currentStep >= 2
                        ? "bg-green-600 text-white ring-1 sm:ring-2 ring-green-100"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs sm:text-sm md:text-base font-medium mt-2 text-green-800">
                    {t('completeProfile.step2Label')}
                  </span>
                </div>
              </div>
            </div>

            {currentStep === 1 && (
              <form onSubmit={step1Form.handleSubmit(onSubmitStep1)} className="space-y-6 animate-fade-up delay-200">
                {/* Profile Picture */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    {t('completeProfile.profilePicture')}
                  </label>
                  <div
                    {...profileDropzone.getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      profileDropzone.isDragActive
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input {...profileDropzone.getInputProps()} />
                    {profilePreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={profilePreview}
                          alt="Profile preview"
                          className="w-24 h-24 rounded-full object-cover mb-2"
                        />
                        <p className="text-sm text-gray-600">{t('completeProfile.changePhoto')}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {profileDropzone.isDragActive ? t('completeProfile.dropPhoto') : t('completeProfile.uploadPhoto')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{t('completeProfile.optionalRecommended')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="date_of_birth" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    {t('completeProfile.dateOfBirth')}
                  </label>
                  <Controller
                    control={step1Form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            disabled={isSubmitting}
                            className={`relative w-full flex items-center pl-10 pr-3 py-3 border rounded-lg text-left text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 ${
                              step1Form.formState.errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                            } ${field.value ? 'text-gray-900' : 'text-gray-500'}`}
                          >
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-4 w-4 text-gray-400" />
                            </span>
                            {field.value
                              ? formatDateLong(field.value)
                              : t('completeProfile.selectDate')}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarPicker
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) =>
                              field.onChange(
                                date
                                  ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                                  : ''
                              )
                            }
                            captionLayout="dropdown-buttons"
                            fromYear={1940}
                            toYear={new Date().getFullYear() - 18}
                            defaultMonth={
                              field.value
                                ? new Date(field.value)
                                : new Date(new Date().getFullYear() - 18, 0)
                            }
                            disabled={(date) => date > new Date()}
                            initialFocus
                            classNames={{
                              day_selected:
                                'bg-green-600 text-white hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white rounded-md',
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {step1Form.formState.errors.date_of_birth && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {t(step1Form.formState.errors.date_of_birth.message as string)}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">{t('completeProfile.adultHint')}</p>
                </div>

                {/* District */}
                <div>
                  <label htmlFor="district" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    {t('completeProfile.district')}
                  </label>
                  <Controller
                    control={step1Form.control}
                    name="district"
                    render={({ field }) => (
                      <Select
                        value={field.value || ''}
                        onValueChange={(val) => {
                          field.onChange(val);
                          step1Form.setValue('thana', '');
                        }}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          className={`h-11 ${step1Form.formState.errors.district ? 'border-red-500' : ''}`}
                        >
                          <SelectValue placeholder={t('completeProfile.selectDistrict')} />
                        </SelectTrigger>
                        <SelectContent>
                          {BD_DISTRICTS.map((district) => (
                            <SelectItem key={district.name} value={district.name}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {step1Form.formState.errors.district && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {t(step1Form.formState.errors.district.message as string)}
                    </p>
                  )}
                </div>

                {/* Thana */}
                <div>
                  <label htmlFor="thana" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    {t('completeProfile.thana')}
                  </label>
                  <Controller
                    control={step1Form.control}
                    name="thana"
                    render={({ field }) => (
                      <Select
                        value={field.value || ''}
                        onValueChange={field.onChange}
                        disabled={isSubmitting || !selectedDistrict}
                      >
                        <SelectTrigger
                          className={`h-11 ${step1Form.formState.errors.thana ? 'border-red-500' : ''}`}
                        >
                          <SelectValue placeholder={t('completeProfile.selectThana')} />
                        </SelectTrigger>
                        <SelectContent>
                          {getThanas(selectedDistrict).map((thana) => (
                            <SelectItem key={thana} value={thana}>
                              {thana}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {step1Form.formState.errors.thana && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {t(step1Form.formState.errors.thana.message as string)}
                    </p>
                  )}
                </div>

                {/* Full Address */}
                <div>
                  <label htmlFor="full_address" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    {t('completeProfile.fullAddress')}
                  </label>
                  <textarea
                    {...step1Form.register('full_address')}
                    id="full_address"
                    rows={3}
                    placeholder={t('completeProfile.addressPlaceholder')}
                    className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                      step1Form.formState.errors.full_address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {step1Form.formState.errors.full_address && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {t(step1Form.formState.errors.full_address.message as string)}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    {t('completeProfile.emailOptional')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      {...step1Form.register('email')}
                      type="email"
                      id="email"
                      placeholder={t('completeProfile.emailPlaceholder')}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        step1Form.formState.errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {step1Form.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {t(step1Form.formState.errors.email.message as string)}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('completeProfile.saving') : t('completeProfile.saveContinue')}
                </button>
              </form>
            )}

            {currentStep === 2 && (
              <form onSubmit={step2Form.handleSubmit(onSubmitStep2)} className="space-y-6 animate-fade-up delay-200">
                <div>
                  <label
                    htmlFor="nid_number"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('completeProfile.nidNumber')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IdCard className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      {...step2Form.register("nid_number")}
                      id="nid_number"
                      type="text"
                      placeholder={t('completeProfile.nidPlaceholder')}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        step2Form.formState.errors.nid_number ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {step2Form.formState.errors.nid_number && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {t(step2Form.formState.errors.nid_number.message as string)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    {t('completeProfile.nidImage')}
                  </label>
                  <div
                    {...nidDropzone.getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
                      nidDropzone.isDragActive
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input {...nidDropzone.getInputProps()} />
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700 font-medium">
                          {t('completeProfile.nidUploadHint')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {nidPreviewName ? t('completeProfile.selectedFile', { name: nidPreviewName }) : t('completeProfile.imageFormats')}
                        </p>
                      </div>
                    </div>
                  </div>
                  {step2Form.formState.errors.nid_image && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {t(step2Form.formState.errors.nid_image.message as string)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    {t('completeProfile.institutionalId')}
                  </label>
                  <div
                    {...instDropzone.getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
                      instDropzone.isDragActive
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input {...instDropzone.getInputProps()} />
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700 font-medium">
                          {t('completeProfile.institutionalUploadHint')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {instPreviewName ? t('completeProfile.selectedFile', { name: instPreviewName }) : t('completeProfile.imageFormats')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-amber-700 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      {t('completeProfile.reviewNotice')}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('completeProfile.submitting') : t('completeProfile.submitVerification')}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/advertisements")}
                  className="w-full text-sm font-medium text-green-700 hover:text-green-800"
                  disabled={isSubmitting}
                >
                  {t('completeProfile.skipForNow')}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompleteProfile;
