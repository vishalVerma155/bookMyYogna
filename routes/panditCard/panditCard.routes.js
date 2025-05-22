
const express = require('express');
const verifyJWT = require('../../middleware/authMiddleware.js');
const { createPandit,
    getAllPandits,
    getPanditById,
    updatePandit,
    deletePandit } = require('../../controllers/panditCard/panditcard.controllers.js');
const { upload } = require('../../utils/multer.js');





const router = express.Router();

// create pandit card
router.post("/createPanditCard", verifyJWT, upload.single('panditImage'), createPandit);

router.get("/getAllPandits", getAllPandits);

router.get("/getPandit/:id", getPanditById);

router.patch("/updatePanditcard/:id", verifyJWT, updatePandit);

router.delete("/deletePanditCard/:id", verifyJWT, deletePandit);





module.exports = router;