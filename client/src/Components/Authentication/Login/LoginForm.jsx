import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../Register/RegisterStyles.scss'
import axios from 'axios';

const LoginForm = ({ handleClose }) => {
  const [loginErrorMsg, setLoginErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    username: '',
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
      axios.post('/server/v1/user/login', formData)
    } catch (error) {
      setLoginErrorMsg('Invalid username or password')
      console.log(`Login error: ${error}`);
    }
  };

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
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
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
        <div>
          <button type="submit">Login</button>
        </div>
        <p>{loginErrorMsg}</p>
      </form>
        </Typography>
      </Box>
    </Modal>
    </div>
  );
};

export default LoginForm;