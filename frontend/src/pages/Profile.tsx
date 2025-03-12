import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import { Bell, CheckCircle, Edit, Star, Upload, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
// New
const Profile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - would normally come from an API or auth state
  const [userData, setUserData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    username: "sarahj",
    email: "sarah.johnson@example.com",
    phone: "+8801234567890",
    location: "Dhaka, Gulshan",
    dob: "1990-05-15",
    bio: "I'm passionate about sustainable living and love the sharing economy. Looking forward to borrowing and lending items in my neighborhood!",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    memberSince: "March 2023",
    isVerified: true,
    isTrustedSeller: true,
    rating: 4.8,
    notificationCount: 3
  });

  const handleSaveChanges = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (confirmed) {
      toast({
        title: "Account deletion requested",
        description: "We've received your request to delete your account. Please check your email for further instructions.",
        variant: "destructive"
      });
    }
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to your server here
      // For demonstration, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      setUserData({...userData, profilePicture: imageUrl});
      toast({
        title: "Profile picture updated",
        description: "Your new profile picture has been uploaded successfully.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Page content */}
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile Header with top navigation */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                {userData.notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {userData.notificationCount}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile hero section */}
          <div className="bg-white rounded-xl shadow-subtle p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-green-100">
                  <AvatarImage src={userData.profilePicture} alt={`${userData.firstName} ${userData.lastName}`} />
                  <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                    {userData.firstName[0]}{userData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <label htmlFor="profile-picture-upload" className="cursor-pointer bg-white p-2 rounded-full">
                      <Upload className="w-4 h-4 text-green-600" />
                      <input 
                        id="profile-picture-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleProfilePictureUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{userData.firstName} {userData.lastName}</h2>
                  {userData.isVerified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </Badge>
                  )}
                  {userData.isTrustedSeller && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Trusted Seller
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 mb-1">@{userData.username}</p>
                
                <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                    <span className="font-medium">{userData.rating}</span>
                    <span className="text-gray-500 ml-1">(42 reviews)</span>
                  </div>
                  <div className="text-gray-600">
                    Member since {userData.memberSince}
                  </div>
                </div>
              </div>
              
              {!isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1" 
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          
          {/* Profile Tabs */}
          <Tabs defaultValue="profile" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="history">Rental History</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {/* Profile Information Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-subtle p-6">
                  <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={userData.firstName} 
                          onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                          disabled={!isEditing}
                          className={isEditing ? "" : "bg-gray-50"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={userData.lastName} 
                          onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                          disabled={!isEditing}
                          className={isEditing ? "" : "bg-gray-50"}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Input 
                          id="email" 
                          value={userData.email} 
                          disabled
                          className="bg-gray-50 pr-10"
                        />
                        {userData.isVerified && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={userData.phone} 
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-gray-50"}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={userData.location} 
                        onChange={(e) => setUserData({...userData, location: e.target.value})}
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-gray-50"}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input 
                        id="dob" 
                        type="date"
                        value={userData.dob} 
                        onChange={(e) => setUserData({...userData, dob: e.target.value})}
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-gray-50"}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-subtle p-6">
                  <h3 className="text-xl font-semibold mb-6">About Me</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={userData.bio} 
                        onChange={(e) => setUserData({...userData, bio: e.target.value})}
                        disabled={!isEditing}
                        className={`min-h-32 ${isEditing ? "" : "bg-gray-50"}`}
                      />
                      <p className="text-gray-500 text-sm mt-1">Tell others about yourself and your interests</p>
                    </div>
                    
                    {isEditing && (
                      <div className="pt-4">
                        <h4 className="text-base font-medium mb-2">Profile Picture</h4>
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16 rounded-full">
                              <AvatarImage src={userData.profilePicture} alt={`${userData.firstName} ${userData.lastName}`} />
                              <AvatarFallback>{userData.firstName[0]}{userData.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <label 
                                htmlFor="profile-pic" 
                                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 cursor-pointer inline-block"
                              >
                                Choose file
                                <input 
                                  id="profile-pic" 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/jpeg,image/png,image/jpg"
                                  onChange={handleProfilePictureUpload}
                                />
                              </label>
                              <p className="text-gray-500 text-xs mt-1">JPG, JPEG, PNG formats, max 5MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <div className="flex justify-end gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveChanges}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
              
              {/* Account Deletion Section */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-6 mt-8">
                <h3 className="text-xl font-semibold text-red-700 mb-2">Delete Account</h3>
                <p className="text-gray-700 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                  All your data, listings, and rental history will be permanently removed.
                </p>
                <Button 
                  variant="destructive" 
                  className="gap-1"
                  onClick={handleDeleteAccount}
                >
                  <X className="w-4 h-4" />
                  Delete Account
                </Button>
              </div>
            </TabsContent>
            
            {/* Other tabs (placeholders) */}
            <TabsContent value="listings">
              <div className="bg-white rounded-xl shadow-subtle p-8 text-center">
                <h3 className="text-xl font-medium text-gray-600">No Listings Yet</h3>
                <p className="text-gray-500 mt-2 mb-6">You haven't created any item listings yet.</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Create Your First Listing
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="bg-white rounded-xl shadow-subtle p-8 text-center">
                <h3 className="text-xl font-medium text-gray-600">No Rental History</h3>
                <p className="text-gray-500 mt-2 mb-6">You haven't borrowed or lent any items yet.</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Browse Items to Rent
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="bg-white rounded-xl shadow-subtle p-8 text-center">
                <h3 className="text-xl font-medium text-gray-600">No Reviews Yet</h3>
                <p className="text-gray-500 mt-2">Complete a transaction to receive reviews from other users.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="bg-white rounded-xl shadow-subtle p-8">
                <h3 className="text-xl font-semibold mb-6">Account Settings</h3>
                <p className="text-gray-500">Settings options will be available soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;