const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

const Item = require('./models/Item');


app.post('/api/items', async (req, res) => {           //req for creating itms
    try {
        const { name, type, parentId } = req.body;

        // Validate input
        if (!name || !type) {
            return res.status(400).json({ error: 'Name and type are required' });
        }

        const newItem = new Item({ name, type, parentId });
        await newItem.save();
        res.json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// Get all items
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// Update an item (rename)
app.patch('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ error: 'Name cannot be empty' });
        }

        const updatedItem = await Item.findByIdAndUpdate(id, { name: name.trim() }, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Item.findByIdAndDelete(id);
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
