import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/db.js";
import adminRoute from "./routes/admin.route.js";
import patientRoute from "./routes/patient.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4500;
dotenv.config();
app.use("/reports", express.static(path.join(__dirname, "reports")));
connectDB();

app.use(express.json());

app.use(
  cors({
    origin: "*", // Allow all origins for testing
  })
);
app.use(cors({ origin: 'https://mediversaldiagnostics.in' }));



app.get("/", (req, res) => {
  return res.send("hello");
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/v1/auth", patientRoute);
app.use("/api/v1/admin", adminRoute);

app.post("/send-mms", async (req, res) => {
  console.log(req.body);
  try {
    const response = await axios.post(
      "https://api.kaleyra.io/v1/messages",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer A925a6e8922f98c5836efa65c5567dccd`,
        },
      }
    );

    res.send(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error sending MMS: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
