
const express = require('express');
const {registerAdmin, loginAdmin, authenticationApiAdmin} = require('../../controllers/admin/admin.controllers.js');
const verifyJWT = require('../../middleware/authMiddleware.js');




const router = express.Router();

// register affiliate with email and password
router.post("/registerAdmin", registerAdmin);

// login admin
router.post("/loginAdmin", loginAdmin);

router.get("/authenticationApiAdmin", verifyJWT, authenticationApiAdmin);





module.exports = router;