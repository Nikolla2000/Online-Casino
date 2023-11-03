import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from '../../../axiosConfig'
import './RegisterStyles.scss'
import { useNavigate } from "react-router-dom"
import { toast } from 'react-hot-toast'

const RegisterForm = ({ handleClose}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    country: '',
    password: '',
    confirm_password: '',
  });

  const navigate = useNavigate()
  const [errorMessages, setErrorMessages] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
  
    if (formData.firstName.length < 2 || formData.firstName.length > 20) {
      errors.firstName = 'First Name must be between 2 and 20 characters';
    }
  
    if (formData.lastName.length < 2 || formData.lastName.length > 20) {
      errors.lastName = 'Last Name must be between 2 and 20 characters';
    }
  
    if (formData.username.length < 4 || formData.username.length > 20) {
      errors.username = 'Username must be between 2 and 20 characters';
    }
  
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
  
    if (formData.password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }

    if (!/^08\d{8}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number must start with "08" and have 10 digits';
    }
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages('')
  
    const errors = validateForm();
  
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post('/user/register', formData);
        setFormData({
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          phoneNumber: '',
          country: '',
          password: '',
          confirm_password: '',
        })
        toast.success('Registration was successfull!')
        handleClose()
        navigate('/')
        
      } catch (error) {
        console.error(`Registration error: ${error}`);

        if(error.message === 'Request failed with status code 409') {
         toast.error('User with this username or email already exists');
        }
      }
    } else {
      setErrorMessages(errors);
    }
  };

  return (
    <div className='register-modal-wrapper'>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
>
        <Box sx={{ width: 400, color: '#fff' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Register
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <form onSubmit={handleSubmit}>
        <label htmlFor="firstname">First Name</label>
        <input
          type="text"
          id="firstname"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <label htmlFor="lastname">Last Name</label>
        <input
          type="text"
          id="lastname"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="number"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <label htmlFor="country">Country</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
        >
          <option value="USA/Canada">USA/Canada</option>
          <option value="United Kindom">UK</option>
          <option value="Germany">Germany</option>
          <option value="Bulgaria">Bulgaria</option>
          <option value="France">France</option>
          <option value="Spain">Spain</option>
          <option value="Other">Other</option>
        </select>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="confirm_password">Confirm Password</label>
        <input
          type="password"
          id="confirm_password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          required
        />
        <input type="submit" value="Register" className='text-lg border-1 px-2 mt-2'/>
        <p>{Object.values(errorMessages)[0]}</p>
      </form>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default RegisterForm;