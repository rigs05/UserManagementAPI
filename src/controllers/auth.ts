import { Request, Response } from "express";
import { User } from "../database/models/userModel";
import { hashPassword } from "../utils/hashPassword";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET;
import * as bcrypt from "bcrypt";

// Create User
export const userSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const { role: userType } = req.body.role;
    // Check for existing user
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      res.status(200).json({
        message: "User with this email already exists, please Login.",
      });
      return;
    }
    /** Validate the input **/
    const passHash = await hashPassword(password);
    // Insert data into db
    const newUser = new User({ name, email, password: passHash, userType });
    await newUser.save();
    res
      .status(200)
      .json({ message: "User created successfully. Please Login." });
    return;
  } catch (e) {
    console.error("Error Occurred at User Signup.\n", e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const isUserExists = await User.findOne({ email });
    if (!isUserExists) {
      res.status(404).json({
        message: "User does not exists in the database. Please Sign up!",
      });
      return;
    }

    // verify credentials
    bcrypt.compare(password, isUserExists.password, (err, result) => {
      if (err) {
        res
          .status(401)
          .json({ message: "Invalid password. Please try again." });
        return;
      }
    });

    // generate jwt token and login
    jwt.sign(
      { email },
      JWT_SECRET as string,
      {
        algorithm: "RS256",
        expiresIn: "1h",
      },
      function (err, token) {
        if (err) {
          console.error("Error while creating JWT token.");
          res.status(403).json({ message: "Unable to login at this moment." });
          return;
        }
        res.status(200).json({ message: "Logged in Successfully.", token });
        return;
      }
    );
  } catch (e) {
    console.error("Error Occurred at User Login.\n", e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
