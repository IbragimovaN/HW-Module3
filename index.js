const http = require("http");
const chalk = require("chalk");
const fs = require("fs/promises");
const path = require("path");
const {
  addNote,
  getNotes,
  removeNote,
  editNote,
} = require("./notes.controller");
const express = require("express");
const { assert } = require("console");

const app = express();
const port = 3000;
const basePath = path.join(__dirname, "pages");

app.set("view engine", "ejs");
app.set("views", "pages");
app.use(express.json());

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.get("/", async (request, response) => {
  response.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
  });
});

app.post("/", async (request, response) => {
  await addNote(request.body.title);
  response.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: true,
  });
});

app.delete("/:id", async (request, response) => {
  await removeNote(request.params.id);
  response.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
  });
});

app.put("/:id", async (request, response) => {
  await editNote(request.params.id, request.body.title);
  response.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
  });
});

app.listen(port, () => {
  console.log(chalk.green(`Server has been started on port ${port}`));
});
