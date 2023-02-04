const mongose = require('mongoose');

const aboutSchema = new mongose.Schema({
    subTile: String,
    title: String,
    description: String
});

module.exports = mongose.model("aboutus", aboutSchema);