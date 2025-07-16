import Item from '../models/item.model.js';

// Create a new item (lost or found)
export const postItem = async (req, res) => {
  try {
    const { title, description, location, type } = req.body;
    const image = req.file?.filename;
    const postedBy = req.userId;

    const item = await Item.create({ title, description, location, type, image, postedBy });
    res.status(201).json(item);
  } catch (err) {
    console.error('Error posting item:', err);
    res.status(500).json({ error: 'Failed to post item' });
  }
};

// Get all items (optionally filter by type: lost/found)
export const getAllItems = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};

    const items = await Item.find(filter).populate('postedBy', 'name email');
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Error fetching items' });
  }
};

// Get item details by ID
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email phone');

    if (!item) return res.status(404).json({ error: 'Item not found' });

    res.json(item);
  } catch (err) {
    console.error('Error fetching item by ID:', err);
    res.status(500).json({ error: 'Error fetching item' });
  }
};

// Mark an item as claimed (sets claimed status + resolved claim)
export const markItemClaimed = async (req, res) => {
  try {
    const { itemId, claimId } = req.body;

    await Item.findByIdAndUpdate(itemId, {
      isClaimed: true,
      resolvedClaimId: claimId,
    });

    res.json({ message: 'Item marked as claimed' });
  } catch (err) {
    console.error('Error marking item as claimed:', err);
    res.status(500).json({ error: 'Failed to update claim status' });
  }
};