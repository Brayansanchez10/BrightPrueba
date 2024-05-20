import React, { useState, useEffect } from 'react';
import LeftBar from '././LeftBar';
import SettingsBar from '././SettingsBar';
import ProfileForm from '././EditProfileForm';

const ProfileEditor = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);

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

  useEffect(() => {
    // Aquí puedes hacer una llamada para obtener los datos del usuario actual y
    // establecer los valores iniciales de nombre, email y profileImage
  }, []);

  return (
    <div className="bg-gradient-to-t from-blue-200 via-blue-400 to-blue-600">
      <div className="flex h-screen overflow-hidden">
        {/* LeftBar */}
        <LeftBar />

        {/* ProfileForm and SettingsBar */}
        <div className="flex-1 flex">
          {/* SettingsBar */}
          <div>
            <SettingsBar />
          </div>
          
          {/* ProfileForm */}
          <div className="flex-1 mr-10 ml-10">
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
