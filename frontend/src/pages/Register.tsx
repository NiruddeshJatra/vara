
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';

type FormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  dateOfBirth: string;
  termsAgreed: boolean;
  dataConsent: boolean;
  marketingConsent: boolean;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

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
    
    if (formData.password !== formData.confirmPassword) {
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
    } else if (!/^\+8801[3-9]\d{8}$/.test(formData.phoneNumber)) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNextStep = () => {
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
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const stepErrors = validateStep3();
    
    if (Object.keys(stepErrors).length === 0) {
      console.log('Form submitted with data:', formData);
      toast.success("Account created successfully! Please verify your email.");
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      setErrors(stepErrors);
    }
  };

  const renderPasswordStrength = () => {
    const { password } = formData;
    if (!password) return null;
    
    let strength = 0;
    let label = '';
    let colorClass = '';
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength <= 2) {
      label = 'Weak';
      colorClass = 'bg-red-500';
    } else if (strength <= 4) {
      label = 'Medium';
      colorClass = 'bg-yellow-500';
    } else {
      label = 'Strong';
      colorClass = 'bg-green-500';
    }
    
    return (
      <div className="mt-1">
        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${colorClass}`} 
              style={{ width: `${(strength / 5) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow pt-16 pb-16">
        <div className="bg-gradient-to-b from-green-300 to-lime-100/20">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-subtle p-6 md:p-8">
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
              <div className="flex justify-between text-xs mt-2 text-gray-500">
                <span>Basic Info</span>
                <span>Contact Details</span>
                <span>Verification</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="youremail@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email ? (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.email}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">We'll send a verification link to this email</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={errors.username ? 'border-red-500' : ''}
                    />
                    {errors.username ? (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.username}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">This will be visible to other users</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {renderPasswordStrength()}
                    {errors.password ? (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.password}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">At least 8 characters with letters and numbers</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleNextStep}
                    >
                      Continue to Contact Details <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.firstName}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.lastName}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+8801XXXXXXXXX"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={errors.phoneNumber ? 'border-red-500' : ''}
                    />
                    {errors.phoneNumber ? (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.phoneNumber}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Valid Bangladeshi number format required</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="City, Area"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={errors.location ? 'border-red-500' : ''}
                    />
                    {errors.location ? (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.location}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Your primary location for rentals</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={errors.dateOfBirth ? 'border-red-500' : ''}
                    />
                    {errors.dateOfBirth ? (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.dateOfBirth}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Must be 18 years or older</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handlePrevStep}
                    >
                      <ChevronLeft size={16} className="mr-1" /> Back to Basic Info
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleNextStep}
                    >
                      Continue to Verification <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="border p-5 rounded-lg bg-gray-50 space-y-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="termsAgreed"
                          name="termsAgreed"
                          type="checkbox"
                          checked={formData.termsAgreed}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="termsAgreed" className="text-sm font-medium text-gray-700">
                          I agree to the <Link to="/terms" className="text-green-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link> <span className="text-red-500">*</span>
                        </label>
                        {errors.termsAgreed && (
                          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.termsAgreed}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="dataConsent"
                          name="dataConsent"
                          type="checkbox"
                          checked={formData.dataConsent}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="dataConsent" className="text-sm font-medium text-gray-700">
                          I consent to the processing of my personal data <span className="text-red-500">*</span>
                        </label>
                        {errors.dataConsent && (
                          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.dataConsent}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketingConsent"
                          name="marketingConsent"
                          type="checkbox"
                          checked={formData.marketingConsent}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="marketingConsent" className="text-sm font-medium text-gray-700">
                          I would like to receive updates and offers
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handlePrevStep}
                    >
                      <ChevronLeft size={16} className="mr-1" /> Back to Contact Details
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Create Account
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
          
          <div className="max-w-3xl mx-auto mt-8 flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-600 text-sm">
            <div className="flex items-center">
              <Shield size={16} className="text-green-600 mr-2" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center">
              <Shield size={16} className="text-green-600 mr-2" />
              <span>Privacy Protected</span>
            </div>
            <div>
              <Link to="/support" className="text-green-600 hover:underline">Need help? Contact support</Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
