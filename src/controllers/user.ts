import { Request, Response } from "express";
import { User } from "../database/models/userModel";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest";
import { hashPassword } from "../utils/hashPassword";
import { UpdateDataInterface } from "../interfaces/UpdateDataInterface";

// Fetch all users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const userList = await User.find().select("-_id -password -__v");
    if (userList.length === 0) {
      res.status(400).json({ message: "No users found." });
      return;
    }
    res.status(200).json({ users: userList });
  } catch (e) {
    console.error("Error Occurred at User Data Fetching.\n", e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Get Specific User Details
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id: email } = req.params;
    if (!email) {
      res.status(400).json({ message: "Email paramenter is required." });
      return;
    }
    const userData = await User.findOne({ email }).select(
      "-_id -password -__v"
    );
    if (!userData) {
      res.status(404).json({ message: "Unable to find user." });
      return;
    }
    res.status(200).json({ userData });
  } catch (e) {
    console.error("Error Occurred at Fetching User Details.\n", e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Update User Details
export const updateUser = async (req: Request, res: Response) => {
  try {
    // const email = (req as AuthenticatedRequest).email;   // We may also decode the email from JWT token
    const { id: email } = req.params;
    if (!email) {
      res.status(400).json({ message: "Email paramenter is required." });
      return;
    }

    const { new_name, new_email, new_password } = req.body;
    if (!new_name && !new_email && !new_password) {
      res.status(400).json({ message: "No fields provided for update." });
      return;
    }

    // Create an object consisting of the input field(s)
    const updateFields: UpdateDataInterface = {};
    if (new_name) updateFields.name = new_name;
    if (new_email) updateFields.email = new_email;
    if (new_password) {
      await hashPassword(new_password).then(
        (passHash) => (updateFields.password = passHash)
      );
    }

    // Update the data in database
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true, projection: { name: 1, email: 1, _id: 0 } }
    );
    if (!updatedUser) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res
      .status(200)
      .json({ message: "User updated successfully.", updatedUser });
  } catch (e) {
    console.error("Error Occurred at User Updation.\n", e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id: targetEmail } = req.params;
    const loggedInEmail = (req as AuthenticatedRequest).email;
    if (!loggedInEmail) {
      res.status(401).json({ message: "Unauthorized: No token provided." });
      return;
    }

    // Fetch logged-in user's details
    const loggedInUser = await User.findOne({ email: loggedInEmail }).select(
      "isAdmin"
    );
    if (!loggedInUser || !loggedInUser.isAdmin) {
      res.status(404).json({ message: "Only admins can delete users." });
      return;
    }

    // Fetch target user's details and check for certain conditions
    const targetUser = await User.findOne({ email: targetEmail }).select(
      "isAdmin"
    );
    if (!targetUser) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    if (targetEmail === loggedInEmail) {
      res
        .status(403)
        .json({ message: "Admins cannot delete their own account." });
      return;
    }
    if (targetUser.isAdmin) {
      res.status(403).json({ message: "Admins can't delete other admins." });
      return;
    }

    // Delete the user
    const { deletedCount } = await User.deleteOne({ email: targetEmail });
    if (deletedCount === 0) {
      res.status(500).json({ message: "Unable to delete user." });
      return;
    }
    res
      .status(200)
      .json({ message: `User ${targetEmail} deleted successfully.` });
  } catch (e) {
    console.error("Error Occurred at User Deletion.\n", e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
