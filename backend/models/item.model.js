// models/Item.js
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  location: String,
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['lost', 'found'], required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isClaimed: { type: Boolean, default: false },
  resolvedClaimId: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim' },
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
