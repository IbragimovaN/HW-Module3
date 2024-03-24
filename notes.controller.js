const chalk = require("chalk");
const fs = require("fs/promises");
const path = require("path");
const notesPath = path.join(__dirname, "db.json");

async function addNote(title) {
  const notes = await getNotes();

  const note = {
    title,
    id: Date.now().toString(),
  };
  notes.push(note);

  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(chalk.bgGreen("Note was added!"));
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function removeNote(id) {
  let notes = await getNotes();
  notes = notes.filter((note) => note.id !== id.toString());
  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(chalk.bgRed("Note was deleted"));
}

async function editNote(id, newData) {
  let notes = await getNotes();

  notes = notes.map((note) => {
    if (note.id === id) {
      return { ...note, title: newData };
    }
    return note;
  });

  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(chalk.bgGreen("Note was edited", id));
}

async function printsNotes() {
  const notes = await getNotes();

  console.log(chalk.bgCyan("Here is the list of notes:"));
  notes.forEach((note) => console.log(chalk.blue(note.id, note.title)));
}

module.exports = {
  addNote,
  getNotes,
  printsNotes,
  removeNote,
  editNote,
};
