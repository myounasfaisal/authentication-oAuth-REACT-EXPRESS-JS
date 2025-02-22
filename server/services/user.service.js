import { apiErrors } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

class UserServiceClass {
    // Token generator
    tokenGenerator = async (user) => {
        if (!user) {
            throw new apiErrors(404, "Token Generation :: User Does Not Exist");
        }

        const accessToken = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                name: user.name,
            },
            process.env.ACCESS_SECRET,
            { expiresIn: process.env.ACCESS_SECRET_EXPIRY || "15m" }
        );

        const refreshToken = jwt.sign(
            {
                _id: user._id,
            },
            process.env.REFRESH_SECRET,
            { expiresIn: process.env.REFRESH_SECRET_EXPIRY || "7d" }
        );

        return { accessToken, refreshToken };
    };

    // Register user
    async registerUser(name, email, password) {
        if (!name) {
            throw new apiErrors(400, "Name Missing");
        }

        if (!email) {
            throw new apiErrors(400, "Email Missing");
        }

        if (!password) {
            throw new apiErrors(400, "Password Missing");
        }

        let newUser = await User.findOne({ email });
        if (newUser) {
            throw new apiErrors(409, "User Already Exists");
        }

        newUser = await User.create({ name, email, password });
        if (!newUser) {
            throw new apiErrors(424, "Failed To Create New User");
        }

        const { accessToken, refreshToken } = await this.tokenGenerator(newUser);
        newUser.refreshTokens.push(refreshToken);
        await newUser.save();
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        newUser = {...userWithoutPassword,accessToken};
        return { newUser, accessToken, refreshToken };
    }

    // Login user
    async loginUser(email, password) {
        // Validate input
        if (!email) {
            throw new apiErrors(400, "Login :: Email is required");
        }
    
        if (!password) {
            throw new apiErrors(400, "Login :: Password is required");
        }
    
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new apiErrors(404, "Login :: User Does Not Exist");
        }
    
        // Check if the password is valid
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new apiErrors(401, "Invalid Password");
        }
    
        // Generate tokens
        const { accessToken, refreshToken } = await this.tokenGenerator(user);
    
        // Manage refreshTokens array (limit to 5 tokens)
        if (user.refreshTokens.length >= 5) {
            user.refreshTokens.shift(); // Remove the oldest token
        }
        user.refreshTokens.push(refreshToken); // Add the new token
        await user.save(); // Save the updated user document

        // Remove the password field from the user object
        const { password: _, refreshTokens, ...userWithoutPassword } = user.toObject();
        // Return the user object without the password and only the most recent refreshToken
        return {
            user: { ...userWithoutPassword, refreshToken,accessToken },
            accessToken,
            refreshToken,
        };
    }

    // Logout user
    async logoutUser(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new apiErrors(404, "Logout :: User Not Found");
        }

        // Clear refreshTokens array
        user.refreshTokens = [];
        await user.save();

        return user;
    }

    // Google login
    async googleLogin(user) {
        if (!user) {
            throw new apiErrors(401, "Google Authentication Failed");
        }

        let existingUser = await User.findOne({ googleId: user._id });
        if (!existingUser) {
            existingUser = await User.create({
                name: user.displayName,
                email: user.emails[0].value,
                googleId: user.id,
            });
        }

        const { accessToken, refreshToken } = await this.tokenGenerator(existingUser);
        existingUser.refreshTokens.push(refreshToken);
        await existingUser.save();

        return { existingUser, accessToken, refreshToken };
    }
    async 
}

const UserService = new UserServiceClass();
export default UserService;