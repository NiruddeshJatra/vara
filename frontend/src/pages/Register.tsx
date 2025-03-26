import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Footer from '@/components/home/Footer';
import NavBar from '@/components/home/NavBar';
import BasicInfoStep from '@/components/auth/steps/BasicInfoStep';
import ContactDetailsStep from '@/components/auth/steps/ContactDetailsStep';
import VerificationStep from '@/components/auth/steps/VerificationStep';
import { FormData, FormErrors } from '@/types/auth';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    location: '',
    dateOfBirth: '',
    termsAgreed: false,
    dataConsent: false,
    marketingConsent: false
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateStep1 = () => {
    const stepErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email) {
      stepErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      stepErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.username) {
      stepErrors.username = 'Username is required';
    } else if (formData.username.length > 150) {
      stepErrors.username = 'Username must be less than 150 characters';
    }
    
    if (!formData.password) {
      stepErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      stepErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      stepErrors.password = 'Password must contain both letters and numbers';
    }
    
    if (!formData.confirmPassword) {
      stepErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      stepErrors.confirmPassword = 'Passwords do not match';
    }
    
    return stepErrors;
  };

  const validateStep2 = () => {
    const stepErrors: FormErrors = {};
    
    if (!formData.firstName) {
      stepErrors.firstName = 'First name is required';
    } else if (formData.firstName.length > 150) {
      stepErrors.firstName = 'First name must be less than 150 characters';
    }
    
    if (!formData.lastName) {
      stepErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length > 150) {
      stepErrors.lastName = 'Last name must be less than 150 characters';
    }
    
    if (!formData.phoneNumber) {
      stepErrors.phoneNumber = 'Phone number is required';
    } else if (!/^(\+?88)?01[5-9]\d{8}$/.test(formData.phoneNumber)) {
      stepErrors.phoneNumber = 'Please enter a valid Bangladeshi phone number';
    }
    
    if (!formData.location) {
      stepErrors.location = 'Location is required';
    } else if (formData.location.length > 255) {
      stepErrors.location = 'Location must be less than 255 characters';
    }
    
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (age < 18 || (age === 18 && monthDiff < 0)) {
        stepErrors.dateOfBirth = 'You must be at least 18 years old';
      }
    }
    
    return stepErrors;
  };

  const validateStep3 = () => {
    const stepErrors: FormErrors = {};
    
    if (!formData.termsAgreed) {
      stepErrors.termsAgreed = 'You must agree to the Terms of Service';
    }
    
    if (!formData.dataConsent) {
      stepErrors.dataConsent = 'You must consent to data processing';
    }
    
    return stepErrors;
  };

  const handleInputChange = (data: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
    
    // Clear errors for changed fields
    const fieldName = Object.keys(data)[0] as keyof FormData;
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    let stepErrors = {};
    
    if (currentStep === 1) {
      stepErrors = validateStep1();
    } else if (currentStep === 2) {
      stepErrors = validateStep2();
    }
    
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setErrors(stepErrors);
      console.log('Validation errors:', stepErrors);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps before submitting
    const step1Errors = validateStep1();
    const step2Errors = validateStep2();
    const step3Errors = validateStep3();
    
    const allErrors = {
      ...step1Errors,
      ...step2Errors,
      ...step3Errors
    };
    
    if (Object.keys(allErrors).length === 0) {
      try {
        const response = await fetch('/api/auth/registration/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username,
            password1: formData.password,
            password2: formData.confirmPassword,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone_number: formData.phoneNumber,
            location: formData.location,
            date_of_birth: formData.dateOfBirth,
          }),
          credentials: 'include',
        });
        
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
  
        if (!response.ok) {
          const errorMessage = data.non_field_errors?.[0] || 
                    Object.values(data).flat().find(msg => msg) || 
                      'Registration failed';
          throw new Error(errorMessage);
        }
  
        toast.success("Account created successfully! Please check your email to verify.");
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        console.error('Registration error:', error);
        toast.error(error instanceof Error ? error.message : 'Registration failed');
      }
    } else {
      setErrors(allErrors);
      console.log('Validation errors:', allErrors);
      // If there are errors in previous steps, go back to the first step with errors
      if (Object.keys(step1Errors).length > 0) {
        setCurrentStep(1);
      } else if (Object.keys(step2Errors).length > 0) {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow pt-16 pb-16">
        <div className="bg-gradient-to-b from-green-300 to-lime-100/20 pt-8">
          <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-lime-50 rounded-lg shadow-subtle md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">Join the Bhara community to rent and lend items</p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center">
                <div className={`flex-1 h-1 ${currentStep >= 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}>1</div>
                <div className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}>2</div>
                <div className={`flex-1 h-1 ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}>3</div>
                <div className={`flex-1 h-1 ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              </div>
              <div className="flex justify-between mt-4 text-sm text-gray-600">
                <div className="flex flex-col items-center">
                  <span className="font-medium">Basic Info</span>
                  <span className="text-xs text-gray-500">Email & Password</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-medium">Contact Details</span>
                  <span className="text-xs text-gray-500">Personal Info</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-medium">Verification</span>
                  <span className="text-xs text-gray-500">Terms & Consent</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={currentStep === 3 ? handleSubmit : handleNextStep}>
              {currentStep === 1 && (
                <BasicInfoStep
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onNext={handleNextStep}
                />
              )}
              
              {currentStep === 2 && (
                <ContactDetailsStep
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                />
              )}
              
              {currentStep === 3 && (
                <VerificationStep
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onPrev={handlePrevStep}
                  onSubmit={handleSubmit}
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

export default Register;

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="p-4 text-red-500">
      <h2>Registration Error:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}