import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../Register/RegisterStyles.scss'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux';
import { hideModals, showRegister } from '../../../redux/features/auth/authModalsSlice';
import { useForm } from "react-hook-form"
import { fetchCurrentUser, login } from '../../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router';

const LoginForm = ({ handleClose, isFromGamesPage, gameLink }) => {

  const dispatch = useDispatch()

  const navigate = useNavigate();

  const handleShowRegister = () => {
    dispatch(showRegister())
  }

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(login(data));

      if (login.fulfilled.match(res)) {
        toast.success('Login successful');
        const token = res.payload.accessToken;
        await dispatch(fetchCurrentUser(token));
        setTimeout(() => {
          if(isFromGamesPage) {
          navigate(gameLink);
        } else {
            navigate("/");
          }
        }, 400);
        dispatch(hideModals());
      } else {
        setError("password", {
          type: "manual",
          message: "Invalid username or password"
        });
        // toast.error('Invalid username or password');
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', err);
    }
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
        <Box id="modal-modal-description" sx={{ mt: 2 }}>
         <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="username"
            id="username"
            name="username"
            // value={formData.email}
            // onChange={handleChange}
            {...register("username")}
            style={{ color: '#000' }}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            // value={formData.password}
            // onChange={handleChange}
            {...register("password", { required: "Password is required" })}
            style={{ color: '#000' }}
            required
          />
          {/* {errors.password && <span className='text-red-500 text-sm block'>This field is required</span>} */}
          {errors.password && (
            <span className='text-red-500 text-sm block mt-3'>{errors.password.message}</span>
          )}
        </div>
        <div className=''>
          <button type="submit" className='text-lg border-1 px-2 mt-2'>Login</button>
        </div>
        <p className='text-xs mt-3'>Dont have an account? <br></br> 
        You can register <span className='text-red-500 cursor-pointer' onClick={handleShowRegister}>here</span></p>
        {/* <p>{loginErrorMsg}</p> */}
      </form>
      </Box>
      </Box>
    </Modal>
    </div>
  );
};

export default LoginForm;