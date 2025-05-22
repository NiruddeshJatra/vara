import { Outlet } from 'react-router-dom';
import NavBar from '../home/NavBar';
import Footer from '../home/Footer';
import { ProfileCompletionButton } from '../common/ProfileCompletionButton';
import MobileNavBar from '../home/MobileNavBar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ProfileCompletionButton />
      <MobileNavBar />
      <Footer />
    </div>
  );
};