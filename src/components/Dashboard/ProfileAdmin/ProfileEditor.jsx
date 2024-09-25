import React, { useState, useEffect } from 'react';
import LeftBar from './../LeftBar';
import SettingsBar from './SettingsBar';
import ProfileForm from './EditProfileForm';
import Navbar from './../NavBar';

const ProfileEditor = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);

  
    const handleLeftBarVisibilityChange = (isVisible) => {
      setIsLeftBarVisible(isVisible);
    };
  


  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      setProfileImage(imageFile);
    }
  };

  

  return (
    <div className="bg-gradient-to-t from-blue-200 via-blue-400 to-blue-600 flex min-h-screen overflow-hidden">
        <LeftBar  onVisibilityChange={handleLeftBarVisibilityChange} />
        <div className={`w-full transition-all duration-300 ${isLeftBarVisible ? 'ml-56' : ''}`}>
          <Navbar/>
        
        <div className="flex justify-center   ">
        
          <div className=''>
            <SettingsBar />
            <ProfileForm
              name={name}
              email={email}
              profileImage={profileImage}
              handleNameChange={handleNameChange}
              handleEmailChange={handleEmailChange}
              handleImageChange={handleImageChange}
            />
          </div>
        </div>
      </div>
    
  </div>
  );
};

export default ProfileEditor;
