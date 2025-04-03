import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/home/Footer";
import NavBar from "@/components/home/NavBar";
import ContactDetailsStep from "@/components/auth/steps/ContactDetailsStep";
import NationalIdStep from "@/components/auth/steps/NationalIdStep";
import { ProfileFormData, ProfileFormErrors, ProfileCompletionData } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";
import config from "@/config";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { updateProfile, loading } = useAuth();
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

  const validateStep = (step: number): ProfileFormErrors => {
    const stepErrors: ProfileFormErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName) {
          stepErrors.firstName = "First name is required";
        }
        if (!formData.lastName) {
          stepErrors.lastName = "Last name is required";
        }
        if (!formData.phoneNumber) {
          stepErrors.phoneNumber = "Phone number is required";
        } else if (!/^(\+?88)?01[3-9]\d{8}$/.test(formData.phoneNumber)) {
          stepErrors.phoneNumber = "Please enter a valid Bangladeshi phone number";
        }
        if (!formData.location) {
          stepErrors.location = "Location is required";
        }
        if (!formData.dateOfBirth) {
          stepErrors.dateOfBirth = "Date of birth is required";
        } else {
          const birthDate = new Date(formData.dateOfBirth);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (age < 18 || (age === 18 && monthDiff < 0)) {
            stepErrors.dateOfBirth = "You must be at least 18 years old";
          }
        }
        break;

      case 2:
        if (!formData.nationalIdNumber) {
          stepErrors.nationalIdNumber = "National ID number is required";
        }
        if (!formData.nationalIdFront) {
          stepErrors.nationalIdFront = "Please upload a photo of your National ID front";
        }
        if (!formData.nationalIdBack) {
          stepErrors.nationalIdBack = "Please upload a photo of your National ID back";
        }
        break;
    }

    return stepErrors;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const stepErrors = validateStep(currentStep);

    if (Object.keys(stepErrors).length === 0) {
      if (currentStep === 2) {
        handleSubmit(e);
      } else {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    } else {
      setErrors(stepErrors);
      console.log("Validation errors:", stepErrors);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
  
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
        profileCompleted: true
      };
  
      console.log("Submitting profile data with token:", token.substring(0, 10) + "...");
      await updateProfile(updatedFormData);
      
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error: any) {
      console.error("Profile update error:", error);
      const errorMessage = error.message || "Failed to update profile. Please try again.";
      toast.error(errorMessage);
      
      // If token error, redirect to login
      if (errorMessage.includes("authentication") || errorMessage.includes("token")) {
        navigate("/auth/login");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow pt-16 pb-16">
        <div className="bg-gradient-to-b from-green-300 to-lime-100/20 pt-8">
          <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-lime-50 rounded-lg shadow-subtle md:p-8 animate-fade-up">
            <div className="text-center mb-8 animate-fade-up">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Complete Your Profile
              </h1>
              <p className="text-gray-600">
                Please provide the following information to complete your profile
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between max-w-md mx-auto">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    currentStep >= 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    1
                  </div>
                  <span className="text-sm font-medium mt-2 text-green-800">Contact Details</span>
                </div>
                
                <div className="flex-1 h-1 mx-2">
                  <div className={`h-full transition-all duration-500 ease-in-out ${
                    currentStep >= 2 ? "bg-green-500" : "bg-gray-200"
                  }`}></div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    currentStep >= 2 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    2
                  </div>
                  <span className="text-sm font-medium mt-2 text-green-800">Verification</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleNextStep} className="animate-fade-up delay-200">
              {currentStep === 1 && (
                <ContactDetailsStep
                  profileFormData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onNext={handleNextStep}
                  loading={loading}
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
                  loading={loading}
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
