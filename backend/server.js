import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import playerRoutes from "./routes/player.js";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();  

const __dirname = path.resolve();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/players", playerRoutes);

// Use 5001 to avoid conflict with macOS AirPlay Receiver on 5000
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
})

export default app;