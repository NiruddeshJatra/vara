import { Outlet, useNavigation } from 'react-router-dom';
import NavBar from '../home/NavBar';
import Footer from '../home/Footer';
import { ProfileCompletionButton } from '../common/ProfileCompletionButton';
import MobileNavBar from '../home/MobileNavBar';

export const MainLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

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