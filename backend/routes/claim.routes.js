// routes/claim.routes.js
import express from 'express';
import multer from 'multer';
import { makeClaim, getClaimsByItem, approveClaim, initiateClaimByLostUser } from '../controllers/claim.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.post('/', verifyToken, upload.single('proofImage'), makeClaim);
router.post('/:claimId/approve',verifyToken, approveClaim);
router.post('/:claimId/initiate',verifyToken,upload.single('proofImage'),initiateClaimByLostUser);
router.get('/:itemId', getClaimsByItem);

export default router;
