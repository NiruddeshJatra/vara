import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/home/Footer";
import NavBar from "@/components/home/NavBar";
import ContactDetailsStep from "@/components/auth/steps/ContactDetailsStep";
import NationalIdStep from "@/components/auth/steps/NationalIdStep";
import { ProfileFormData, ProfileFormErrors } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";
import config from "@/config";
import {
  validateProfileForm,
  validatePhoneNumber,
  validateLocation,
  validateDateOfBirth,
  validateNationalId,
} from "@/utils/validations/auth.validations";
import authService from "@/services/auth.service";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { updateProfile, loading: authLoading, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    location: "",
    dateOfBirth: "",
    nationalIdNumber: "",
    nationalIdFront: null,
    nationalIdBack: null,
  });
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isCheckingId, setIsCheckingId] = useState(false);

  // Redirect if profile is already complete
  useEffect(() => {
    if (user?.profileCompleted === true) {
      toast.info("Your profile is already complete.");
      navigate("/profile");
    }
  }, [user, navigate]);

  const handleInputChange = (
    eventOrValue: React.ChangeEvent<HTMLInputElement> | Partial<ProfileFormData>
  ) => {
    if ("target" in eventOrValue) {
      const { name, value } = eventOrValue.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, ...eventOrValue }));
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "nationalIdFront" | "nationalIdBack"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const validateForm = () => {
    return validateProfileForm(formData);
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      // Only validate contact details fields
      if (!formData.firstName) errors.firstName = "First name is required";
      if (!formData.lastName) errors.lastName = "Last name is required";

      const phoneError = validatePhoneNumber(formData.phoneNumber);
      if (phoneError) errors.phoneNumber = phoneError;

      const locationError = validateLocation(formData.location);
      if (locationError) errors.location = locationError;

      const dateOfBirthError = validateDateOfBirth(formData.dateOfBirth);
      if (dateOfBirthError) errors.dateOfBirth = dateOfBirthError;
    } else if (currentStep === 2) {
      // Only validate national ID fields
      const nationalIdError = validateNationalId(formData.nationalIdNumber);
      if (nationalIdError) errors.nationalIdNumber = nationalIdError;

      if (!formData.nationalIdFront)
        errors.nationalIdFront = "National ID front photo is required";
      if (!formData.nationalIdBack)
        errors.nationalIdBack = "National ID back photo is required";
    }

    return errors;
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCurrentStep();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (currentStep === 2) {
        // Check for duplicate national ID before submitting
        try {
          setIsCheckingId(true);
          const isDuplicate = await authService.checkNationalId(
            formData.nationalIdNumber
          );
          console.log("National ID check result:", isDuplicate);

          if (isDuplicate) {
            setErrors({
              ...errors,
              nationalIdNumber:
                "This National ID is already registered with another account",
            });
            setIsCheckingId(false);
            return;
          }

          // If not a duplicate, proceed with form submission
          setIsCheckingId(false);
          await handleSubmit(e);
        } catch (error: any) {
          console.error("Error checking national ID:", error);
          setIsCheckingId(false);

          // Check if the error is about a duplicate national ID
          if (
            error.message &&
            error.message.includes("National ID is already registered")
          ) {
            setErrors({
              ...errors,
              nationalIdNumber:
                "This National ID is already registered with another account",
            });
            return;
          }

          // If there's an error checking the national ID, still try to submit the form
          await handleSubmit(e);
        }
      } else {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    } else {
      console.log("Validation errors:", validationErrors);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;

    // Debug: Print formData before sending
    // eslint-disable-next-line no-console
    console.log("[CompleteProfile] Submitting formData:", formData);

    try {
      // Check token before submission
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        navigate("/auth/login");
        return;
      }

      // Make sure we have the profileCompleted field
      const updatedFormData = {
        ...formData,
        profileCompleted: true,
      };

      // Call the dedicated completeProfile service method
      await authService.completeProfile(updatedFormData);
      toast.success("Profile completed successfully!");
      navigate("/advertisements");
    } catch (error: any) {
      // Handle specific error for duplicate national ID
      if (
        error.message &&
        error.message.includes("National ID is already registered")
      ) {
        setErrors((prev) => ({
          ...prev,
          nationalIdNumber:
            "This National ID is already registered with another account",
        }));
        setCurrentStep(2); // Go back to the national ID step
        window.scrollTo(0, 0);
        toast.error(
          "This National ID is already registered with another account"
        );
        return;
      }
      // Handle other errors
      toast.error(error.message || "Failed to complete profile");
    }
  };

  // If user's profile is already complete, don't render the form
  if (user?.profileCompleted === true) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow pt-16 sm:pt-20 md:pt-24 pb-16">
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

            <form
              onSubmit={handleNextStep}
              className="animate-fade-up delay-200"
            >
              {currentStep === 1 && (
                <ContactDetailsStep
                  profileFormData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onNext={handleNextStep}
                  loading={authLoading || isCheckingId}
                />
              )}

              {currentStep === 2 && (
                <NationalIdStep
                  profileFormData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onFileUpload={handleFileUpload}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                  loading={authLoading || isCheckingId}
                />
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompleteProfile;
