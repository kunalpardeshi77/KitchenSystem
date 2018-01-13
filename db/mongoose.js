var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://kunal:welcome@ds255797.mlab.com:55797/kitchen');

module.exports = {mongoose};
