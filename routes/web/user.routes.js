
const express = require('express');
const {loginUser, registerUser, getUserProfile, logoutUser,authenticationApiUser, getUserProfilesForAdmin, editUser, changeUserPassword} = require('../../controllers/web/user.controllers.js');
const verifyJWT = require('../../middleware/authMiddleware.js');




const router = express.Router();

// register affiliate with email and password
router.post("/registerUser", registerUser);

// login admin
router.post("/loginUser", loginUser);

// get user profile
router.get("/getUserProfile", verifyJWT, getUserProfile);

router.get("/getUserProfilesAdmin", verifyJWT, getUserProfilesForAdmin);


router.get("/logoutUser", verifyJWT, logoutUser);

router.patch("/changeUserPassword", verifyJWT, changeUserPassword);

router.patch("/editUser", verifyJWT, editUser);



router.get("/authenticateUser", verifyJWT, authenticationApiUser);




module.exports = router;