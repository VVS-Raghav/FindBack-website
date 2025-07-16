import dayjs from 'dayjs';
import Claim from '../models/claim.model.js';
import Item from '../models/item.model.js';

// Make a new claim for a lost or found item
export const makeClaim = async (req, res) => {
  try {
    const { itemId } = req.body;
    const proofImage = req.file?.filename;
    const claimedBy = req.userId;

    const claim = await Claim.create({
      item: itemId,
      claimedBy,
      proofImage,
    });

    res.status(201).json(claim);
  } catch (err) {
    console.error('Error creating claim:', err);
    res.status(500).json({ error: 'Failed to make claim' });
  }
};

// Approve a claim (by item owner or finder depending on flow)
export const approveClaim = async (req, res) => {
  try {
    const { claimId } = req.params;
    const claim = await Claim.findById(claimId).populate('item');

    if (!claim) return res.status(404).json({ error: 'Claim not found' });

    const item = claim.item;

    // Access control
    const isFoundFlow = item.type === 'found' && item.postedBy._id.toString() === req.userId;
    const isLostFlow = item.type === 'lost' && claim.claimedBy.toString() === req.userId;

    if (!isFoundFlow && !isLostFlow) {
      return res.status(403).json({ error: 'Unauthorized to approve this claim' });
    }

    // Mark approved
    claim.isApproved = true;
    claim.approvedAt = new Date();
    await claim.save();

    item.isClaimed = true;
    item.resolvedClaimId = claim._id;
    await item.save();

    res.json({ message: 'Claim approved successfully', claim });
  } catch (err) {
    console.error('Error approving claim:', err);
    res.status(500).json({ error: 'Failed to approve claim' });
  }
};

// Get all claims for a specific item & auto-approve if conditions met
export const getClaimsByItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const claims = await Claim.find({ item: itemId }).populate('claimedBy', 'name email phone');
    const item = await Item.findById(itemId);

    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Auto-approve logic: if only one claim, no proof, and 30 days passed
    if (!item.isClaimed && claims.length === 1) {
      const claim = claims[0];
      const createdDate = dayjs(claim.createdAt);
      const now = dayjs();

      if (!claim.proofImage && now.diff(createdDate, 'day') >= 30) {
        claim.isApproved = true;
        claim.approvedAt = new Date();
        await claim.save();

        item.isClaimed = true;
        item.resolvedClaimId = claim._id;
        await item.save();
      }
    }

    res.json(claims);
  } catch (err) {
    console.error('Error fetching claims:', err);
    res.status(500).json({ error: 'Error fetching claims' });
  }
};

// Lost item poster initiates a claim based on someone's found report
export const initiateClaimByLostUser = async (req, res) => {
  try {
    const { claimId } = req.params;
    const proofImage = req.file?.filename;
    const userId = req.userId;

    const claim = await Claim.findById(claimId).populate('item');

    if (!claim) return res.status(404).json({ error: 'Claim not found' });

    // Check permission
    if (claim.item.postedBy.toString() !== userId) {
      return res.status(403).json({ error: 'Only lost item poster can initiate claim' });
    }

    // Mark initiated by lost person
    claim.initiatedByLostPerson = true;
    claim.lostClaimProofImage = proofImage;
    await claim.save();

    res.json({ message: 'Claim initiated by lost user with proof', claim });
  } catch (err) {
    console.error('Error initiating claim by lost user:', err);
    res.status(500).json({ error: 'Failed to initiate claim' });
  }
};