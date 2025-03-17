const mongoose = require('mongoose');
//const slugify = require('slugify');

const dealSchema = new mongoose.Schema({
    item: {
        type: String, 
        required: [true, 'A product must have a name']
    },
    category: String,
    original_price: { 
        type: Number, 
        required: [true, 'A product must have a price']
    },
    likes: Number,
    dislikes: Number
});

const Deal = mongoose.model('Deal', dealSchema);

const testDeal = new Deal({
    item: 'Fresh Milk 1L',
    category: 'Dairy',
    original_price: 1.5,
    likes: 1,
    dislikes: 2
});
testDeal.save().then(doc => {
    console.log(doc);
}).catch(err => {
    console.log('Error.', err);
});