const Admin = require('../../models/admin/admin.model.js');
const generateJWT = require("../../utils/jwt.js");
const {comparePassword, hashPassword} = require('../../utils/bcrypt.js')

const registerAdmin = async (req, res) => {
    try {

        const { fullName, email, password } = req.body;

        const isAdminExisted = await Admin.find();

        if (isAdminExisted.length > 1) {
            return res.status(401).json({ Message: "Admin is already existed. There can be only one admin" })
        }

        // check blank fields
        const isBlank = [fullName, email, password].some(fields => fields.trim() === "");

        if (isBlank) {
            return res.status(401).json({ Message: "All fields are compulsary" });
        }


        const hashedPassword = await hashPassword(password);

        // create admin
        const newUser = new Admin({
            fullName,
            email,
            password: hashedPassword
        })

        // save admin
        await newUser.save();


        if (!newUser) {
            return res.status(404).json({ Message: "Something wen wrong. Admin not saved." });
        }

        // return response
        res.status(200).json({ success: true, Message: "Admin has been  sucessfully register." });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};


// login admin
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check blank fields
        const isBlank = [email, password].some(fields => fields.trim() === "");

        if (isBlank) {
            return res.status(401).json({ Message: "All fields are compulsary" });
        }

        // check admin is existed
        const user = await Admin.findOne({ email });

        if (!user) {
            return res.status(401).json({ Message: "Admin is not existed." });
        }

        // compare password
        const isPasswordCorrect = await comparePassword(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ Message: "Invalid password" });
        }


        // generate jwt token
        const accessToken = generateJWT({
            _id: user._id,
            email: user.email,
            fullName : user.fullName
        });

        await user.save();

        res.cookie("AccessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        }); // set jwt token in cookies

        // return response
        res.status(200).json({ success: true, Message: "Admin has been  sucessfully Loged in." });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = {registerAdmin, loginAdmin}

