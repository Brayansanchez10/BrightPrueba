import React, { useState, useEffect } from 'react';
import LeftBar from './../LeftBar';
import SettingsBar from './SettingsBar';
import ProfileForm from './EditProfileForm';
import Navbar from './../NavBar';
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";

export default function ProfileEditor() {
  const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    firstNames: '',
    lastNames: '',
    profileImage: null
  });
  const { getUserById } = useUserContext();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.data && user.data.id) {
        try {
          const fetchedUserData = await getUserById(user.data.id);
          setUserData({
            name: fetchedUserData.username,
            email: fetchedUserData.email,
            firstNames: fetchedUserData.firstNames,
            lastNames: fetchedUserData.lastNames,
            profileImage: fetchedUserData.userImage
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [getUserById, user]);

  const handleLeftBarVisibilityChange = (isVisible) => {
    setIsLeftBarVisible(isVisible);
  };

  const handleUserDataChange = (newData) => {
    setUserData(prevData => ({ ...prevData, ...newData }));
  };

  return (
    <div className="bg-primaryAdmin flex min-h-screen overflow-hidden">
      <LeftBar onVisibilityChange={handleLeftBarVisibilityChange} />
      <div className={`w-full transition-all duration-300 ${isLeftBarVisible ? 'ml-56' : ''}`}>
        <Navbar />
        <div className="flex flex-col items-center justify-center p-4 space-y-6">
          <div className="w-full max-w-lg">
            <ProfileForm
              name={userData.name}
              email={userData.email}
              firstNames={userData.firstNames}
              lastNames={userData.lastNames}
              profileImage={userData.profileImage}
              onUserDataChange={handleUserDataChange}
            />
            <SettingsBar />
          </div>
        </div>
      </div>
    </div>
  );
}