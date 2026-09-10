import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
});

server.on("error", (error) => {
  console.error("Server error:", error.message);
  process.exit(1);
});
