import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { DateOfBirthPicker } from "@/components/common/DateOfBirthPicker";
import { useState } from 'react';
import { User } from "@/types/auth";
import { BD_DISTRICTS, getThanas } from "@/utils/bd-districts";

interface ProfileInformationProps {
  userData: User;
  isEditing: boolean;
  onSaveChanges: () => void;
  onCancelEdit: () => void;
  onInputChange: (field: keyof User, value: string) => void;
  onProfilePictureUpload: (file: File) => void;
}

const ProfileInformation = ({
  userData,
  isEditing,
  onSaveChanges,
  onCancelEdit,
  onInputChange,
  onProfilePictureUpload
}: ProfileInformationProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a preview URL for the UI
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
      // Call the upload handler with the file
      onProfilePictureUpload(file);
    }
  };

  const initials = (userData.full_name || '')
    .split(' ')
    .map((part) => part[0] || '')
    .slice(0, 2)
    .join('');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-t from-green-50/50 to-white">
          <CardHeader>
            <CardTitle className="text-green-800">Personal Information</CardTitle>
            <CardDescription className="text-green-600">Your basic account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <Label htmlFor="full_name" className="text-green-800 font-medium">Full Name</Label>
                <Input
                  id="full_name"
                  value={userData.full_name}
                  onChange={(e) => onInputChange('full_name', e.target.value)}
                  disabled={!isEditing}
                  className={`border-green-300 bg-white text-green-800 ${!isEditing ? "bg-green-50/70 border-green-200" : ""}`}
                />
              </div>

              <div>
                <Label htmlFor="phone_number" className="text-green-800 font-medium">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone_number"
                    value={userData.phone_number}
                    disabled
                    className="bg-green-50/70 pr-10 border-green-200 text-green-800"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-green-800 font-medium">Email Address</Label>
                <Input
                  id="email"
                  value={userData.email || ""}
                  onChange={(e) => onInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className={`border-green-300 bg-white text-green-800 ${!isEditing ? "bg-green-50/70 border-green-200" : ""}`}
                />
              </div>

              <div>
                <Label htmlFor="full_address" className="text-green-800 font-medium">Full Address</Label>
                <Input
                  id="full_address"
                  value={userData.full_address || ""}
                  onChange={(e) => onInputChange('full_address', e.target.value)}
                  disabled={!isEditing}
                  className={`border-green-300 bg-white text-green-800 ${!isEditing ? "bg-green-50/70 border-green-200" : ""}`}
                />
              </div>

              <div>
                <DateOfBirthPicker
                  value={userData.date_of_birth || ""}
                  onChange={(date) => onInputChange('date_of_birth', date)}
                  label="Date of Birth"
                  required={false}
                  className={!isEditing ? "opacity-70 pointer-events-none" : ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-t from-green-50/50 to-white">
          <CardHeader>
            <CardTitle className="text-green-800">Location</CardTitle>
            <CardDescription className="text-green-600">Where you're based</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <Label htmlFor="district" className="text-green-800 font-medium">District</Label>
                <select
                  id="district"
                  value={userData.district || ""}
                  onChange={(e) => onInputChange('district', e.target.value)}
                  disabled={!isEditing}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm border-green-300 bg-white text-green-800 ${!isEditing ? "bg-green-50/70 border-green-200" : ""}`}
                >
                  <option value="">Select district</option>
                  {BD_DISTRICTS.map((district) => (
                    <option key={district.name} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="thana" className="text-green-800 font-medium">Thana</Label>
                <select
                  id="thana"
                  value={userData.thana || ""}
                  onChange={(e) => onInputChange('thana', e.target.value)}
                  disabled={!isEditing || !userData.district}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm border-green-300 bg-white text-green-800 ${!isEditing ? "bg-green-50/70 border-green-200" : ""}`}
                >
                  <option value="">Select thana</option>
                  {getThanas(userData.district || "").map((thana) => (
                    <option key={thana} value={thana}>
                      {thana}
                    </option>
                  ))}
                </select>
              </div>

              {isEditing && (
                <div className="pt-4">
                  <h4 className="text-base font-medium mb-2 text-green-800">Profile Picture</h4>
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50/70">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 rounded-full border-2 border-green-200">
                        <AvatarImage
                          src={previewUrl || userData.profile_picture || '/default-avatar.png'}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <label
                          htmlFor="profile-pic"
                          className="bg-white border border-green-300 rounded-lg px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 cursor-pointer inline-flex items-center gap-2 shadow-sm"
                        >
                          <Upload className="w-4 h-4" />
                          Choose file
                          <input
                            id="profile-pic"
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleProfilePictureChange}
                          />
                        </label>
                        <p className="text-green-700 text-xs mt-1">JPG, JPEG, PNG formats, max 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onCancelEdit}
            className="bg-white hover:bg-green-50 text-green-700 hover:text-green-900"
          >
            Cancel
          </Button>
          <Button
            onClick={onSaveChanges}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileInformation;
