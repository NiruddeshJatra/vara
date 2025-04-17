import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import Footer from '@/components/home/Footer';
import NavBar from '@/components/home/NavBar';
import BasicInfoStep from '@/components/auth/steps/BasicInfoStep';
import { RegistrationData, RegistrationFormErrors } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { validateRegistrationForm } from '@/utils/validations/auth.validations';
import { Label } from '@/components/ui/label';

const Register = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register: registerUser, loading } = useAuth(); // register function from AuthContext, which handles user registration
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    username: '',
    password1: '',
    password2: '',
    termsAgreed: false,
    marketingConsent: false,
    profileCompleted: false
  });
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    handleInputChange({ password1: value });
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    handleInputChange({ password2: value });
  };

  const validateBasicInfo = () => {
    return validateRegistrationForm(formData);
  };

  const handleInputChange = (data: Partial<RegistrationData>) => {
    // Clear errors for the fields that are being updated
    const newErrors = { ...errors };
    Object.keys(data).forEach(key => {
      delete newErrors[key as keyof RegistrationFormErrors];
      // Clear any nested errors
      Object.keys(newErrors).forEach(errorKey => {
        if (errorKey.startsWith(`${key}.`)) {
          delete newErrors[errorKey as keyof RegistrationFormErrors];
        }
      });
    });
    setErrors(newErrors);
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateBasicInfo();

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Send data in camelCase, auth service will transform to snake_case
        const apiFormData: RegistrationData = {
          email: formData.email,
          username: formData.username,
          password1: formData.password1,
          password2: formData.password2,
          marketingConsent: formData.marketingConsent || false,
          profileCompleted: false,
          termsAgreed: formData.termsAgreed
        };

        await registerUser(apiFormData);
        // Success will navigate to verification notice
      } catch (error) {
        // Error handling is already done in the auth context
        console.error('Registration error:', error);
      }
    } else {
      setErrors(validationErrors);
      console.log('Validation errors:', validationErrors);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow pt-16 sm:pt-20 md:pt-24 pb-16">
        <div className="bg-gradient-to-b from-green-300 to-lime-100/20 pt-4 sm:pt-6 md:pt-8 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-lime-50 rounded-lg shadow-subtle p-4 sm:p-6 md:p-8 animate-fade-up">
              <div className="text-center mb-4 sm:mb-6 md:mb-8 animate-fade-up">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
                <p className="text-sm sm:text-base text-gray-600">Join the Vara community to rent and lend items</p>
                <p className="text-xs sm:text-sm text-amber-600 mt-2">Quick sign-up! Complete your profile after verification.</p>
              </div>

              {/* Display validation errors from backend */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 space-y-2 animate-fade-down">
                  {Object.entries(errors).map(([key, value]) => (
                    <div key={key} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-red-800 capitalize">
                            {key.split('_').join(' ')}
                          </h3>
                          <p className="text-sm text-red-700 mt-1">
                            {Array.isArray(value) ? value[0] : value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="animate-fade-up delay-200">
                <BasicInfoStep
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onNext={handleSubmit}
                  loading={loading}
                  showConsent={true}
                  password={password}
                  confirmPassword={confirmPassword}
                  onPasswordChange={handlePasswordChange}
                  onConfirmPasswordChange={handleConfirmPasswordChange}
                />
              </form>
            </div>
            
            <div className="mt-8 flex justify-center items-center space-x-4 pb-8 animate-fade-up delay-300">
              <div className="flex items-center text-gray-500 text-sm">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <span>Secure Registration</span>
              </div>
              <div className="text-gray-500 text-sm">
                <Link to="/auth/login/" className="text-green-600 hover:text-green-700 font-medium">
                  Already have an account? Sign in
                </Link>
              </div>
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
    <div className="p-4 text-red-500 animate-fade-in">
      <h2>Registration Error:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}