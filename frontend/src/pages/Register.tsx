import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Footer from '@/components/home/Footer';
import NavBar from '@/components/home/NavBar';
import BasicInfoStep from '@/components/auth/steps/BasicInfoStep';
import { RegistrationData, RegistrationFormErrors } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail, validateUsername, validatePassword, validateTermsAgreed } from '@/utils/validation';


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
    const stepErrors: RegistrationFormErrors = {
      email: validateEmail(formData.email),
      username: validateUsername(formData.username),
      password1: validatePassword(formData.password1),
      termsAgreed: validateTermsAgreed(formData.termsAgreed)
    };

    if (!confirmPassword) {
      stepErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      stepErrors.confirmPassword = 'Passwords do not match';
    }
    
    return Object.fromEntries(
      Object.entries(stepErrors).filter(([_, value]) => value !== null)
    );
  };

  // If you remove this code:
  // The form would become read-only - users couldn't change any fields
  // All form inputs would be static and non-interactive
  const handleInputChange = (data: Partial<RegistrationData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));

    const fieldName = Object.keys(data)[0] as keyof RegistrationData;
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  // triggered when the user submits the form, ensuring the data is valid before sending it to the server.
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
          termsAgreed: formData.termsAgreed,
          marketingConsent: formData.marketingConsent || false,
          profileCompleted: false
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
      
      <main className="flex-grow pt-16 pb-16">
        <div className="bg-gradient-to-b from-green-300 to-lime-100/20 pt-8">
          <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-lime-50 rounded-lg shadow-subtle md:p-8 animate-fade-up">
            <div className="text-center mb-8 animate-fade-up">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">Join the Vara community to rent and lend items</p>
              <p className="text-sm text-amber-600 mt-2">Quick sign-up! Complete your profile after verification.</p>
            </div>
            
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