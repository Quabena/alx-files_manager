const crypto = require("crypto");
const dbClient = require("../utils/db");
const redisClient = require("../utils/redis");

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    if (!password) {
      return res.status(400).json({ error: "Missing password" });
    }

    try {
      const userExists = await dbClient.db
        .collection("users")
        .findOne({ email });

      if (userExists) {
        return res.status(400).json({ error: "Already exist" });
      }

      const hashedPassword = crypto
        .createHash("sha1")
        .update(password)
        .digest("hex");

      const result = await dbClient.db.collection("users").insertOne({
        email,
        password: hashedPassword,
      });

      return res.status(201).json({ email, id: result.insertedId });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getMe(req, res) {
    const token = req.headers["x-token"];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await dbClient.db
      .collection("users")
      .findOne({ _id: dbClient.getObjectId(userId) });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({ email: user.email, id: user._id });
  }
}

module.exports = UsersController;
