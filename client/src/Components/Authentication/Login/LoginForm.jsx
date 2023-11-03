import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../Register/RegisterStyles.scss'
import axios from '../../../axiosConfig';
import { useDispatch } from 'react-redux';
import { hideModals } from '../../../redux/features/auth/authModalsSlice';

const LoginForm = ({ handleClose }) => {
  const [loginErrorMsg, setLoginErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginErrorMsg('')
    try {
      axios.post('/user/login', formData)
    } catch (error) {
      setLoginErrorMsg('Invalid email or password')
      console.log(`Login error: ${error}`);
    }
  };

  //redux
  const dispatch = useDispatch()

  const showRegister = () => {
    dispatch(hideModals())
    dispatch(showRegister())
  }

  return (
    <div className='login-modal-wrapper'>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={{ width: 400, color: '#fff' }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Login
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
         <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className=''>
          <button type="submit" className='text-lg border-1 px-2 mt-2'>Login</button>
        </div>
        <p className='text-xs mt-3'>Dont have an account? <br></br> 
        You can register <span className='text-red-500 cursor-pointer' onClick={showRegister}>here</span></p>
        <p>{loginErrorMsg}</p>
      </form>
        </Typography>
      </Box>
    </Modal>
    </div>
  );
};

export default LoginForm;