import CreateListingStepper from "@/components/listings/CreateListingStepper";
import Footer from '@/components/home/Footer';
import NavBar from '@/components/home/NavBar';

export default function CreateListingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <CreateListingStepper />
      <Footer />
    </div>
  );
}