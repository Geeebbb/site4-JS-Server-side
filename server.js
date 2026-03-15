const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/hse_feedback";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB подключена:", MONGO_URI))
  .catch((err) => console.error("Ошибка MongoDB:", err.message));

const feedbackSchema = new mongoose.Schema(
  {
    name:      { type: String, trim: true },
    email:     { type: String, trim: true },
    course:    { type: String },
    topic:     { type: String },
    message:   { type: String, trim: true },
    subscribe: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.get("/feedback", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "feedback.html"));
});

app.get("/submissions", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "submissions.html"));
});

app.post("/api/feedback", async (req, res) => {
  try {
    const { name, email, course, topic, message, subscribe } = req.body;

    const entry = new Feedback({
      name,
      email,
      course,
      topic,
      message,
      subscribe: subscribe === "on" || subscribe === true,
    });

    await entry.save();
    res.redirect("/submissions");
  } catch (err) {
    console.error("Ошибка сохранения:", err.message);
    res.status(500).send("Ошибка при сохранении данных: " + err.message);
  }
});

app.get("/api/feedback", async (req, res) => {
  try {
    const entries = await Feedback.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/feedback/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
