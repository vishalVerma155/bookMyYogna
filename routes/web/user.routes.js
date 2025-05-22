
const express = require('express');
const {loginUser, registerUser, getUserProfile} = require('../../controllers/web/user.controllers.js');
const verifyJWT = require('../../middleware/authMiddleware.js');




const router = express.Router();

// register affiliate with email and password
router.post("/registerUser", registerUser);

// login admin
router.post("/loginUser", loginUser);

// get user profile
router.get("/getUserProfile", verifyJWT, getUserProfile)




module.exports = router;