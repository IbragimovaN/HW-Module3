const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");
const {
  addNote,
  getNotes,
  removeNote,
  editNote,
} = require("./notes.controller.js");
const { addUser, loginUser } = require("./user.controller.js");

const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/register", async (request, response) => {
  response.render("register", {
    title: "express App",
    error: undefined,
  });
});

app.get("/login", async (request, response) => {
  response.render("login", {
    title: "express App",
    error: undefined,
  });
});

app.post("/login", async (request, response) => {
  try {
    const token = await loginUser(request.body.email, request.body.password);

    response.cookie("token", token, { httpOnly: true });

    response.redirect("/");
  } catch (error) {
    response.render("login", {
      title: "express App",
      error: error.message,
    });
  }
});

app.post("/register", async (request, response) => {
  try {
    await addUser(request.body.email, request.body.password);
    response.redirect("/login"); //если все ок то перенаправляем пользователя на логин
  } catch (error) {
    if (error.code === 11000) {
      response.render("register", {
        title: "express App",
        error: "Email is already registered",
      });

      return;
    }
    response.render("register", {
      title: "express App",
      error: error.message,
    });
  }
});

app.get("/logout", (request, response) => {
  response.cookie("token", "", { httpOnly: true });

  response.redirect("/login");
});

app.use(auth);
app.get("/", async (request, response) => {
  response.render("index", {
    title: "express App",
    notes: await getNotes(),
    userEmail: request.user.email,
    created: false,
    error: false,
  });
});

app.post("/", async (request, response) => {
  try {
    await addNote(request.body.title, request.user.email);
    response.render("index", {
      title: "express App",
      notes: await getNotes(),
      userEmail: request.user.email,
      created: true,
      error: false,
    });
  } catch (e) {
    console.log("creation error:", e);
    response.render("index", {
      title: "express App",
      notes: await getNotes(),
      userEmail: request.user.email,
      created: false,
      error: true,
    });
  }
});

app.delete("/:id", async (request, response) => {
  try {
    await removeNote(request.params.id);
    response.render("index", {
      title: "express App",
      notes: await getNotes(),
      userEmail: request.user.email,
      created: false,
      error: false,
    });
  } catch (error) {
    response.render("index", {
      title: "express App",
      notes: await getNotes(),
      userEmail: request.user.email,
      created: false,
      error: error.message,
    });
  }
});

app.put("/:id", async (request, response) => {
  try {
    await editNote(request.params.id, request.body.title);
    response.render("index", {
      title: "express App",
      notes: await getNotes(),
      userEmail: request.user.email,
      created: true,
      error: false,
    });
  } catch (error) {
    response.render("index", {
      title: "express App",
      notes: await getNotes(),
      userEmail: request.user.email,
      created: true,
      error: error.messge,
    });
  }
});

mongoose
  .connect(
    "mongodb+srv://Anastasiya:Qwer-2114@cluster0.eqmonej.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`Server has been started on port ${port}`));
    });
  });
