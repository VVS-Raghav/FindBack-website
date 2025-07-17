import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import MessageSnackbar from '../components/MessageSnackbar';

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const handleClose = ()=>{
    setMessage('');
    if(messageType==='success')navigate('/login');
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string().matches(/^\d{10}$/, 'Phone must be 10 digits').required('Phone is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('/users/register', values);
        setMessage('Registration successful!');
        setMessageType('success');
      } catch (err) {
        setMessage('Registration failed! Please try again');
        setMessageType('error');
      }
    },
  });

  return (
    <Container maxWidth="sm">
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={handleClose}
        />
      )}

      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #d1e1ff 100%)',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight={700}
          gutterBottom
          sx={{ color: '#003366' }}
        >
          Create an Account
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            {...formik.getFieldProps('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            label="Phone"
            variant="outlined"
            margin="normal"
            {...formik.getFieldProps('phone')}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 3,
              py: 1.3,
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #004aad, #0076d1)',
            }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;