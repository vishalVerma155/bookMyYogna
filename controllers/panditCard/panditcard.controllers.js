const PanditCard = require('../../models/panditcard/panditcard.model.js');

// Create Pandit
const createPandit = async (req, res) => {
    try {
        const { name, poojaTypes, rating, experience, language } = req.body;

        const img = req.file?.path || undefined; // get image

        if (!name || name && name.trim() === "" || !experience || experience <= 0) {
            return res.status(404).json({ success: false, error: "Required fields missing" });
        }

        const newPandit = await PanditCard.create({
            name,
            image : img? img : undefined,
            poojaTypes: poojaTypes || [],
            rating: rating || 0,
            experience,
            language: language || []
        });

        return res.status(200).json({
            success: true,
            message: "Pandit created successfully",
            pandit: newPandit
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Get all Pandits
const getAllPandits = async (req, res) => {
    try {
        const pandits = await PanditCard.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All Pandits fetched successfully",
            pandits
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Get Pandit by ID
const getPanditById = async (req, res) => {
    try {
        const { id } = req.params;

        if(!id){
            return res.status(404).json({ success: false, error: "Pandit not found" });
        }

        const pandit = await PanditCard.findById(id);

        if (!pandit) {
            return res.status(404).json({ success: false, error: "Pandit not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Pandit fetched successfully",
            pandit
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Update Pandit by ID
const updatePandit = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const img = req.file?.path || undefined; // get image

        const payload = {...data};

        if(img && img.trim() !== ""){
            payload.image = img;
        }


        const updatedPandit = await PanditCard.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });

        if (!updatedPandit) {
            return res.status(200).json({ success: false, error: "Pandit not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Pandit updated successfully",
            pandit: updatedPandit
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Delete Pandit by ID
const deletePandit = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPandit = await PanditCard.findByIdAndDelete(id);

        if (!deletedPandit) {
            return res.status(200).json({ success: false, error: "Pandit not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Pandit deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createPandit,
    getAllPandits,
    getPanditById,
    updatePandit,
    deletePandit
};
