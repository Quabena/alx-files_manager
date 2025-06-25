const { MongoClient } = require("mongodb");

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || "files_manager";

    const uri = `mongodb://${host}:${port}`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.db = null;

    this.client.connect((err) => {
      if (err) {
        console.error("MongoDB connection error:", err.message || err);
      } else {
        this.db = this.client.db(dbName);
      }
    });
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    if (!this.isAlive()) return 0;
    return this.db.collection("users").countDocuments();
  }

  async nbFiles() {
    if (!this.isAlive()) return 0;
    return this.db.collection("files").countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
