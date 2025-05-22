
const express = require('express');
const verifyJWT = require('../../middleware/authMiddleware.js');
const { createPooja,
    getAllPoojas,
    getPoojaById,
    updatePooja,
    deletePooja} = require('../../controllers/pooja/pooja.controllers.js');
const { upload } = require('../../utils/multer.js');





const router = express.Router();

// create pandit card
router.post("/createPooja", verifyJWT, upload.single('poojaImage'), createPooja);

router.get("/getAllPoojas", getAllPoojas);

router.get("/getPooja/:id", getPoojaById);

router.patch("/updatePooja/:id", verifyJWT,upload.single('poojaImage'), updatePooja);

router.delete("/deletePooja/:id", verifyJWT, deletePooja);





module.exports = router;