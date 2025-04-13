import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInformation from "@/components/profile/ProfileInformation";
import EmptyState from "@/components/profile/EmptyState";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import ProfileListings from "@/components/profile/ProfileListings";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileUpdateData } from '@/types/auth';

const Profile = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      setUserData({
        ...user,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        profilePicture: user.profilePicture || "",
        memberSince: user.memberSince || "",
        isVerified: user.isTrusted || false,
        isTrusted: user.isTrusted || false,
        rating: user.averageRating || 0,
        notificationCount: user.notificationCount || 0,
        email: user.email || "",
        phone: user.phoneNumber || "",
        location: user.location || "",
        dob: user.dateOfBirth || "",
        bio: user.bio || "",
        profileCompleted: user.profileCompleted || false
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Please login to view your profile
          </h2>
          <button
            onClick={() => window.location.href = "/auth/login/"}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-4 bg-green-200 rounded w-32 mb-4"></div>
          <div className="h-3 bg-green-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  const handleEditProfile = () => {
    setIsEditing(true);
    toast({
      title: "Edit mode activated",
      description: "You can now edit your profile information",
      variant: "default",
      duration: 3000,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const updateData: ProfileUpdateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        location: userData.location,
        dateOfBirth: userData.dob,
        bio: userData.bio,
        profilePicture: userData.profilePicture ? new File([userData.profilePicture], 'profile.jpg') : null
      };

      await updateProfile(updateData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully",
        variant: "default",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUserData({
      ...userData,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phoneNumber || "",
      location: user.location || "",
      dob: user.dateOfBirth || "",
      bio: user.bio || "",
    });
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

  const handleProfilePictureUpload = (file: File) => {
    if (file) {
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
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-20">
        <div className="w-full">
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
              <ProfileListings />
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