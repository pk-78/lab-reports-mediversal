import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/db.js";
import patientRoute from "./routes/patient.route.js";


const app = express();
const port = process.env.PORT || 4500;
dotenv.config();


connectDB()



app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  return res.send("hello");
});
app.use("/api/v1/auth",patientRoute)

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});


