const { response } = require('express');
const express = require('express');
const cors = require('cors');

require('./db/config');
const User = require('./db/users');
const Product = require('./db/product');
const About = require('./db/about');
const Contact = require('./db/contact');

const Jwt = require('jsonwebtoken');
const jwtKey = 'junglee';

const app = express();

app.use(express.json());
app.use(cors());



// Signup
app.post('/signup', async (req, response) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            response.send({ result: "Something went wrong, please try after sometime" });
        }
        response.send({ result, auth: token });
    });
});

// Login
app.post('/login', async (req, response) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne(req.body).select('-password');
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    response.send({ result: "Something went wrong, please try after sometime" });
                }
                response.send({ user, auth: token });
            });
        } else {
            response.send({ result: "no user found" });
        }
    } else {
        response.send({ result: "no user found" });
    }
});

// Add Product
app.post('/add-product', verifyToken, async (req, response) => {
    let product = new Product(req.body);
    let result = await product.save();
    response.send(result);
});

// List Product
app.get('/products', verifyToken, async (req, response) => {
    let products = await Product.find();
    if (products.length > 0) {
        response.send(products)
    } else {
        response.send({ result: "No result Found" });
    }
});

// Delete Product
app.delete('/product/:id', verifyToken, async (req, response) => {
    let result = await Product.deleteOne({ _id: req.params.id })
    response.send(result);
});


// Get Single Product
app.get('/product/:id', verifyToken, async (req, response) => {
    let result = await Product.findOne({ _id: req.params.id })
    if (result) {
        response.send(result);
    } else {
        response.send({ result: "No result Found" });
    }
});

// Update Product
app.put('/product/:id', verifyToken, async (req, response) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    response.send(result);
});

// Search Product
app.get('/search/:key', verifyToken, async (req, response) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { category: { $regex: req.params.key } }
        ]
    });
    response.send(result);
});

// Add About Us Page Data
app.post('/add-about-data', verifyToken, async (req, response) => {
    let aboutData = new About(req.body);
    let result = await aboutData.save();
    response.send(result);
});

// List About Us Page Data
app.get('/about', verifyToken, async (req, response) => {
    let aboutData = await About.find();
    if (aboutData.length > 0) {
        response.send(aboutData)
    } else {
        response.send({ result: "No result Found" });
    }
});

// Update About Us Page Data
app.put('/about/:id', verifyToken, async (req, response) => {
    let result = await About.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    response.send(result);
});

// Add Contact Us Page Data
app.post('/contact', verifyToken, async (req, response) => {
    let contactData = new Contact(req.body);
    let result = await contactData.save();
    response.send(result);
});

// List Conatct Data
app.get('/contact', verifyToken, async (req, response) => {
    let conatct = await Contact.find();
    if (conatct.length > 0) {
        response.send(conatct)
    } else {
        response.send({ result: "No result Found" });
    }
});

// Delete Conatct Data
app.delete('/contact/:id', verifyToken, async (req, response) => {
    let result = await Contact.deleteOne({ _id: req.params.id })
    response.send(result);
});

function verifyToken(req, response, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];
        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                response.status(401).send({ result: "Please provide valid token" });
            } else {
                next();
            }
        });
    } else {
        response.status(403).send({ result: "Please add token with header" });
    }

}



app.listen(5000);