const User = require('../../models/web/user.model.js');
const { comparePassword, hashPassword } = require('../../utils/bcrypt.js');
const generateJWT = require('../../utils/jwt.js');
const Admin = require('../../models/admin/admin.model.js');
const {sendOTPEmail} = require('../../utils/emailServices.js');
const generateOTP = require('../../utils/otpGenerater.js');
const axios = require('axios');



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

        const admin = await Admin.findOne({ role: "admin" })

        const notification = await axios.post(
            "https://bookmyyogna.onrender.com/notification/createNotification",
            {
                recipient: admin._id,
                heading: `New user registered`,
                message: `New user ${newUser.fullName} has been register on Book my yagna`,
                sender: userId,
                senderRole: req.user.role,
                receiverRole: admin.role
            }
        );

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

        const { fullName, country, address, phoneNumber } = req.body;
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

        if (phoneNumber) {
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

const forgotPassword = async (req, res) => {

   try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      const otp = generateOTP();
      const hashedOTP = await hashPassword(otp);

      user.otp = hashedOTP;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      await user.save();

      await sendOTPEmail(email, otp);
      res.status(200).json({ success: true, message: 'OTP sent to email' });

   } catch (error) {
      res.status(500).json({ success: false, message: 'Error sending email', error: error.message });
   }
};


const matchOTP = async (req, res) => {
   try {
      const { email, otp } = req.body;

      if(!otp || !email){
         return res.status(400).json({ success: false, error: 'otp and email are required' });
      }

      const credential = {};

      if (email && email.trim() !== "") {
         credential.email = email
      }

      const user = await User.findOne(credential);
      if (!user) {
         return res.status(400).json({ success: false, error: 'User not found' });
      }


      if (user.otpExpires < Date.now()) {
         return res.status(400).json({ message: 'OTP has expired' });
      }

      const isOTPCorrect = await comparePassword(otp, user.otp);

      if (!isOTPCorrect) {
         return res.status(400).json({ success: false, error: 'Invalid OTP' });
      }

      return res.status(200).json({ success: true, message: 'Otp matched successfully' });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

const resetPassword = async (req, res) => {
   try {
      const { email, otp, newPassword } = req.body;

      const user = await User.findOne({email});

      if (!user) {
         return res.status(400).json({ success: false, error: 'User not found' });
      }

      if (!user.otp) {
         return res.status(400).json({ success: false, error: 'Otp not found' });
      }
      
      if (!user.otpExpires || user.otpExpires < Date.now()) {
         return res.status(400).json({ message: 'OTP has expired' });
      }
      
      const isOTPCorrect = await comparePassword(otp, user.otp);
      
      if (!isOTPCorrect) {
         return res.status(400).json({ success: false, error: 'Invalid OTP' });
      }
      
      const hashedPassword = await hashPassword(newPassword);
     
      user.password = hashedPassword;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
   
      res.status(200).json({ success: true, message: 'Password reset successful' });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Error sending email', error: error.message });
   }
};


module.exports = { registerUser, loginUser, getUserProfile, logoutUser, getUserProfilesForAdmin, authenticationApiUser, changeUserPassword, editUser, forgotPassword, matchOTP, resetPassword }