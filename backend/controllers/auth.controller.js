const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const upload = require("../middlewares/upload.middleware");

// Generate JWT
const generateToken = (userID) => {
    return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const profileImageURL = req.body.profileImageURL || undefined;
    const adminInviteToken = req.body.adminInviteToken || undefined;

    if (!username || !email || !password) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields" });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        let role = "member";
        if (
            adminInviteToken &&
            adminInviteToken === process.env.ADMIN_INVITE_TOKEN
        ) {
            role = "admin";
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            username,
            email,
            password: hashedPassword,
            role: role,
        };
        if (profileImageURL) userData.profileImageURL = profileImageURL;

        const user = await User.create(userData);

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profileImageURL: user.profileImageURL,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields" });
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profileImageURL: user.profileImageURL,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        if (
            !req.body ||
            (Object.keys(req.body).length === 0 &&
                req.body.constructor === Object)
        ) {
            return res
                .status(400)
                .json({ message: "No data provided to update" });
        }

        const { username, email, password } = req.body;
        if (!username && !email && !password) {
            return res.status(400).json({
                message: "Please provide at least one field to update",
            });
        }

        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (password && password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findById(req.user.id);

        if (user) {
            if (username) user.username = username;
            if (email) user.email = email;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImageURL: updatedUser.profileImageURL,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message,
        });
    }
};

// @desc   Upload profile image
// @route  POST /api/auth/profile/image
// @access Private
const uploadProfileImage = [
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const user = await User.findById(req.user.id);

            if (user) {
                user.profileImageURL = `/uploads/${req.file.filename}`;
                await user.save();
                res.json({
                    message: "Profile image updated successfully",
                    profileImageURL: user.profileImageURL,
                });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                details: error.message,
            });
        }
    },
];

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    uploadProfileImage,
};
