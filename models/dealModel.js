const mongoose = require('mongoose');
const slugify = require('slugify');

const dealSchema = new mongoose.Schema({
    supermarket: String,
    item: {
        type: String, 
        required: [true, 'A product must have a name']
    },
    category: String,
    original_price: { 
        type: Number, 
        required: [true, 'A product must have a price']
    },
    discounted_price: { 
        type: Number, 
        validate: { 
            validator : function(val) {
                return val < this.original_price; //discounted price must be lower than original 
            },
            message: 'Discount price ({VALUE}) should be lower than original price'
        }
    },
    likes: {
     type: Number,
     default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    inventory: {
        type: String,
        required: [true, 'Inventory should be visible'],
        enum: {
            values: ['yes', 'no'],
            message: 'Item is either in inventory (yes) or it is not (no).'
        }
        },
    createdAT: {
        type: Date,
       default: Date.now()
    },
    valid_from: Date,
    valid_until: Date
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create(), !NOT! .update()
dealSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

//CHECK THESE LATER!!!!!
dealSchema.pre(/^find/, function(next) {
    this.find({ secretDeal: { $ne: true } });
  
    this.start = Date.now();
    next();
  });
  
  dealSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
  });
  
  // AGGREGATION MIDDLEWARE
  dealSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretDeal: { $ne: true } } });
  
    console.log(this.pipeline());
    next();
  });

const Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal;



// const testDeal = new Deal({
//     item: 'Fresh Milk 1L',
//     category: 'Dairy',
//     original_price: 1.5,
//     discounted_price: 1.0,
//     likes: 1,
//     dislikes: 2
// });
// testDeal.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log('Error.', err);
// });