import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';

const ResetPassword = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <ResetPasswordForm />
      <Footer />
    </div>
  );
};

export default ResetPassword; 