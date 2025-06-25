const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const dbClient = require("../utils/db");
const redisClient = require("../utils/redis");

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Basic ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const encoded = authHeader.replace("Basic ", "");
    const decoded = Buffer.from(encoded, "base64").toString();
    const [email, password] = decoded.split(":");

    if (!email || !password) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const hashedPassword = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex");

    try {
      const user = await dbClient.db
        .collection("users")
        .findOne({ email, password: hashedPassword });

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = uuidv4();
      const key = `auth_${token}`;
      await redisClient.set(key, user._id.toString(), 24 * 3600); // 24 hours

      return res.status(200).json({ token });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getDisconnect(req, res) {
    const token = req.headers["x-token"];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await redisClient.del(key);
    return res.status(204).send();
  }
}

module.exports = AuthController;
