const chalk = require("chalk");
const Note = require("./models/Note");

async function addNote(title, owner) {
  await Note.create({ title, owner });
  console.log(chalk.bgGreen("Note was added!"));
}

async function getNotes() {
  const notes = await Note.find();
  return notes;
}

async function removeNote(id) {
  const result = await Note.deleteOne({ _id: id });
  console.log(result);
  if (result.matchedCount === 0) {
    throw new Error("No note to edit");
  }
  console.log(chalk.bgRed("Note was deleted"));
}

async function editNote(id, newData) {
  const result = await Note.updateOne({ _id: id }, { title: newData });
  console.log(result);
  if (result.matchedCount === 0) {
    throw new Error("No note to edit");
  }
  console.log(chalk.bgGreen("Note was edited", id));
}

module.exports = {
  addNote,
  getNotes,
  removeNote,
  editNote,
};
