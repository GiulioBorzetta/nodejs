import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";
import app from "../app.js";
import db from "../db.js";

describe("API Tests", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("GET /posts - dovrebbe restituire tutti i post", async () => {
    const mockResults = [
      { id: 1, title: "Post 1", insertion_date: "2024-10-01" },
      { id: 2, title: "Post 2", insertion_date: "2024-10-02" },
    ];

    sinon.stub(db, "query").callsFake((sql, callback) => {
      callback(null, mockResults);
    });

    const res = await request(app).get("/posts");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(2);
    expect(res.body[0].title).to.equal("Post 1");
  });

  it("POST /posts - dovrebbe creare un nuovo post", async () => {
    const newPost = { title: "Nuovo Post", insertion_date: "2024-11-15" };

    sinon.stub(db, "query").callsFake((sql, values, callback) => {
      callback(null, { insertId: 1 });
    });

    const res = await request(app).post("/posts").send(newPost);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message", "Post inserito con successo");
    expect(res.body).to.have.property("postId", 1);
  });

  it("PUT /posts/:id - dovrebbe aggiornare un post", async () => {
    const postId = 1;
    const updatedPost = {
      title: "Post Aggiornato",
      insertion_date: "2024-12-01",
    };

    sinon.stub(db, "query").callsFake((sql, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const res = await request(app).put(`/posts/${postId}`).send(updatedPost);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "message",
      "Post aggiornato con successo"
    );
  });

  it("DELETE /posts/:id - dovrebbe eliminare un post", async () => {
    const postId = 1;

    sinon.stub(db, "query").callsFake((sql, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const res = await request(app).delete(`/posts/${postId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Post eliminato con successo");
  });

  it("GET /users - dovrebbe restituire tutti gli utenti", async () => {
    const mockUsers = [
      { id: 1, nickname: "Alice", age: 30, city: "Roma" },
      { id: 2, nickname: "Bob", age: 25, city: "Milano" },
    ];

    sinon.stub(db, "query").callsFake((sql, callback) => {
      callback(null, mockUsers);
    });

    const res = await request(app).get("/users");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(2);
    expect(res.body[0].nickname).to.equal("Alice");
  });

  it("POST /users - dovrebbe creare un nuovo utente", async () => {
    const newUser = { nickname: "Charlie", age: 28, city: "Torino" };

    sinon.stub(db, "query").callsFake((sql, values, callback) => {
      callback(null, { insertId: 1 });
    });

    const res = await request(app).post("/users").send(newUser);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message", "User inserito con successo");
    expect(res.body).to.have.property("userID", 1);
  });

  it("PUT /users/:id - dovrebbe aggiornare un utente", async () => {
    const userId = 1;
    const updatedUser = {
      nickname: "User Aggiornato",
      age: 32,
      city: "Napoli",
    };

    sinon.stub(db, "query").callsFake((sql, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const res = await request(app).put(`/users/${userId}`).send(updatedUser);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "message",
      "User aggiornato con successo"
    );
  });

  it("DELETE /users/:id - dovrebbe eliminare un utente", async () => {
    const userId = 1;

    sinon.stub(db, "query").callsFake((sql, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const res = await request(app).delete(`/users/${userId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "message",
      "Utente eliminato con successo"
    );
  });

  it("GET /interactions - dovrebbe restituire tutte le interazioni", async () => {
    const mockInteractions = [
      {
        id: 1,
        post_id: 1,
        user_id: 1,
        interaction_type: "like",
        interaction_time: "2024-11-10 10:00:00",
      },
      {
        id: 2,
        post_id: 2,
        user_id: 2,
        interaction_type: "comment",
        interaction_time: "2024-11-11 11:00:00",
      },
    ];

    sinon.stub(db, "query").callsFake((sql, callback) => {
      callback(null, mockInteractions);
    });

    const res = await request(app).get("/interactions");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(2);
    expect(res.body[0].interaction_type).to.equal("like");
  });

  it("POST /interactions - dovrebbe creare una nuova interazione", async () => {
    const newInteraction = {
      post_id: 1,
      user_id: 1,
      interaction_type: "like",
      interaction_time: "2024-11-15 12:00:00",
    };

    sinon.stub(db, "query").callsFake((sql, values, callback) => {
      callback(null, { insertId: 1 });
    });

    const res = await request(app).post("/interactions").send(newInteraction);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property(
      "message",
      "Interazione creata con successo"
    );
    expect(res.body).to.have.property("interactionId", 1);
  });

  it("PUT /interactions/:id - dovrebbe aggiornare un’interazione", async () => {
    const interactionId = 1;
    const updatedInteraction = {
      interaction_type: "comment",
      interaction_time: "2024-12-01 10:00:00",
    };

    sinon.stub(db, "query").callsFake((sql, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const res = await request(app)
      .put(`/interactions/${interactionId}`)
      .send(updatedInteraction);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "message",
      "Interazione aggiornata con successo"
    );
  });

  it("DELETE /interactions/:id - dovrebbe eliminare un’interazione", async () => {
    const interactionId = 1;

    sinon.stub(db, "query").callsFake((sql, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const res = await request(app).delete(`/interactions/${interactionId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "message",
      "Interazione eliminata con successo"
    );
  });
});
