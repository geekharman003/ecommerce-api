import User from "../models/user.model.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "name,email and password are required" });

    const user = await User.insertOne({
      name,
      email,
      password,
    });

    console.log(user);

    res.status(201).json(user);
  } catch (error) {
    console.log("Error in createUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const findUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "-password -createdAt -updatedAt",
    );

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in findUserById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};