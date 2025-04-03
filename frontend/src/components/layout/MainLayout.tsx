import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ProfileCompletionButton } from '../common/ProfileCompletionButton';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ProfileCompletionButton />
      <Footer />
    </div>
  );
}; 