import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import playerRoutes from "./routes/player.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/players", playerRoutes);

// Use 5001 to avoid conflict with macOS AirPlay Receiver on 5000
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
})

export default app;