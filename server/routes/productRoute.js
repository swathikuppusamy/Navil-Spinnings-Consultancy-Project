const express = require('express');
const router = express.Router();
const Product = require('../models/productmodel');
const StockHistory = require('../models/stockHistoryModel'); // Import the new model
const path = require('path');

// Create a new product
router.post('/', async (req, res) => {
    try {
        // Create new product
        const newProduct = new Product(req.body);
        await newProduct.save();
        
        // Add initial stock history entry
        const stockHistory = new StockHistory({
            productId: newProduct._id,
            previousStock: 0,
            newStock: newProduct.availablestock,
            changeAmount: newProduct.availablestock,
            changeType: 'initial',
            notes: 'Initial product creation'
        });
        await stockHistory.save();
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get stock history for a product
router.get('/:id/history', async (req, res) => {
    try {
        const stockHistory = await StockHistory.find({ productId: req.params.id })
                                              .sort({ createdAt: -1 });
        
        res.status(200).json(stockHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    try {
        // Find current product to get previous stock value
        const currentProduct = await Product.findById(req.params.id);
        if (!currentProduct) return res.status(404).json({ message: 'Product not found' });
        
        const previousStock = currentProduct.availablestock;
        const newStock = req.body.availablestock || previousStock;
        
        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        
        // Only create stock history if stock changed
        if (previousStock !== newStock) {
            // Record stock change in history
            const stockHistory = new StockHistory({
                productId: updatedProduct._id,
                previousStock: previousStock,
                newStock: newStock,
                changeAmount: newStock - previousStock,
                changeType: newStock > previousStock ? 'addition' : 'reduction',
                notes: req.body.notes || 'Stock adjustment'
            });
            await stockHistory.save();
        }
        
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update stock directly (for inventory adjustments)
router.post('/:id/stock', async (req, res) => {
    try {
        const { adjustment, changeType, notes } = req.body;
        
        // Find current product
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        const previousStock = product.availablestock;
        let newStock = previousStock;
        
        // Calculate new stock based on change type
        if (changeType === 'set') {
            newStock = parseInt(adjustment);
        } else if (changeType === 'add') {
            newStock = previousStock + parseInt(adjustment);
        } else if (changeType === 'subtract') {
            newStock = Math.max(0, previousStock - parseInt(adjustment)); // Prevent negative stock
        }
        
        // Update product stock
        product.availablestock = newStock;
        await product.save();
        
        // Record in history
        const stockHistory = new StockHistory({
            productId: product._id,
            previousStock,
            newStock,
            changeAmount: newStock - previousStock,
            changeType: changeType === 'set' ? 'adjustment' : 
                       (newStock > previousStock ? 'addition' : 'reduction'),
            notes: notes || 'Stock adjustment'
        });
        await stockHistory.save();
        
        res.status(200).json({ 
            product,
            stockChange: {
                previousStock,
                newStock,
                difference: newStock - previousStock
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        
        // Also delete all stock history for this product
        await StockHistory.deleteMany({ productId: req.params.id });
        
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;