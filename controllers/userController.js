import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json({
        success: true,
        users
    });
});

export const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User.create({ name, email, password, role });

    if (user) {
        res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.status(200).json({
            success: true,
            user
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            },
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    await user.deleteOne();
    res.status(200).json({ 
        success: true, 
        message: "User deleted successfully" });
});