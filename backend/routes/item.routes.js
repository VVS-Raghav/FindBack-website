// routes/item.routes.js
import express from 'express';
import multer from 'multer';
import { postItem, getAllItems, getItemById, markItemClaimed } from '../controllers/item.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer for file upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.post('/', verifyToken, upload.single('image'), postItem);
router.get('/', getAllItems);
router.get('/:id', getItemById);
router.patch('/mark-claimed', verifyToken, markItemClaimed);

export default router;
