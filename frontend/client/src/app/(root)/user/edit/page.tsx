"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { TextField, Button, Avatar, IconButton } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import axiosInstance from "../../../../apicalls/axiosInstance";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useErreur } from "../../../../context/ErreurContext";

const DEFAULT_PROFILE_IMAGE = "/default-avatar.webp";

interface UserData {
  id: number;
  email: string;
  username: string;
  phone: string;
  image: string | null;
  gender: string;
  age: string;
  address: string;
  city: string;
  country: string;
  businessName: string;
  role: string;
}

const UserProfile: React.FC = () => {
  const { user } = useAuthContext();
  const { showError } = useErreur();

  const [formData, setFormData] = useState<UserData>({
    id: 0,
    email: "",
    username: "",
    phone: "",
    image: null,
    gender: "",
    age: "",
    address: "",
    city: "",
    country: "",
    businessName: "",
    role: ""
  });

  const [originalFormData, setOriginalFormData] = useState<UserData>(formData);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(DEFAULT_PROFILE_IMAGE);

  const [isEditing, setIsEditing] = useState({
    profile: false,
    password: false,
  });

  const [passwordChangeData, setPasswordChangeData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        const userData: UserData = response.data;
        
        setFormData(userData);
        setOriginalFormData(userData);

        if (userData.image) {
          setPreviewImage(`data:image/jpeg;base64,${userData.image}`);
        } else {
          setPreviewImage(DEFAULT_PROFILE_IMAGE);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        showError('error', 'Failed to fetch user details');
        setPreviewImage(DEFAULT_PROFILE_IMAGE);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsEditing(prev => ({ ...prev, profile: true }));
  };

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setIsEditing(prev => ({ ...prev, profile: true }));
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    try {
      const submitData = { ...formData };
      
      if (profileImage) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = (reader.result as string).split(',')[1];
          submitData.image = base64String;
          
          await updateProfile(submitData);
        };
        reader.readAsDataURL(profileImage);
      } else {
        await updateProfile(submitData);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      showError('error', 'Failed to update profile');
    }
  };

  const updateProfile = async (data: UserData) => {
    try {
      if (!data.id) {
        throw new Error('User ID is not defined');
      }
      
      const response = await axiosInstance.put(`/users/${data.id}`, {
        username: data.username,
        email: data.email,
        phone: data.phone,
        image: data.image,
        gender: data.gender,
        age: data.age,
        address: data.address,
        city: data.city,
        country: data.country,
        businessName: data.businessName
      });

      setOriginalFormData(formData);
      setProfileImage(null);
      setIsEditing(prev => ({ ...prev, profile: false }));
      showError('Success', 'Profile updated successfully');
      
      // Update preview image if needed
      if (response.data.image) {
        setPreviewImage(`data:image/jpeg;base64,${response.data.image}`);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCancelProfile = () => {
    setFormData(originalFormData);
    setProfileImage(null);
    setPreviewImage(originalFormData.image ? `data:image/jpeg;base64,${originalFormData.image}` : DEFAULT_PROFILE_IMAGE);
    setIsEditing(prev => ({ ...prev, profile: false }));
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordChangeData;

    if (newPassword !== confirmPassword) {
      showError('error', 'Passwords do not match');
      return;
    }

    try {
      await axiosInstance.post('/api/users/change-password', {
        currentPassword,
        newPassword
      });
      showError('Success', 'Password updated successfully');
      setPasswordChangeData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsEditing(prev => ({ ...prev, password: false }));
    } catch (error) {
      console.error("Error updating password:", error);
      showError('error', 'Failed to update password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-gradient-to-br from-blue-200 to-green-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full space-y-8">
        <h2 className="text-4xl font-bold text-center text-blue-600">Update Profile</h2>

        <div className="flex justify-center mb-6">
          <Avatar 
            alt={formData.username} 
            src={previewImage} 
            sx={{ width: 100, height: 100 }} 
          />
          <input
            accept="image/*"
            id="upload-photo"
            type="file"
            style={{ display: "none" }}
            onChange={handleProfileImageChange}
          />
          <label htmlFor="upload-photo">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Name"
              variant="outlined"
              name="username"
              fullWidth
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              name="phone"
              fullWidth
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="City"
              variant="outlined"
              name="city"
              fullWidth
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Country"
              variant="outlined"
              name="country"
              fullWidth
              value={formData.country}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Address"
              variant="outlined"
              name="address"
              fullWidth
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Business Name"
              variant="outlined"
              name="businessName"
              fullWidth
              value={formData.businessName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Age"
              variant="outlined"
              name="age"
              fullWidth
              value={formData.age}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Gender"
              variant="outlined"
              name="gender"
              fullWidth
              value={formData.gender}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            {isEditing.profile && (
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleCancelProfile}
              >
                Cancel
              </Button>
            )}
            <Button 
              variant="contained" 
              color="primary" 
              type="submit" 
              disabled={!isEditing.profile}
            >
              Save Changes
            </Button>
          </div>
        </form>

        {/* Password Update Section */}
        <div className="p-6 rounded-lg border shadow-md bg-white mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <LockIcon className="mr-3 text-blue-600" /> Change Password
            </h3>
            {!isEditing.password && (
              <Button 
                variant="outlined" 
                color="primary" 
                size="small"
                onClick={() => setIsEditing(prev => ({ ...prev, password: true }))}
                startIcon={<EditIcon />}
              >
                Change
              </Button>
            )}
          </div>

          {!isEditing.password ? (
            <div className="text-center py-4">
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value="************"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <TextField
                label="Current Password"
                variant="outlined"
                name="currentPassword"
                fullWidth
                type="password"
                value={passwordChangeData.currentPassword}
                onChange={(e) => {
                  setPasswordChangeData({ ...passwordChangeData, currentPassword: e.target.value });
                }}
                required
              />
              <TextField
                label="New Password"
                variant="outlined"
                name="newPassword"
                fullWidth
                type="password"
                value={passwordChangeData.newPassword}
                onChange={(e) => {
                  setPasswordChangeData({ ...passwordChangeData, newPassword: e.target.value });
                }}
                required
              />
              <TextField
                label="Confirm New Password"
                variant="outlined"
                name="confirmPassword"
                fullWidth
                type="password"
                value={passwordChangeData.confirmPassword}
                onChange={(e) => {
                  setPasswordChangeData({ ...passwordChangeData, confirmPassword: e.target.value });
                }}
                required
              />
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => {
                    setPasswordChangeData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setIsEditing(prev => ({ ...prev, password: false }));
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                >
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;