const User = require('../../models/web/user.model.js');
const { comparePassword, hashPassword } = require('../../utils/bcrypt.js');
const generateJWT = require('../../utils/jwt.js')



// Register
const registerUser = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password
        } = req.body;


        // check blank fields
        if (!fullName || fullName && fullName.trim() === "" || !email || email && email.trim() === "" || !password || password && password.trim() === "") {
            return res.status(401).json({ success: false, error: " Name, Email, and Password are compulsary" });
        }

        // check if affiliate is already existed
        const isUserExisted = await User.findOne({ email });

        // 
        if (isUserExisted) {
            return res.status(401).json({ success: false, error: "User is already existed. Please login or choose other user name" });
        }

        const hashedPassword = await hashPassword(password);

        // create Vendor
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: "user"
        })

        // save affiliate
        await newUser.save();

        // return response
        res.status(200).json({ success: true, Message: "User has been  sucessfully register." });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || email && email.trim() === "" || !password || password && password.trim() === "") {
            return res.status(401).json({ success: false, error: "All fields are compulsary" });
        }

        const user = await User.findOne({ email });


        if (!user) {
            return res.status(401).json({ success: false, error: "User is not existed." });
        }

        // compare password
        const isPasswordCorrect = await comparePassword(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, error: "Invalid password" });
        }

        const payload = {
            _id: user._id,
            email: user.email,
            role: "user"
        }

        // generate jwt token
        const accessToken = generateJWT(payload);

        res.cookie("AccessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        // return response
        return res.status(200).json({ success: true, Message: "User has been sucessfully Loged in." });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

const getUserProfile = async (req, res) => {
    try {

        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({ success: true, error: "user id not found" });
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(400).json({ success: true, error: "user not found" });
        }

        // return response
        return res.status(200).json({ success: true, Message: "User has been sucessfully fetched", user });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}


const getUserProfilesForAdmin = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(400).json({ success: true, error: "Only admin can do this" });
        }

        const user = await User.find().select('-password');

        // return response
        return res.status(200).json({ success: true, Message: "Users has been sucessfully fetched", user });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

const changeUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body; // take details

        if (!currentPassword || currentPassword && currentPassword.trim() === "" || !newPassword || newPassword && newPassword.trim() === "") {
            return res.status(401).json({ success: false, error: "Please enter all fields" });
        }

        const userId = req.user._id;
        const user = await User.findById(userId);

        // compare password
        const isPasswordCorrect = await comparePassword(currentPassword, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, error: "password is not matched" });
        }

        const newHashedPassword = await hashPassword(newPassword); // hash new password
        user.password = newHashedPassword;

        await user.save(); // save user password

        return res.status(200).json({ success: true, Message: "Password has been chenged" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

const editUser = async (req, res) => {
    try {

        const { fullName, country, address, phoneNumber} = req.body;
        const user = req.user._id;
       


        if (!user) {
            return res.status(500).json({ success: false, error: "User is not loged in" });
        }


        let payload = {};
        if (fullName && fullName.trim() !== "") {
            payload.firstName = firstName;
        }


        if (country && country.trim() !== "") {
            payload.country = country;
        }

        if (address && address.trim() !== "") {
            payload.address = address;
        }

        if ( phoneNumber) {
            payload.phoneNumber = phoneNumber;
        }



        const updatedAffiliate = await User.findByIdAndUpdate(user, payload, { new: true, runValidators: true });

        if (!updatedAffiliate) {
            return res.status(400).json({ success: false, error: "User is not updated" });
        }

        return res.status(200).json({ success: true, message: "User is updated", updatedAffiliate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }

}


// Admin Logout
const logoutUser = async (req, res) => {
    try {
        res.clearCookie("AccessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const authenticationApiUser = (req, res) => {
    try {

        return res.status(200).json({ success: true, message: "Authentication successfully." });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
}


module.exports = { registerUser, loginUser, getUserProfile, logoutUser, getUserProfilesForAdmin, authenticationApiUser, changeUserPassword, editUser }
