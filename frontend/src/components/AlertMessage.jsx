// components/AlertMessage.jsx
import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const AlertMessage = ({ open, message, severity = 'info', onClose }) => (
  <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default AlertMessage;