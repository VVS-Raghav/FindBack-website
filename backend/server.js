// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/user.routes.js';
import itemRoutes from './routes/item.routes.js';
import claimRoutes from './routes/claim.routes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT || 5000, () => console.log('Server running'));
  })
  .catch(err => console.error('Mongo error:', err));