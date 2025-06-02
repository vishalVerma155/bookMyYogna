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
const panditRouter = require("./routes/panditCard/panditCard.routes.js");
const poojaRoutes = require('./routes/poooja/pooja.routes.js');
const bookings = require("./routes/bookings/bookings.routes.js");
const adminRoutes = require("./routes/admin/admin.routes.js");
const notificationRouter = require("./routes/notification/notification.routes.js")

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

// app.use(cors({origin : "*"}))

// DB connection
const dbconnect = require('./config/database.js');

app.use("/user", userRoutes);
app.use('/pandit', panditRouter);
app.use("/pooja", poojaRoutes);
app.use("/bookings", bookings);
app.use("/admin", adminRoutes);
app.use("/notification", notificationRouter)


// Start the server
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
    dbconnect(); // call database
});

// Default route
app.get('/', (req, res) => {
    res.send("Default Route");
});
