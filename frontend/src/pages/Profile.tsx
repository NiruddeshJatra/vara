import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInformation from "@/components/profile/ProfileInformation";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import ProfileListings from "@/components/profile/ProfileListings";
import { useAuth } from "@/contexts/AuthContext";
import AuthService from "@/services/auth.service";
import { ProfileUpdateData } from "@/types/auth";

const Profile = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, updateProfile, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          // Update the user data in AuthContext
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on mount

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

  if (isLoading) {
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
    // Reset the profile picture state
    setProfilePictureFile(null);
    toast({
      title: "Edit mode activated",
      description: "You can now edit your profile information",
      variant: "default",
      duration: 3000,
    });
  };

  const handleSaveChanges = async () => {
    try {
      // Create a ProfileUpdateData object with all fields
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

      const response = await updateProfile(updateData);
      
      // Update the user state with the new data
      setUser(response);
      
      // Reset edit mode
      setIsEditing(false);
      setProfilePictureFile(null);
      setPreviewUrl(null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof typeof user, value: string) => {
    if (isEditing && user[field] !== value) {
      // Create a copy of the user object and update the field
      const updatedUser = { ...user, [field]: value };
      setUser(updatedUser);
    }
  };

  const handleCancelEdit = () => {
    // Reset the user state to the original values
    const originalUser = { ...user };
    setUser(originalUser);
    setIsEditing(false);
    setProfilePictureFile(null);
    setPreviewUrl(null);
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
          setPreviewUrl(reader.result as string);
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
              </TabsList>
            </div>

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
            
            <TabsContent value="listings">
              <ProfileListings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;