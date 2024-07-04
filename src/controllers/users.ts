import { RequestHandler } from "express";
import env from "../util/validateEnv";
import nodemailer from "nodemailer";
import UserModel from "../models/user";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { signJWT, verifyJWT } from "../util/jwt.utils";
import mongoose from "mongoose";

// Configure nodemailer with SMTP settings
const config = {
    host: env.SMTP_SERVER_ADDRESS,
    port: env.SMTP_PORT,
    secure: false,
    auth: {
        user: env.SMTP_LOGIN,
        pass: env.SMTP_PASSWORD,
    },
    FRONTENDURL: env.FRONTENDURL
};

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(config);

// Handler to get the authenticated user's details
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Interface for the request body of UserSignUp handler
interface UserSignUpBody {
    username?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    dob?: string,
    email?: string,
    address?: string,
    town?: string,
    postcode?: string,
    phoneNumber?: string,
    altPhoneNumber?: string,
    gender?: string,
    ethnicity?: string,
    disability?: string,
    disabilityDetails?: string,
    assistance?: string,
    emergencyName?: string,
    emergencyPhone?: string,
    emergencyRelationship: string,
    role?: string,
}

// Handler to sign up a new user
export const UserSignUp: RequestHandler<unknown, unknown, UserSignUpBody, unknown> = async (req, res, next) => {
    const {
        username,
        password: passwordRaw,
        firstName,
        lastName,
        dob,
        email,
        address,
        town,
        postcode,
        phoneNumber,
        altPhoneNumber,
        gender,
        ethnicity,
        disability,
        disabilityDetails,
        assistance,
        emergencyName,
        emergencyPhone,
        emergencyRelationship,
    } = req.body;
    const role = "user";

    try {
        if (!username || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username }).exec();
        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different username or log in instead");
        }

        const newUser = await UserModel.create({
            username,
            password: passwordRaw, // Store raw password
            firstName,
            lastName,
            dob,
            email,
            address,
            town,
            postcode,
            phoneNumber,
            altPhoneNumber,
            gender,
            ethnicity,
            disability,
            disabilityDetails,
            assistance,
            emergencyName,
            emergencyPhone,
            emergencyRelationship,
            role,
        });

        const accessToken = signJWT({ email: newUser.email }, "24h");
        const link = `${config.FRONTENDURL}/resetpassword/${newUser._id}`;

        const data = await transporter.sendMail({
            from: "xinbai24@student.wintec.ac.nz",
            to: newUser.email,
            subject: "Your Application has been approved",
            html: `<p>Dear ${firstName} ${lastName},</p>
                   <p>We would love to inform you that your application with Waka Eastern Bay Community Transport has been approved.</p>
                   <p>Please click the <a href="${link}">link</a> to activate your account.</p>
                   <p>This link will only be valid for 24 hours from the time you received this email.</p>
                   <p>Please click the "forgot password" again if the link has expired.</p>
                   <p>Ngā mihi/Kind regards,</p>
                   <p>Reneé Lubbe</p>
                   <p>Project Manager</p>
                   <p><a href="https://wakaeasternbay.org.nz">https://wakaeasternbay.org.nz</a></p>
                   <p>Waka Eastern Bay Community Transport</p>`
        });

        console.log("Message sent: %s", data.response);
        res.status(201).json({ accessToken, rawPassword: passwordRaw }); // Return raw password in response
    } catch (error) {
        next(error);
    }
};

// Interface for the request body of UserLogin handler
interface UserLoginBody {
    username?: string,
    password?: string,
}

// Handler to log in a user
export const UserLogin: RequestHandler<unknown, unknown, UserLoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ username: username }).select("+password +username").exec();

        if (!user) {
            throw createHttpError(401, "Username is incorrect");
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Password is incorrect");
        }

        req.session.userId = user._id;
        res.status(201).json(user);

    } catch (error) {
        next(error);
    }
};

// Handler to log out a user
export const UserLogout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};

// Interface for the request body of ForgotPassword handler
interface ForgotPasswordBody {
    email?: string,
}

// Handler to handle forgot password functionality
export const ForgotPassword: RequestHandler<unknown, unknown, ForgotPasswordBody, unknown> = async (req, res, next) => {
    const email = req.body.email;

    try {
        if (!email) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ email: email }).select("+email").exec();

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        // Create JWT for password reset
        const accessToken = signJWT({ email: user.email }, "1h");

        const link = `${config.FRONTENDURL}/ForgotPasswordReceivedPage/${user._id}`;

        // Send email to the user with the password reset link
        const data = await transporter.sendMail({
            "from":  env.SMTP_LOGIN,
            "to": user.email,
            "subject": "Reset your password",
            "html": `<p>Dear ${user.firstName}, ${user.lastName}</p>
            <p>Please click the <a href="${link}"> link</a> "${link}" to change your current password.</p>
            <p>This link will only be valid for 1 hour from the time you received this email.</p>
            <p>Please click the "reset password" again if the link has expired.</p>
            <p>Ngā mihi/Kind regards.</p>
            <p>Reneé Lubbe</p>
            <p>Project Manager</p>
            <p><a href="https://wakaeasternbay.org.nz">https://wakaeasternbay.org.nz</a></p>
            <p>Waka Eastern Bay Community Transport</p>`
        });

        res.status(200).json(data.response);
        res.status(200).json(accessToken);

    } catch (error) {
        next(error);
    }
};

// Interface for the request parameters of ChangePassword handler
interface ChangePasswordParams {
    userId: string,
    accessToken: string,
}

// Interface for the request body of ChangePassword handler
interface ChangePasswordBody {
    password?: string,
}

// Handler to change the password of a user
export const ChangePassword: RequestHandler<ChangePasswordParams, unknown, ChangePasswordBody, unknown> = async (req, res, next) => {
    const passwordRaw = req.body.password;
    const userId = req.params.userId;

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user Id");
        }

        const user = await UserModel.findById(userId).exec();

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        if (!passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        // Hash the new password before saving it to the database
        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        user.password = passwordHashed;
        const changePassword = await user.save();

        res.status(200).json([]);
    } catch (error) {
        next(error);
    }
};
