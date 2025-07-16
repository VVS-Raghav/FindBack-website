import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ItemCard from '../components/ItemCard';
import Loader from '../components/Loader';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Divider
} from '@mui/material';

const Home = () => {
  const [items, setItems] = useState([]);
  const [type, setType] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/items', {
        params: type !== 'all' ? { type } : {},
      });
      setItems(res.data);
    } catch (err) {
      alert('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type]);

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Box
        sx={{
          py: 10, // increased from 6 to 10
          px: 3,
          textAlign: 'center',
          background: 'linear-gradient(to right, #004aad, #00bcd4)',
          color: 'white',
          borderRadius: 3,
          mb: 5,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontFamily: `'Segoe UI', 'Roboto', sans-serif`,}}>
          Lost Something? Found Something?
        </Typography>

        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ mb: 3, 
            fontFamily: `'Segoe UI', 'Roboto', sans-serif` }}
        >
          Little Things Mean the Most – Help Reunite Them
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            fontSize: '1.1rem',
             fontFamily: `'Segoe UI', 'Roboto', sans-serif`,
            lineHeight: 1.8,
          }}
        >
          Whether you've lost something precious or found someone else's, this portal
          helps you reconnect with what matters — together, let's bring lost things
          back home.
        </Typography>
      </Box>


      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={(_, val) => val && setType(val)}
        sx={{ mb: 4 }}
        color="primary"
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="lost">Lost</ToggleButton>
        <ToggleButton value="found">Found</ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        <Loader />
      ) : items.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 3,
          }}
        >
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </Box>
      ) : (
        <Typography variant="body1" mt={4}>
          No items to show.
        </Typography>
      )}
    </Box>
  );
};

export default Home;