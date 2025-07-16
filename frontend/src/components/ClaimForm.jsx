// components/ClaimForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import { Box, Button, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import axios from '../api/axios';

const ClaimForm = ({ itemId, onClaimSuccess }) => {
  const formik = useFormik({
    initialValues: {
      message: '',
      proofImage: null,
    },
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('itemId', itemId);
      if (values.proofImage) {
        formData.append('proofImage', values.proofImage);
      }

      try {
        const res = await axios.post('/claims', formData);
        onClaimSuccess(res.data);
        resetForm();
      } catch (err) {
        alert('Claim failed');
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Claim This Item
      </Typography>
      <Typography
        fullWidth
        multiline
        label="Please initiate a claim if the item belongs to you."
        name="message"
        margin="normal"
      />
      <Button variant="outlined" component="label">
        Upload Proof Image 
        <input
          type="file"
          hidden
          onChange={(e) => formik.setFieldValue('proofImage', e.target.files[0])}
        />
      </Button>
      <Box mt={2}>
        <Button type="submit" variant="contained">
          Submit Claim
        </Button>
      </Box>
    </Box>
  );
};

export default ClaimForm;
