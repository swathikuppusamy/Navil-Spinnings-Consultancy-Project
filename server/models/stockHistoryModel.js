const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema(
    {
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'product',
            required: true 
        },
        previousStock: { 
            type: Number, 
            required: true 
        },
        newStock: { 
            type: Number, 
            required: true 
        },
        changeAmount: { 
            type: Number, 
            required: true 
        },
        changeType: { 
            type: String, 
            enum: ['initial', 'addition', 'reduction', 'adjustment'],
            required: true 
        },
        notes: { 
            type: String 
        }
    },
    { timestamps: true }
);

const StockHistory = mongoose.model('StockHistory', stockHistorySchema);
module.exports = StockHistory;