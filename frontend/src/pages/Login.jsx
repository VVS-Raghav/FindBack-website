import React, { useState } from 'react';
import {Button,Container,TextField,Typography,Paper} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import MessageSnackbar from '../components/MessageSnackbar';

const Login = () => {
  const navigate = useNavigate();
    const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const handleClose = ()=>{
    setMessage('');
    if(messageType==='success')navigate('/');
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post('/users/login', values);
        localStorage.setItem('token', res.data.token);
        setMessage('Login successful!');
        setMessageType('success');
      } catch (err) {
        setMessage(err.response?.data?.error || 'Login failed! Please try again');
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
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight={700}
          gutterBottom
          sx={{ color: '#003366' }}
        >
          Login to Your Account
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            {...formik.getFieldProps('email')}
            margin="normal"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            {...formik.getFieldProps('password')}
            margin="normal"
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
              background: 'linear-gradient(to right, #004aad, #0076d1)',
              fontWeight: 'bold',
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;