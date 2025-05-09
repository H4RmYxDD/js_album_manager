import sqlite from "sqlite3";

const db = new sqlite.Database("./data/database.sqlite");

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}
export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}
export async function initializeDatabase() {
    await dbRun(
        "CREATE TABLE IF NOT EXISTS albums (id INTEGER PRIMARY KEY AUTOINCREMENT, title STRING, artist INTEGER, releaseDate DATE, genre STRING, coverUrl STRING)"
    );
    const rows = await dbAll("SELECT * FROM albums");
    if (rows.length === 0) {
        await dbRun(
            "INSERT INTO albums (title, artist, releaseDate, genre, coverUrl) VALUES ('UTOPIA', 'Travis Scott', '2023-07-28', 'Hip-Hop', 'https://images.genius.com/93c577bcd2cce45a2e7063978bcb3b1a.1000x1000x1.png')"
        );
    }
}
export async function resetIds() {
    await dbRun("CREATE TABLE temp_albums AS SELECT title, artist, releaseDate, genre, coverUrl FROM albums");

    await dbRun("DROP TABLE albums");

    await dbRun(
        "CREATE TABLE albums (id INTEGER PRIMARY KEY AUTOINCREMENT, title STRING, artist INTEGER, releaseDate DATE, genre STRING, coverUrl STRING)"
    );

    await dbRun("INSERT INTO albums (title, artist, releaseDate, genre, coverUrl) VALUES ('UTOPIA', 'Travis Scott', '2023-07-28', 'Hip-Hop', 'https://images.genius.com/93c577bcd2cce45a2e7063978bcb3b1a.1000x1000x1.png')");

    await dbRun("DROP TABLE temp_albums");
}