import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';

const ForgotPassword = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <ForgotPasswordForm />
      <Footer />
    </div>
  );
};

export default ForgotPassword; 