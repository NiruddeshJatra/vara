import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInformation from "@/components/profile/ProfileInformation";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { getApiError } from "@/utils/apiError";

import { useTranslation } from 'react-i18next';
const Profile = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  // Original name captured when edit mode opens, so we only PATCH the name when
  // it actually changed (the name endpoint 400s once a rental is completed).
  const [originalName, setOriginalName] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Use React Query to fetch user profile data
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => authService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: isAuthenticated, // Only fetch if authenticated
    retry: 1
  });
  
  // Use mutation for profile updates - MUST BE DEFINED BEFORE ANY CONDITIONAL RETURNS
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { profile: User; picture: File | null; nameChanged: boolean }) => {
      // Name is updated via PATCH /users/profile/ — only when it actually changed,
      // so editing address/email alone never trips the post-rental name lock.
      if (data.nameChanged) {
        await authService.updateFullName(data.profile.full_name);
      }
      // The rest goes via PATCH /users/profile/step1/, which requires all four
      // fields — resend them all (prefilled from the current profile).
      const formData = new FormData();
      formData.append('date_of_birth', data.profile.date_of_birth || '');
      formData.append('district', data.profile.district || '');
      formData.append('thana', data.profile.thana || '');
      formData.append('full_address', data.profile.full_address || '');
      if (data.profile.email) formData.append('email', data.profile.email);
      if (data.picture) formData.append('profile_picture', data.picture);
      return authService.updateProfile(formData);
    },
    onSuccess: (updatedUserData) => {
      // Explicitly update React Query cache with the new data
      queryClient.setQueryData(['user', 'profile'], updatedUserData);
      
      // Also invalidate to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Force a refetch to ensure we have the latest data
      queryClient.refetchQueries({ queryKey: ['user', 'profile'] });
      
      // Reset edit mode and files
      setIsEditing(false);
      setProfilePictureFile(null);
      setPreviewUrl(null);
      
      toast({
        title: t('common.toastSuccess'),
        description: t('completeProfile.step1Success'),
        variant: "default"
      });
    },
    onError: (error: any) => {
      console.error('Error saving profile:', error);
      toast({
        title: t('profilePage.updateFailedTitle'),
        description: getApiError(error),
        variant: "destructive"
      });
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            {t('profilePage.loginToView')}
          </h2>
          <button
            onClick={() => navigate("/auth/login/")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            {t('common.login')}
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
    setOriginalName(user.full_name);
    setProfilePictureFile(null);
    setPreviewUrl(null);
    toast({
      title: t('profilePage.editModeTitle'),
      description: t('profilePage.editModeDesc'),
      variant: "default",
      duration: 3000,
    });
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    updateProfileMutation.mutate({
      profile: user,
      picture: profilePictureFile,
      nameChanged: user.full_name !== originalName,
    });
  };

  const handleInputChange = (field: any, value: string) => {
    if (isEditing && user && user[field] !== value) {
      // Update local state without setUser
      queryClient.setQueryData(['user', 'profile'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          [field]: value
        };
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfilePictureFile(null);
    setPreviewUrl(null);
    // No need to refresh, just use the original user data from context
    toast({
      title: t('profilePage.discardedTitle'),
      description: t('profilePage.discardedDesc'),
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