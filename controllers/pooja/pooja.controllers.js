const { Pooja, PoojaPlans } = require('../../models/poojaModel/pooja.model.js');

// Create Pooja

const mongoose = require('mongoose');

const createPooja = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const {
            heading,
            subHeading,
            description,
            rating,
            plans,
            benefitsOfPooja,
            poojaVideo
        } = req.body;

        const image = req.file?.path || undefined;

        if (!heading || heading.trim() === "") {
            await session.abortTransaction();
            return res.status(400).json({ success: false, error: "Required fields missing" });
        }

        const newPooja = new Pooja({
            heading,
            image,
            subHeading,
            description,
            rating: rating || 0,
            benefitsOfPooja: benefitsOfPooja || [],
            poojaVideo: poojaVideo || ""
        });


        const newPoojaPlans = [];

        for (const plan of plans) {
            const createdPlan = await PoojaPlans.create([{
                heading: plan.heading,
                amount: plan.amount,
                features: plan.features,
                poojaId: newPooja._id,
                numberOfDays: plan.numberOfDays,
                durationOfPooja: plan.durationOfPooja
            }], { session });

            newPooja.poojaPlans.push(createdPlan[0])
            newPoojaPlans.push(createdPlan[0]);
        }

        await newPooja.save({ session });

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Pooja created successfully",
            pooja: {
                heading: newPooja.heading,
                image: newPooja.image,
                subHeading: newPooja.subHeading,
                description: newPooja.description,
                rating: newPooja.rating,
                benefitsOfPooja: newPooja.benefitsOfPooja,
                poojaVideo: newPooja.poojaVideo,
                poojaPlans: newPooja.poojaPlans
            }
        });

    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({ success: false, error: error.message });
    } finally {
        session.endSession();
    }
};


// const createPooja = async (req, res) => {
//     try {
//         const { heading, subHeading, description, rating, plans, benefitsOfPooja, poojaVideo } = req.body;

//         const image = req.file?.path || undefined;

//         if (!heading || heading.trim() === "") {
//             return res.status(404).json({ success: false, error: "Required fields missing" });
//         }

//         const newPooja = await Pooja.create({
//             heading,
//             image,
//             subHeading,
//             description,
//             rating: rating || 0,
//             benefitsOfPooja: benefitsOfPooja || [],
//             poojaVideo: poojaVideo || ""
//         });

//         const newPoojaPlans = await plans.map(async (plan) => {
//            return await PoojaPlans.create({
//                 heading: plan.heading,
//                 amount: plan.amount,
//                 features: plan.features,
//                 poojaId: newPooja._id,
//                 numberOfDays : plan.numberOfDays,
//                 durationOfPooja : plan.durationOfPooja
//             })
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Pooja created successfully", pooja: {
//                 heading : newPooja.heading,
//                 image : newPooja.image,
//                 subHeading : newPooja.subHeading,
//                 description : newPooja.description,
//                 rating: newPooja.rating,
//                 benefitsOfPooja: newPooja.benefitsOfPooja,
//                 poojaVideo: newPooja.poojaVideo,
//                 plans : newPoojaPlans
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };

// Get all Poojas
const getAllPoojas = async (req, res) => {
    try {
        const poojas = await Pooja.find().select("-video").populate('poojaPlans').sort({ createdAt: -1 });


        return res.status(200).json({
            success: true,
            message: "All Poojas fetched successfully",
            poojas
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Get Pooja by ID
const getPoojaById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ success: false, error: "Pooja ID not provided" });
        }

        const pooja = await Pooja.findById(id).populate('poojaPlans').select("-video");

        if (!pooja) {
            return res.status(404).json({ success: false, error: "Pooja not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Pooja fetched successfully",
            pooja
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const getSelectedPlan = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ success: false, error: "Plan ID not provided" });
        }

        const plan = await PoojaPlans.findById(id);

        if (!plan) {
            return res.status(404).json({ success: false, error: "Pooja not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Plan fetched successfully",
            plan
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

// Update Pooja by ID
const updatePooja = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const image = req.file?.path || undefined;

        const payload = { ...data };

        if (image && image.trim() !== "") {
            payload.image = image;
        }

        const updatedPooja = await Pooja.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });

        if (!updatedPooja) {
            return res.status(200).json({ success: false, error: "Pooja not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Pooja updated successfully",
            pooja: updatedPooja
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Delete Pooja by ID
const deletePooja = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPooja = await Pooja.findByIdAndDelete(id);

        if (!deletedPooja) {
            return res.status(200).json({ success: false, error: "Pooja not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Pooja deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createPooja,
    getAllPoojas,
    getPoojaById,
    updatePooja,
    deletePooja,
    getSelectedPlan
};
