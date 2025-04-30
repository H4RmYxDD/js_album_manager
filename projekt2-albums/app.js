import express from "express";
import cors from "cors";
import { initializeDatabase, dbAll, dbGet, dbRun, resetIds } from "./util/database.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());

app.get("/albums", async (req, res) => {
  const albums = await dbAll("SELECT * FROM albums");
  res.status(200).json(albums);
});
app.get("/albums/search", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).send("Search query is required");
  }

  const albums = await dbAll(
    "SELECT * FROM albums WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ?",
    [`%${query}%`, `%${query}%`, `%${query}%`]
  );

  res.status(200).json(albums);
});

app.get("/albums/:id", async (req, res) => {
  const id = req.params.id;
  const albums = await dbGet("SELECT * FROM albums WHERE id = ?;", [id]);
  if (!albums) {
    return res.status(404).json({ message: "album not found" });
  }
  res.status(200).json(albums);
});

app.post("/albums", async (req, res) => {
  console.log("Received data:", req.body); // Debugging

  const { title, artist, releaseDate, genre, coverUrl } = req.body;

  if (!title || !artist || !releaseDate || !genre) {
      console.error("Missing required fields");
      return res.status(400).send("Title, artist, release date, and genre are required");
  }

  await dbRun(
      "INSERT INTO albums (title, artist, releaseDate, genre, coverUrl) VALUES (?, ?, ?, ?, ?)",
      [title, artist, releaseDate, genre, coverUrl]
  );

  res.status(201).send("Album added successfully");
});

app.put("/albums/:id", async (req, res) => {
    const id = req.params.id;
    const { title, artist, releaseDate, genre, coverURL } = req.body;

    if (!title || !artist || !releaseDate || !genre || !coverURL) {
        return res.status(400).send("title, artist, releaseDate, genre, coverURL are required");
    }

    const result = await dbRun(
        "UPDATE albums SET title = ?, artist = ?, releaseDate = ?, genre = ?, coverURL = ? WHERE id = ?",
        [title, artist, releaseDate, genre, coverURL, id]
    );

    if (result.changes === 0) {
        return res.status(404).send("albums entry not found");
    }

    res.status(200).send("albums entry updated successfully");
});

app.delete("/albums/:id", async (req, res) => {
    const id = req.params.id;
    const albums = await dbGet("SELECT * FROM albums WHERE id = ?", [id]);
    if (!albums) {
        return res.status(404).json({ message: "albums entry not found" });
    }

    await dbRun("DELETE FROM albums WHERE id = ?", [id]); // Delete the specific row

    try {
        await resetIds(); // Reset the IDs
    } catch (error) {
        console.error("Error resetting IDs:", error);
        return res.status(500).json({ message: "Failed to reset IDs" });
    }

    res.status(200).send("albums entry deleted and IDs reset");
});


async function startServer() {
  await initializeDatabase();
  app.listen(3000, () => {
    console.log("Server runs on port 3000");
  });
}
startServer();
