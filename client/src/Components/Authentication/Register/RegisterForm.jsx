import React from 'react';
import Modal from '@mui/material/Modal'; // Import the Modal component
import Box from '@mui/material/Box'; // Import the Box component
import Typography from '@mui/material/Typography'; // Import the Typography component

const RegisterForm = ({handleClose}) => {
  return (
    <div>
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
            <label>First Name</label>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default RegisterForm;