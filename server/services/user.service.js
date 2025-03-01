import { apiErrors } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserServiceClass {
    // Generate password for OAuth users
    generatePassword(googleId, name) {
        const numbers = googleId.slice(0, 4);
        const letters = name.replace(/\s+/g, '').slice(0, 4);
        return (numbers + letters).padEnd(8, "X");
    }

    // Token generator
    async tokenGenerator(user) {
        if (!user) {
            throw new apiErrors(404, "Token Generation :: User Does Not Exist");
        }

        const accessToken = jwt.sign(
            { _id: user._id, email: user.email, name: user.name },
            process.env.ACCESS_SECRET,
            { expiresIn: process.env.ACCESS_SECRET_EXPIRY || "15m" }
        );

        const refreshToken = jwt.sign(
            { _id: user._id },
            process.env.REFRESH_SECRET,
            { expiresIn: process.env.REFRESH_SECRET_EXPIRY || "7d" }
        );

        return { accessToken, refreshToken };
    }

    // Register user
    async registerUser(name, email, password) {
        if (!name || !email || !password) {
            throw new apiErrors(400, "Missing Required Fields");
        }

        let user = await User.findOne({ email });
        if (user) {
            throw new apiErrors(409, "User Already Exists");
        }

        user = await User.create({ name, email, password });
        if (!user) {
            throw new apiErrors(424, "Failed To Create New User");
        }

        const { accessToken, refreshToken } = await this.tokenGenerator(user);
        user.refreshTokens.push(refreshToken);
        await user.save();

        const { password: _, ...userWithoutPassword } = user.toObject();
        return { newUser: { ...userWithoutPassword, accessToken }, accessToken, refreshToken };
    }

    // Login user
    async loginUser(email, password) {
        if (!email || !password) {
            throw new apiErrors(400, "Missing Email or Password");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new apiErrors(404, "User Does Not Exist");
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new apiErrors(401, "Invalid Password");
        }

        const { accessToken, refreshToken } = await this.tokenGenerator(user);
        if (user.refreshTokens.length >= 5) {
            user.refreshTokens.shift();
        }
        user.refreshTokens.push(refreshToken);
        await user.save();

        const { password: _, refreshTokens, ...userWithoutPassword } = user.toObject();
        return { user: { ...userWithoutPassword, accessToken }, accessToken, refreshToken };
    }

    // Logout user
    async logoutUser(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new apiErrors(404, "User Not Found");
        }

        user.refreshTokens = [];
        await user.save();
        return user;
    }

    // Google login
    async googleLogin(user) {
        if (!user) {
            throw new apiErrors(401, "Google Authentication Failed");
        }

        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
            const password = this.generatePassword(user.id, user.name);
            existingUser = await User.create({
                name: user.displayName,
                email: user.email,
                password,
            });
        }

        const { accessToken, refreshToken } = await this.tokenGenerator(existingUser);
        if (existingUser.refreshTokens.length >= 5) {
            existingUser.refreshTokens.shift();
        }
        existingUser.refreshTokens.push(refreshToken);
        await existingUser.save();

        const { password: _, refreshTokens, ...userWithoutPassword } = existingUser.toObject();
        return { existingUser: userWithoutPassword, accessToken, refreshToken };
    }

//Github Login
async githubLogin(user){
    if (!user) {
        throw new apiErrors(401, "Github Authentication Failed");
    }

    let existingUser = await User.findOne({ username: user.username });
    if (!existingUser) {
        const password = this.generatePassword(user.id, user.name);
        existingUser = await User.create({
            name: user.displayName,
            username: user.username,
            password,
        });
    }

    const { accessToken, refreshToken } = await this.tokenGenerator(existingUser);
    if (existingUser.refreshTokens.length >= 5) {
        existingUser.refreshTokens.shift();
    }
    existingUser.refreshTokens.push(refreshToken);
    await existingUser.save();

    const { password: _, refreshTokens, ...userWithoutPassword } = existingUser.toObject();
    return { existingUser: userWithoutPassword, accessToken, refreshToken };
}
}


const UserService = new UserServiceClass();
export default UserService;
