import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function MessageSnackbar({message,messageType, handleClose}) {
  return (
    <div>
      <Snackbar open={true} autoHideDuration={1500} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={messageType}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
