import express from "express";
import db from "./db.js";
import dotenv from "dotenv";
import { body, param, query, validationResult } from "express-validator";

dotenv.config();
const app = express();
app.use(express.json());

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

app.post(
  "/posts",
  [
    body("title")
      .isString()
      .notEmpty()
      .withMessage("Il titolo è obbligatorio."),
    body("insertion_date")
      .isISO8601()
      .withMessage(
        "La data di inserimento deve essere in formato ISO8601 (YYYY-MM-DD)."
      ),
  ],
  validate,
  (req, res) => {
    const { title, insertion_date } = req.body;
    const sql = "INSERT INTO posts (title, insertion_date) VALUES (?, ?)";

    db.query(sql, [title, insertion_date], (err, result) => {
      if (err) {
        console.error("Errore durante l’inserimento del post:", err);
        return res.status(500).json({ error: "Errore del server" });
      }
      res
        .status(201)
        .json({
          message: "Post inserito con successo",
          postId: result.insertId,
        });
    });
  }
);

app.put(
  "/posts/:id",
  [
    param("id")
      .isInt()
      .withMessage("L'ID del post deve essere un numero intero."),
    body("title")
      .isString()
      .notEmpty()
      .withMessage("Il titolo è obbligatorio."),
    body("insertion_date")
      .isISO8601()
      .withMessage(
        "La data di inserimento deve essere in formato ISO8601 (YYYY-MM-DD)."
      ),
  ],
  validate,
  (req, res) => {
    const postId = req.params.id;
    const { title, insertion_date } = req.body;

    const sql = "UPDATE posts SET title = ?, insertion_date = ? WHERE id = ?";

    db.query(sql, [title, insertion_date, postId], (err, result) => {
      if (err) {
        console.error("Errore durante l’aggiornamento del post:", err);
        return res.status(500).json({ error: "Errore del server" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      res.status(200).json({ message: "Post aggiornato con successo" });
    });
  }
);

app.delete(
  "/posts/:id",
  [
    param("id")
      .isInt()
      .withMessage("L'ID del post deve essere un numero intero."),
  ],
  validate,
  (req, res) => {
    const postId = req.params.id;

    const sql = "DELETE FROM posts WHERE id = ?";

    db.query(sql, [postId], (err, result) => {
      if (err) {
        console.error("Errore durante l’eliminazione del post:", err);
        return res.status(500).json({ error: "Errore del server" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      res.status(200).json({ message: "Post eliminato con successo" });
    });
  }
);

app.get("/posts", (req, res) => {
  const sql = "SELECT * FROM posts";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Errore durante il recupero dei post:", err);
      return res.status(500).json({ error: "Errore del server" });
    }
    res.status(200).json(results);
  });
});

app.post(
  "/users",
  [
    body("nickname")
      .isString()
      .notEmpty()
      .withMessage("Il nickname è obbligatorio."),
    body("age")
      .isInt({ min: 0 })
      .withMessage("L'età deve essere un numero intero positivo."),
    body("city").isString().notEmpty().withMessage("La città è obbligatoria."),
  ],
  validate,
  (req, res) => {
    const { nickname, age, city } = req.body;
    const sql = "INSERT INTO users (nickname, age, city) VALUES (?, ?, ?)";

    db.query(sql, [nickname, age, city], (err, result) => {
      if (err) {
        console.error("Errore durante l’inserimento dell'utente:", err);
        return res.status(500).json({ error: "Errore del server" });
      }
      res
        .status(201)
        .json({
          message: "User inserito con successo",
          userID: result.insertId,
        });
    });
  }
);

app.put(
  "/users/:id",
  [
    param("id")
      .isInt()
      .withMessage("L'ID dell'utente deve essere un numero intero."),
    body("nickname")
      .isString()
      .notEmpty()
      .withMessage("Il nickname è obbligatorio."),
    body("age")
      .isInt({ min: 0 })
      .withMessage("L'età deve essere un numero intero positivo."),
    body("city").isString().notEmpty().withMessage("La città è obbligatoria."),
  ],
  validate,
  (req, res) => {
    const userID = req.params.id;
    const { nickname, age, city } = req.body;

    const sql = "UPDATE users SET nickname = ?, age = ?, city = ? WHERE id = ?";

    db.query(sql, [nickname, age, city, userID], (err, result) => {
      if (err) {
        console.error("Errore durante l’aggiornamento dell'utente:", err);
        return res.status(500).json({ error: "Errore del server" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User non trovato" });
      }
      res.status(200).json({ message: "User aggiornato con successo" });
    });
  }
);

app.delete(
  "/users/:id",
  [
    param("id")
      .isInt()
      .withMessage("L'ID dell'utente deve essere un numero intero."),
  ],
  validate,
  (req, res) => {
    const userID = req.params.id;

    const sql = "DELETE FROM users WHERE id = ?";

    db.query(sql, [userID], (err, result) => {
      if (err) {
        console.error("Errore durante l’eliminazione dell’utente:", err);
        return res.status(500).json({ error: "Errore del server" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
      res.status(200).json({ message: "Utente eliminato con successo" });
    });
  }
);

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Errore durante il recupero degli utenti:", err);
      return res.status(500).json({ error: "Errore del server" });
    }
    res.status(200).json(results);
  });
});

app.post(
  "/interactions",
  [
    body("post_id")
      .isInt()
      .withMessage("L'ID del post deve essere un numero intero."),
    body("user_id")
      .isInt()
      .withMessage("L'ID dell'utente deve essere un numero intero."),
    body("interaction_type")
      .isIn(["like", "comment"])
      .withMessage("L'interazione deve essere 'like' o 'comment'."),
    body("interaction_time")
      .isISO8601()
      .withMessage(
        "L'orario dell'interazione deve essere in formato ISO8601 (YYYY-MM-DD HH:MM:SS)."
      ),
  ],
  validate,
  (req, res) => {
    const { post_id, user_id, interaction_type, interaction_time } = req.body;

    const sql =
      "INSERT INTO interactions (post_id, user_id, interaction_type, interaction_time) VALUES (?, ?, ?, ?)";

    db.query(
      sql,
      [post_id, user_id, interaction_type, interaction_time],
      (err, result) => {
        if (err) {
          console.error("Errore durante l’inserimento dell’interazione:", err);
          return res.status(500).json({ error: "Errore del server" });
        }
        res.status(201).json({
          message: "Interazione creata con successo",
          interactionId: result.insertId,
        });
      }
    );
  }
);

app.put(
  "/interactions/:id",
  [
    param("id")
      .isInt()
      .withMessage("L'ID dell'interazione deve essere un numero intero."),
    body("interaction_type")
      .isIn(["like", "comment"])
      .withMessage("L'interazione deve essere 'like' o 'comment'."),
    body("interaction_time")
      .isISO8601()
      .withMessage(
        "L'orario dell'interazione deve essere in formato ISO8601 (YYYY-MM-DD HH:MM:SS)."
      ),
  ],
  validate,
  (req, res) => {
    const interactionId = req.params.id;
    const { interaction_type, interaction_time } = req.body;

    const sql =
      "UPDATE interactions SET interaction_type = ?, interaction_time = ? WHERE id = ?";

    db.query(
      sql,
      [interaction_type, interaction_time, interactionId],
      (err, result) => {
        if (err) {
          console.error(
            "Errore durante l’aggiornamento dell’interazione:",
            err
          );
          return res.status(500).json({ error: "Errore del server" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Interazione non trovata" });
        }
        res
          .status(200)
          .json({ message: "Interazione aggiornata con successo" });
      }
    );
  }
);

app.delete(
  "/interactions/:id",
  [
    param("id")
      .isInt()
      .withMessage("L'ID dell'interazione deve essere un numero intero."),
  ],
  validate,
  (req, res) => {
    const interactionId = req.params.id;

    const sql = "DELETE FROM interactions WHERE id = ?";

    db.query(sql, [interactionId], (err, result) => {
      if (err) {
        console.error("Errore durante l’eliminazione dell’interazione:", err);
        return res.status(500).json({ error: "Errore del server" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Interazione non trovata" });
      }
      res.status(200).json({ message: "Interazione eliminata con successo" });
    });
  }
);

app.get("/interactions", (req, res) => {
  const sql = `
    SELECT 
      posts.id,
      posts.title,
      posts.insertion_date,
      COUNT(CASE WHEN interactions.interaction_type = 'like' THEN 1 END) AS like_count,
      COUNT(CASE WHEN interactions.interaction_type = 'comment' THEN 1 END) AS comment_count
    FROM 
      posts
    LEFT JOIN 
      interactions ON posts.id = interactions.post_id
    GROUP BY 
      posts.id;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(
        "Errore durante il recupero dei post con interazioni:",
        err
      );
      return res.status(500).json({ error: "Errore del server" });
    }
    res.status(200).json(results);
  });
});

app.get(
  "/posts",
  [
    query("insertion_date")
      .optional()
      .isISO8601()
      .withMessage(
        "La data di inserimento deve essere in formato ISO8601 (YYYY-MM-DD)."
      ),
  ],
  validate,
  (req, res) => {
    const { insertion_date } = req.query;
    const sql = `SELECT * FROM posts WHERE insertion_date = ?`;

    db.query(sql, [insertion_date], (err, results) => {
      if (err) {
        console.error("Errore durante il recupero dei post per data:", err);
        return res.status(500).json({ error: "Errore del server" });
      }
      res.status(200).json(results);
    });
  }
);

app.get(
  "/interactions/aggregate",
  [
    query("city").isString().notEmpty().withMessage("La città è obbligatoria."),
    query("interaction_date")
      .isISO8601()
      .withMessage(
        "La data dell'interazione deve essere in formato ISO8601 (YYYY-MM-DD)."
      ),
  ],
  validate,
  (req, res) => {
    const { city, interaction_date } = req.query;
    const sql = `
      SELECT 
        posts.id AS post_id,
        users.city,
        DATE(interactions.interaction_time) AS interaction_date,
        COUNT(*) AS total_interactions
      FROM 
        interactions
      JOIN 
        posts ON interactions.post_id = posts.id
      JOIN 
        users ON interactions.user_id = users.id
      WHERE 
        users.city = ? AND DATE(interactions.interaction_time) = ?
      GROUP BY 
        posts.id, users.city, DATE(interactions.interaction_time);
    `;

    db.query(sql, [city, interaction_date], (err, results) => {
      if (err) {
        console.error(
          "Errore durante il recupero delle interazioni aggregate:",
          err
        );
        return res.status(500).json({ error: "Errore del server" });
      }
      res.status(200).json(results);
    });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});

export default app;
