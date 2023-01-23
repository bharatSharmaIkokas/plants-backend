const mongose = require('mongoose');

const productSchema = new mongose.Schema({
    name:String,
    price:Number,
    category: String,
    description: String,
    userId: String
});
module.exports = mongose.model("products", productSchema);