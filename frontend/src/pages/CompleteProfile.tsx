import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/home/Footer";
import NavBar from "@/components/home/NavBar";
import ContactDetailsStep from "@/components/auth/steps/ContactDetailsStep";
import NationalIdStep from "@/components/auth/steps/NationalIdStep";
import { ProfileFormData, ProfileFormErrors, ProfileCompletionData } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";

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
      // Handle event-based changes (from input elements)
      const { name, value } = eventOrValue.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      // Handle direct value changes
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
        } else if (!/^(\\+?88)?01[5-9]\\d{8}$/.test(formData.phoneNumber)) {
          stepErrors.phoneNumber =
            "Please enter a valid Bangladeshi phone number";
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
          stepErrors.nationalIdFront =
            "Please upload a photo of your National ID front";
        }
        if (!formData.nationalIdBack) {
          stepErrors.nationalIdBack =
            "Please upload a photo of your National ID back";
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
      // Set profileCompleted to true before submitting
      const completeProfileData: ProfileCompletionData = {
        profileCompleted: true
      };

      // Update the profile with the completion status
      await updateProfile(formData);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">
              Please provide the following information to complete your profile
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center">
              <div
                className={`flex-1 h-1 transition-all duration-500 ease-in-out ${currentStep >= 1 ? "bg-green-500" : "bg-gray-200"
                  }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${currentStep >= 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                  }`}
              >
                1
              </div>
              <div
                className={`flex-1 h-1 transition-all duration-500 ease-in-out ${currentStep >= 2 ? "bg-green-500" : "bg-gray-200"
                  }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${currentStep >= 2
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                  }`}
              >
                2
              </div>
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              <div className={`flex flex-col items-center transition-all duration-300 ${currentStep === 2 ? 'text-green-600 scale-105' : ''}`}>
                <span className="font-medium">Contact Details</span>
                <span className="text-xs text-gray-500">Personal Info</span>
              </div>
              <div className={`flex flex-col items-center transition-all duration-300 ${currentStep === 3 ? 'text-green-600 scale-105' : ''}`}>
                <span className="font-medium">Verification</span>
                <span className="text-xs text-gray-500">National ID</span>
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
                onPrev={handlePrevStep}
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
      </main>

      <Footer />
    </div>
  );
};

export default CompleteProfile;
