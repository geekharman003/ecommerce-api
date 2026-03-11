import jwt from "jsonwebtoken";

export const generateToken = (payload, res) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
};
