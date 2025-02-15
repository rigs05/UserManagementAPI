import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized Access. Token not found." });
      return;
    }
    // Validate token
    const token = authToken.split(" ")[1];
    jwt.verify(token, JWT_SECRET_KEY as string, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: "Invalid token." });
        return;
      }
      (req as AuthenticatedRequest).email = (
        decoded as { email: string }
      ).email;
      next();
    });
  } catch (e) {
    console.error("Error occurred in Token verification.\n", e);
    res.status(500).json({
      message: "Couldn't validate the JWT, please Login again.",
    });
  }
};
