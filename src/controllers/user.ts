import { Request, Response } from "express";

// Fetch all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    console.error("Error Occurred at User Data Fetching.\n", e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// // Create User
// export const createUser = async (req: Request, res: Response) => {
//   try {
//   } catch (e) {
//     console.error("Error Occurred at Create User.\n", e);
//     res.status(500).json({ message: "Internal Server Error." });
//   }
// };

// Get Specific User Details
export const getUser = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    console.error("Error Occurred at Fetching User Details.\n", e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Update User Details
export const updateUser = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    console.error("Error Occurred at User Updation.\n", e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // Check for isAdmin flag
  } catch (e) {
    console.error("Error Occurred at User Deletion.\n", e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
