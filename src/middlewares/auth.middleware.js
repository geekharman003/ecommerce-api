import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split("=")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - provide the jwt token" });
    }

    //   verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized - token is invalid/expired" });
    }

    // check the user in the db
    const user = await User.findById(decoded.id).select(
      "-password -createdAt -updatedAt",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // attach the user info on request
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in authenticate middlewawre:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorized - user is not admin" });
  }
};
