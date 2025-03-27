import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, History, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInformation from "@/components/profile/ProfileInformation";
import EmptyState from "@/components/profile/EmptyState";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";

// Mock user data
const mockUserData = {
  firstName: "Alex",
  lastName: "Thompson",
  email: "alex.thompson@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  dob: "1990-05-15",
  bio: "I'm a passionate photographer and outdoor enthusiast. I love exploring new places and capturing the beauty of nature through my lens. When I'm not behind the camera, you can find me hiking, kayaking, or enjoying a good book in a cozy café.",
  profilePicture: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop",
  isVerified: true,
  joinDate: "January 2022",
  responseRate: "97%",
  responseTime: "Within 1 hour",
  listings: [],
  rentalHistory: [],
  reviews: [],
  // Fields needed by ProfileHeader
  username: "alexthompson",
  memberSince: "January 2022",
  isTrustedSeller: true,
  rating: 4.9,
  notificationCount: 2
};

const Profile = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState(mockUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Simulate loading user data
  useEffect(() => {
    // In a real application, this would fetch data from an API
    const timer = setTimeout(() => {
      setUserData(mockUserData);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
    toast({
      title: "Edit mode activated",
      description: "You can now edit your profile information",
      variant: "default",
      duration: 3000,
    });
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully",
      variant: "default",
      duration: 3000,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUserData(mockUserData); // Reset to original data
    toast({
      title: "Changes discarded",
      description: "Your profile was not updated",
      variant: "default",
      duration: 3000,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setUserData((prev) => ({
            ...prev,
            profilePicture: reader.result as string,
          }));
          
          toast({
            title: "Profile picture updated",
            description: "Your new profile picture has been uploaded",
            variant: "default",
            duration: 3000,
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleVerifyAccount = () => {
    // In a real app, this would trigger a verification process
    toast({
      title: "Verification requested",
      description: "We've sent a verification link to your email",
      variant: "default",
      duration: 3000,
    });
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-20">
        <div className="w-full ">
          <ProfileHeader 
            userData={userData}
            onEdit={handleEditProfile}
            isEditing={isEditing}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pb-16">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <div className="border-b border-green-100">
              <TabsList className="bg-green-100 p-1 rounded-t-lg">
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-white data-[state=active]:text-green-800 data-[state=active]:shadow-sm text-green-700"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="listings" 
                  className="data-[state=active]:bg-white data-[state=active]:text-green-800 data-[state=active]:shadow-sm text-green-700"
                >
                  My Listings
                </TabsTrigger>
                <TabsTrigger 
                  value="rental-history" 
                  className="data-[state=active]:bg-white data-[state=active]:text-green-800 data-[state=active]:shadow-sm text-green-700"
                >
                  Rental History
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="data-[state=active]:bg-white data-[state=active]:text-green-800 data-[state=active]:shadow-sm text-green-700"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="profile" className="pt-6">
              <ProfileInformation 
                userData={userData}
                isEditing={isEditing}
                onSaveChanges={handleSaveChanges}
                onCancelEdit={handleCancelEdit}
                onInputChange={handleInputChange}
                onProfilePictureUpload={handleProfilePictureUpload}
              />
            </TabsContent>
            
            <TabsContent value="listings">
              {userData.listings && userData.listings.length > 0 ? (
                <div>
                  {/* Listings content would go here */}
                  <p>Your listings...</p>
                </div>
              ) : (
                <EmptyState 
                  icon={Package}
                  title="No Listings Found"
                  description="You haven't created any listings yet. Start renting out your items today!"
                  actionLabel="Create Listing"
                  onAction={() => toast({
                    title: "Create Listing",
                    description: "Navigating to create listing page",
                    variant: "default"
                  })}
                />
              )}
            </TabsContent>
            
            <TabsContent value="rental-history">
              {userData.rentalHistory && userData.rentalHistory.length > 0 ? (
                <div>
                  {/* Rental history content would go here */}
                  <p>Your rental history...</p>
                </div>
              ) : (
                <EmptyState 
                  icon={History}
                  title="No Rental History"
                  description="You haven't rented any items yet. Explore our catalog to find what you need!"
                  actionLabel="Browse Items"
                  onAction={() => toast({
                    title: "Browse Items",
                    description: "Navigating to browse page",
                    variant: "default"
                  })}
                />
              )}
            </TabsContent>
            
            <TabsContent value="reviews">
              {userData.reviews && userData.reviews.length > 0 ? (
                <div>
                  {/* Reviews content would go here */}
                  <p>Your reviews...</p>
                </div>
              ) : (
                <EmptyState 
                  icon={Star}
                  title="No Reviews Yet"
                  description="You haven't received any reviews yet. Complete some transactions to build your reputation!"
                  actionLabel="Explore Items"
                  onAction={() => toast({
                    title: "Explore Items",
                    description: "Navigating to explore page",
                    variant: "default"
                  })}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;