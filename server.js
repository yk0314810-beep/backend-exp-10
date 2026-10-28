require("dns").setServers(["8.8.8.8", "1.1.1.1"]); // Set DNS servers to Google and Cloudflare
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb+srv://yk0314810_db_user:Yatnesh2311@cluster0.bjvp2gy.mongodb.net/studentdb")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Connection error:", err));

// Schema + Model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: Number, required: true, unique: true },
  course: String,
  marks: Number,
});
const Student = mongoose.model("Student", studentSchema);

// CREATE
app.post("/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// READ one
app.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// UPDATE
app.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Student deleted", student });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));