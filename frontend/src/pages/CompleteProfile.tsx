import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Camera, IdCard, Mail, MapPin, ShieldCheck, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "@/components/ui/use-toast";
import Footer from "@/components/home/Footer";
import NavBar from "@/components/home/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/services/auth.service";
import { profileStep1Schema, profileStep2Schema } from "@/utils/validators";
import { BD_DISTRICTS, getThanas } from "@/utils/bd-districts";
import { useQueryClient } from '@tanstack/react-query';

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
    toast({ title: "Error", description, variant: "destructive" });
  };

  // Profile picture dropzone
  const onDropProfile = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Validation Error", description: "Profile picture must be under 5MB", variant: "destructive" });
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast({ title: "Validation Error", description: "Please upload an image file", variant: "destructive" });
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
      toast({ title: "Validation Error", description: "Please upload an image file", variant: "destructive" });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Validation Error", description: "Image must be under 10MB", variant: "destructive" });
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
      toast({ title: "Success", description: "Profile updated successfully!" });
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } catch (error: any) {
      showApiError(error, 'Failed to update profile');
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
      toast({ title: "Success", description: "Documents submitted! We'll notify you once reviewed." });
      navigate("/advertisements", { replace: true });
    } catch (error: any) {
      showApiError(error, 'Failed to submit documents');
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
                Complete Your Profile
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Please provide the following information to complete your
                profile
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
                    Contact Details
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
                    Verification
                  </span>
                </div>
              </div>
            </div>

            {currentStep === 1 && (
              <form onSubmit={step1Form.handleSubmit(onSubmitStep1)} className="space-y-6 animate-fade-up delay-200">
                {/* Profile Picture */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
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
                        <p className="text-sm text-gray-600">Click to change photo</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {profileDropzone.isDragActive ? 'Drop photo here' : 'Click to upload photo'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Optional but recommended</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="date_of_birth" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      {...step1Form.register('date_of_birth')}
                      type="date"
                      id="date_of_birth"
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        step1Form.formState.errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {step1Form.formState.errors.date_of_birth && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {step1Form.formState.errors.date_of_birth.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Must be 18 or older</p>
                </div>

                {/* District */}
                <div>
                  <label htmlFor="district" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      {...step1Form.register('district')}
                      id="district"
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none ${
                        step1Form.formState.errors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    >
                      <option value="">Select district</option>
                      {BD_DISTRICTS.map((district) => (
                        <option key={district.name} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {step1Form.formState.errors.district && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {step1Form.formState.errors.district.message}
                    </p>
                  )}
                </div>

                {/* Thana */}
                <div>
                  <label htmlFor="thana" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Thana
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      {...step1Form.register('thana')}
                      id="thana"
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none ${
                        step1Form.formState.errors.thana ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting || !selectedDistrict}
                    >
                      <option value="">Select thana</option>
                      {getThanas(selectedDistrict).map((thana) => (
                        <option key={thana} value={thana}>
                          {thana}
                        </option>
                      ))}
                    </select>
                  </div>
                  {step1Form.formState.errors.thana && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {step1Form.formState.errors.thana.message}
                    </p>
                  )}
                </div>

                {/* Full Address */}
                <div>
                  <label htmlFor="full_address" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Full Address
                  </label>
                  <textarea
                    {...step1Form.register('full_address')}
                    id="full_address"
                    rows={3}
                    placeholder="House/Road/Area details"
                    className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                      step1Form.formState.errors.full_address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {step1Form.formState.errors.full_address && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {step1Form.formState.errors.full_address.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      {...step1Form.register('email')}
                      type="email"
                      id="email"
                      placeholder="For receipts and notifications"
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        step1Form.formState.errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {step1Form.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {step1Form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save & Continue'}
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
                    NID Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IdCard className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      {...step2Form.register("nid_number")}
                      id="nid_number"
                      type="text"
                      placeholder="Your NID/Passport/License number"
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        step2Form.formState.errors.nid_number ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {step2Form.formState.errors.nid_number && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {step2Form.formState.errors.nid_number.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Govt. ID Image
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
                          Upload your Govt. ID (NID front, Passport, or Driving License)
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {nidPreviewName ? `Selected: ${nidPreviewName}` : "PNG/JPG/WebP up to 10MB"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {step2Form.formState.errors.nid_image && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      {step2Form.formState.errors.nid_image.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Institutional ID (Optional)
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
                          Upload University or Office ID (optional)
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {instPreviewName ? `Selected: ${instPreviewName}` : "PNG/JPG/WebP up to 10MB"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-amber-700 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      Your documents are reviewed by Bhara within 24–48 hours.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/advertisements")}
                  className="w-full text-sm font-medium text-green-700 hover:text-green-800"
                  disabled={isSubmitting}
                >
                  Skip for now
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
