import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ImageUpload from './ImageUpload';
const ALL_INTERESTS = ['Restaurants', 'Hotels', 'Geos', 'Attractions']; 

const Profile: React.FC = () => {
  const location = useLocation();
  const { user } = location.state;

  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState('');

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const userId = user.id
        const response = await axios.get(`/api/interests/${userId}`);
        setInterests(response.data);

        // Preselect another interest if possible
        const current = response.data[0]?.name;
        const otherOptions = ALL_INTERESTS.filter((i) => i !== current);
        setSelectedInterest(otherOptions[0]);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchInterests();
  }, [user.id]);

  const handleUpdateInterest = async () => {
    try {
      const response = await axios.put(`/api/interests/${user.id}`, {
        newInterest: selectedInterest,
      });

      setInterests([response.data.interest]);
    } catch (error) {
      console.error('Error updating interest:', error);
    }
  };

  const currentInterest = interests[0]?.name;
  const interestOptions = ALL_INTERESTS.filter((i) => i !== currentInterest);
  useEffect(() => {
   
    if (!document.querySelector('script[src="https://widget.cloudinary.com/v2.0/global/all.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      script.onload = () => {
      
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleUploadWidget = () => {
    // @ts-ignore - Cloudinary not typed
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dcrrsec0d',
        uploadPreset: 'LetsGeatx Profile',
        sources: ['local', 'url', 'camera'],
        cropping: true,
        multiple: false,
        folder: 'letsGeatx/profilePic',
        transformation: [
          { width: 150, height: 150, crop: 'limit' } 
        ],
      },
      async (error: any, result: any) => {
        if (!error && result.event === 'success') {
          const imageUrl = result.info.secure_url;
          console.log('Uploaded image:', imageUrl);
  
         
          try {
            await axios.patch(`/api/users/${user.id}/profile-pic`, {
              profilePic: imageUrl,
            });
  
           
            user.profilePic = imageUrl;
          } catch (err) {
            console.error('Failed to update profile pic in DB:', err);
          }
        }
      }
    );
  
    widget.open();
  };




  return (
    <div>
      <h1>Profile Page</h1>
      <div>{user.username}</div>
      <div>{user.email}</div>
      <img src={user.profilePic} alt="Profile" style={{ height: '150px' }} />
      <button onClick={handleUploadWidget}>Change Profile Picture</button>

      <h3>Current Interest:</h3>
      <div>{currentInterest || 'None'}</div>

      <h4>Change Interest:</h4>
      <form onSubmit={(e) => { e.preventDefault(); handleUpdateInterest(); }}>
        {interestOptions.map((interest) => (
          <div key={interest}>
            <label>
              <input
                type="radio"
                name="interest"
                value={interest}
                checked={selectedInterest === interest}
                onChange={(e) => setSelectedInterest(e.target.value)}
              />
              {interest}
            </label>
          </div>
        ))}
        <button type="submit">Update Interest</button>
      </form>
          {/* upload image component */}
          <ImageUpload/>
    </div>
  );
};

export default Profile;