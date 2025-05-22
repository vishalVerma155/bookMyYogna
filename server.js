const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');


// Load config from env file
require("dotenv").config();
const PORT = process.env.PORT || 4000;


// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());

// routes
const userRoutes = require('./routes/web/user.routes.js');
const panditRouter = require("./routes/panditCard/panditCard.routes.js")

app.use(cors({
    origin: "*"
}));

// app.use(cors({origin : "*"}))

// DB connection
const dbconnect = require('./config/database.js');

app.use("/user", userRoutes);
app.use('/pandit', panditRouter);


// Start the server
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
    dbconnect(); // call database
});

// Default route
app.get('/', (req, res) => {
    res.send("Default Route");
});
