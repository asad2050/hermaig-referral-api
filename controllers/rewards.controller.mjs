import User from "../models/user.model.mjs";

export const getUserRewards = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("rewardPoints");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(!user.rewardPoints ){
      return res.status(200).json({
        rewards: [],
      });}
    return res.status(200).json({
      rewardPoints: user.rewardPoints,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving rewards" });
  }
};
