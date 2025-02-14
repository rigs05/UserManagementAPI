import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET;

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
    // Remove bearer
    const token = authToken.split(" ")[1];
    jwt.verify(token, JWT_SECRET as string, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: "Invalid token." });
        return;
      }
      req.name = decoded.name;
    });
    next();
  } catch (e) {
    console.error("Error occurred in Token verification.\n", e);
    res.status(500).json({
      message: "Couldn't validate the JWT, please Login or Signup again.",
    });
  }
};
