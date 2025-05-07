import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInformation from "@/components/profile/ProfileInformation";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileUpdateData } from "@/types/auth";

const Profile = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, setUser, updateProfile, refreshUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Refresh user data when component mounts
    const refresh = async () => {
      try {
        await refreshUserData();
      } catch (error) {
        console.error('Error refreshing profile data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    refresh();
  }, [refreshUserData, toast]);

  // No need for separate refreshProfile function since we're using context

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Please login to view your profile
          </h2>
          <button
            onClick={() => window.location.href = "/auth/login/"}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
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
    setProfilePictureFile(null);
    setPreviewUrl(null);
    toast({
      title: "Edit mode activated",
      description: "You can now edit your profile information",
      variant: "default",
      duration: 3000,
    });
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      
      const updateData: ProfileUpdateData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber,
        location: user.location,
        dateOfBirth: user.dateOfBirth,
        bio: user.bio,
        profilePicture: profilePictureFile
      };

      // Use the context's updateProfile which handles the update and state management
      const updatedUser = await updateProfile(updateData);
      
      // Update the local user state with the response
      setUser(updatedUser);
      
      // Reset edit mode and files
      setIsEditing(false);
      setProfilePictureFile(null);
      setPreviewUrl(null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof user, value: string) => {
    if (isEditing && user && user[field] !== value) {
      setUser(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfilePictureFile(null);
    setPreviewUrl(null);
    // No need to refresh, just use the original user data from context
    toast({
      title: "Changes discarded",
      description: "Your profile was not updated",
      variant: "default",
      duration: 3000,
    });
  };

  const handleProfilePictureUpload = (file: File) => {
    if (file && isEditing) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewUrl(reader.result);
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
            userData={user}
            onEdit={handleEditProfile}
            isEditing={isEditing}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pb-16">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsContent value="profile" className="pt-6">
              <ProfileInformation
                userData={user}
                isEditing={isEditing}
                onSaveChanges={handleSaveChanges}
                onCancelEdit={handleCancelEdit}
                onInputChange={handleInputChange}
                onProfilePictureUpload={handleProfilePictureUpload}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;