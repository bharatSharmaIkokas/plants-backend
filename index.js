const { response } = require('express');
const express = require('express');
const cors = require('cors');
require('./db/config');
const User = require('./db/users');
const Product = require('./db/product');
const product = require('./db/product');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/signup', async (req, response) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    response.send(result);
});

app.post('/login', async (req, response) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne(req.body).select('-password');
        if (user) {
            response.send(user);
        } else {
            response.send({ result: "no user found" });
        }
    } else {
        response.send({ result: "no user found" });
    }
});

app.post('/add-product', async (req, response) => {
    let product = new Product(req.body);
    let result = await product.save();
    response.send(result);
});

app.get('/products', async (req, response) => {
    let products = await Product.find();
    if(products.length > 0) {
        response.send(products)
    }else{
        response.send({result:"No result Found"});
    }
});

app.delete('/product/:id', async (req, response) => {
    const result = await Product.deleteOne({_id:req.params.id})
    response.send(result);
});



app.listen(5000);