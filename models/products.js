var mongoose = require('mongoose');

var Products = mongoose.model('Products', {
  productName: {
    type: String,
    required: true,
    minlength: 1,
    default: "dummy product"
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  createdTillNow: {
    type: Number,
    required: true,
    default: 0
  },
  predicted: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = {Products};
