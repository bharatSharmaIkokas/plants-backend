const { response } = require('express');
const express = require('express');
const cors = require('cors');
require('./db/config');
const User = require('./db/users');
const Product = require('./db/product');
const About = require('./db/about');

const app = express();
app.use(express.json());
app.use(cors());

// Signup
app.post('/signup', async (req, response) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    response.send(result);
});

// Login
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

// Add Product
app.post('/add-product', async (req, response) => {
    let product = new Product(req.body);
    let result = await product.save();
    response.send(result);
});

// List Product
app.get('/products', async (req, response) => {
    let products = await Product.find();
    if(products.length > 0) {
        response.send(products)
    }else{
        response.send({result:"No result Found"});
    }
});

// Delete Product
app.delete('/product/:id', async (req, response) => {
    let result = await Product.deleteOne({_id:req.params.id})
    response.send(result);
});


// Get Single Product
app.get('/product/:id', async (req, response) => {
    let result = await Product.findOne({_id:req.params.id})
    if(result){
        response.send(result);
    }else{
        response.send({result:"No result Found"});
    }
});

// Update Product
app.put('/product/:id', async (req, response) => {
    let result = await Product.updateOne(
        {_id: req.params.id},
        {
            $set: req.body
        }
    )
    response.send(result);
});

// Add About Us Page Data
app.post('/add-about-data', async (req, response) => {
    let aboutData = new About(req.body);
    let result = await aboutData.save();
    response.send(result);
});

// List About Us Page Data
app.get('/about', async (req, response) => {
    let aboutData = await About.find();
    if(aboutData.length > 0) {
        response.send(aboutData)
    }else{
        response.send({result:"No result Found"});
    }
});

// Update About Us Page Data
app.put('/about/:id', async (req, response) => {
    let result = await About.updateOne(
        {_id: req.params.id},
        {
            $set: req.body
        }
    )
    response.send(result);
});



app.listen(5000);