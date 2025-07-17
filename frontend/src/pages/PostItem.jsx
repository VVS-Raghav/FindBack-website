import React, { useState } from 'react';
import {Box,Button,Container,MenuItem,TextField,Typography,Paper,Divider} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import MessageSnackbar from '../components/MessageSnackbar';

const PostItem = () => {
  const navigate = useNavigate();
  const [selectedImageName, setSelectedImageName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const handleClose = () => {
    setMessage('');
    if (messageType === 'success') navigate('/');
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      location: '',
      type: '',
      image: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      location: Yup.string().required('Location is required'),
      type: Yup.string().oneOf(['lost', 'found'], 'Invalid type').required('Type is required'),
      image: Yup.mixed().required('Image is required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });

      try {
        await axios.post('/items', formData);
        setMessage('Item posted successfully!');
        setMessageType('success');
      } catch (err) {
        setMessage(err.response?.data?.error || 'Failed to post item');
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
      <Paper elevation={3} sx={{ p: 4, mt: 6, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom textAlign="center">
          Post Lost / Found Item
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            {...formik.getFieldProps('title')}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            margin="normal"
            {...formik.getFieldProps('description')}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
          <TextField
            fullWidth
            label="Location"
            margin="normal"
            {...formik.getFieldProps('location')}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
          />
          <TextField
            select
            fullWidth
            label="Type"
            margin="normal"
            {...formik.getFieldProps('type')}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
          >
            <MenuItem value="lost">Lost</MenuItem>
            <MenuItem value="found">Found</MenuItem>
          </TextField>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                py: 1.2,
                borderColor:
                  formik.touched.image && formik.errors.image ? 'error.main' : 'primary.main',
                color:
                  formik.touched.image && formik.errors.image ? 'error.main' : 'primary.main',
              }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  formik.setFieldValue('image', e.target.files[0]);
                  setSelectedImageName(e.target.files[0]?.name || '');
                }}
              />
            </Button>

            <Typography
              variant="caption"
              sx={{
                color:
                  formik.touched.image && formik.errors.image
                    ? 'error.main'
                    : 'text.secondary',
              }}
            >
              {formik.touched.image && formik.errors.image
                ? formik.errors.image
                : selectedImageName
                  ? `Selected: ${selectedImageName}`
                  : 'No image selected'}
            </Typography>

          </Box>

          <Box mt={1}>
            <Button type="submit" variant="contained" fullWidth size="large">
              Submit Item
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default PostItem;