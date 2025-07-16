import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    proofImage: String, // Uploaded by claimant in "found" flow

    isApproved: {
      type: Boolean,
      default: false
    },
    approvedAt: Date,

    initiatedByLostPerson: {
      type: Boolean,
      default: false
    },
    lostClaimProofImage: String // Uploaded by poster of lost item
  },
  { timestamps: true }
);

export default mongoose.model('Claim', claimSchema);