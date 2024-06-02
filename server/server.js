const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');



const decodeToken = (token) => {
    try {
        //jwt.decode(token);
        return jwt.decode(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

const app = express();
const PORT = 5000;

const API_KEY = 'cc28fc43';
const BASE_URL = 'http://www.omdbapi.com/';

const MONGO_URI = 'mongodb+srv://akksharass:dbUserPassword@cluster0.z3qrcab.mongodb.net/mydatabase?retryWrites=true';
console.log('Mongo URI: ', MONGO_URI);


if (!MONGO_URI) {
    console.error('MONGO_URI is not defined. Please check your .env file.');
    process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() =>
  console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));



// Enable CORS and parse json body
app.use(cors());
app.use(express.json());


//schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const favSchema = new mongoose.Schema({
    email: String,
    movie: String
});


// model
const User = mongoose.model('users', userSchema);
const Fav = mongoose.model('favs', favSchema);


// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Sign-in route
app.post('/api/signin', async (req, res) => {
    console.log("entered siginin");
    const { email, password } = req.body;
    console.log("email", email);

    try {
         // Check if user exists with provided email
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log("Checked password");
        // Verify password
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // If user exists and password matches, generate JWT token
        const token = jwt.sign({ email: user.email, id: user._id }, 'secret_key');
        console.log(token);
        res.json({ token });
        


    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




  // Sign-up route
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user document
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//Add to favorite
app.post('/api/favorite', async (req, res) => {
    console.log(req.body);
    const token = req.headers.authorization;
    try {
        const varToken = decodeToken(token);
        const email = varToken['email']; 
        const movie = JSON.stringify(req.body);
        console.log(movie);
        const newFav = new Fav({ email, movie });
        newFav.save();
        console.log("Data saved");
        res.status(200).json(movie);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/favorite', async (req, res) => {
    console.log(req.body);
    const token = req.headers.authorization;
    try {
        const varToken = decodeToken(token);
        const email = varToken['email']; 
        
        const fav = await Fav.find({ email: email });

        console.log("Data saved");

        res.status(200).json(fav);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


// Movie Search Route
app.get('/api/search', async (req, res) => {
    const { name,title } = req.query;
    const token = req.headers.authorization;
    try {
        decodeToken(token);
        console.log(decodeToken(token));
        if (title == null) {
            const response = await axios.get(BASE_URL, {
            params: {
                apikey: API_KEY,
                s: name
            }
            });
            console.log(response.data);
        if (response.data.Response === 'True') {
            res.json(response.data);
        } else {
            throw new Error(response.data.Error);
        }
        }
        else {
            const completeResponse = await axios.get(BASE_URL, {
            params: {
                apikey: API_KEY,
                t: name
            }
            });
            console.log(completeResponse.data);
        if (completeResponse.data.Response === 'True') {
            res.json(completeResponse.data);
        } else {
            throw new Error(completeResponse.data.Error);
        }
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
