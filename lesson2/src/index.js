import express from "express";
import fs from "fs/promises";
import { logger } from "../middlewares/loggerMiddleware.js";
import { count } from "console";

const PORT = 3000;

const app = express();
app.use(express.json());

app.use(logger);

const readNotes = async () => {
  try {
    const data = await fs.readFile("./data/notes.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeNotes = async (data) => {
  await fs.writeFile(
    "./data/notes.json",
    JSON.stringify(data, null, 2),
    "utf-8",
  );
};

app.get("/notes", async (req, res) => {
  const notes = await readNotes();

  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes,
  });
});

app.listen(PORT, () => {
  console.log(`Server ishlamoqda: http://localhost:${PORT}`);
});
