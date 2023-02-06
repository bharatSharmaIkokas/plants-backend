const mongose = require('mongoose');

const contactSchema = new mongose.Schema({
    name: String,
    email: String,
    message: String,
    userId: String
});

module.exports = mongose.model("contacts", contactSchema);