import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Registers a new user in the system
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
    // Destructure user details from the request body
    const { name, email, role, password } = req.body;

    // Check if a user with the provided email already exists in the database
    const userExists = await User.findOne({ email });

    if (userExists) {
        // If user exists, respond with 400 Bad Request and an error message
        res.status(400);
        throw new Error("User already exists, Try logging in");
    }

    // Create a new user document in the database with the provided details
    const user = await User.create({
        name,
        email,
        role,
        password,
    });

    if (user) {
        // If user creation is successful, respond with 201 Created and user info (excluding password)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,   
        });
    } else {
        // If user creation fails, respond with 400 Bad Request and an error message
        res.status(400);
        throw new Error("Invalid user data");
    }
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    }else {
        res.status(400);
        throw new Error("Invalid email or password");
    }

});