import React from 'react';
import { Box, Button, Card, CardContent, CardMedia, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 3,
        boxShadow: 3,
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      {item.image && (
        <CardMedia
          component="img"
          height="160"
          image={`http://localhost:5000/uploads/${item.image}`}
          alt={item.title}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
          {item.description}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          📍 <strong>{item.location}</strong>
        </Typography>
        <Typography variant="body2">
          Type: <Chip label={item.type.toUpperCase()} size="small" color="primary" />
        </Typography>
      </CardContent>

      <Box sx={{ px: 2, pb: 2, pt: 1 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate(`/item/${item._id}`)}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default ItemCard;