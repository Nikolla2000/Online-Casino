import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../../context/userContext';
import CircularProgress from '@mui/material/CircularProgress';
import "./DashboardStyles.scss";
import Stats from './Stats';
import AccountInfo from './AccountInfo';
import axios from '../../../axiosConfig';
import { useNavigate } from 'react-router';
import 'animate.css';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfilePic } from '../../../redux/features/auth/authSlice';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [midSection, setMidSection] = useState('Stats');
  const [isHovered, setIsHovered] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const waitForUser = async () => {
      return !!user.name;
    };

    const fetchData = async () => {
      const userAvailable = await waitForUser();
      setIsLoading(false);
    };

    fetchData();
  }, [user]);


  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Валидация на файла
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      setIsUploading(true);
      const res = await axios.post('/user/uploadPicture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      dispatch(updateProfilePic(res.data.profilePic));

      const imgElement = document.querySelector('.profile-image-wrapper img');

      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const changeSection = (event) => {
    event.stopPropagation();
    setMidSection(event.target.innerText);
  }

  const logout = async () => {
      try {
        await axios.get('/user/logout');
        navigate('/');
        location.reload();
      } catch (error) {
        console.error('Logout error:', error);
      }
  };


  return (
    <div className='dashboard-wrapper'>

      <div className="left-section">
        <div className="profile-image-wrapper">
          <img 
            src={`http://localhost:3000${user.profileImage}?${Date.now()}` || "/images/user.png"} 
            alt="Profile" 
            className={isUploading ? 'uploading' : ''}
            key={user.profileImage}
          />
          <div 
            className="change-pic-button"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            {isUploading ? '⏳' : '+'}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        <div className="name-details">
          <h3>{user.name}</h3>
          <h5>Master of the slots</h5>
        </div>
        <div className="profile-nav">
          <p className={`${midSection == "Stats" ? 'current' : ''}`} onClick={changeSection}>Stats</p>
          <p className={`${midSection == "Account Info" ? 'current' : ''}`} onClick={changeSection}>Account Info</p>
          <p onClick={logout}>Logout</p>
        </div>
      </div>

      <div className="mid-section">
        {midSection == 'Stats' ? <Stats/> : <AccountInfo/>}
      </div>

      <div className="right-section">
        <h3>Buy Credits</h3>
        <div 
            className="credits-options" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
          <div className="option">
            <span>1000</span>
            <span>$9.99</span>
          </div>
          <div className="option">
            <span>2000</span>
            <span>$18.99</span>
          </div>
          <div className="option">
            <span>5000</span>
            <span>$45.99</span>
          </div>
          <div className={`option best-option ${isHovered && 'animte__animated animate__heartBeat'}`}>
            <span>10000</span>
            <span>$89.99 <s>$99.99</s></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
