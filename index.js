const yargs = require("yargs");
const pkg = require("./package.json");
const { addNote, printsNotes, removeNote } = require("./notes.controller");

yargs.version(pkg.version);

yargs.command({
  command: "add",
  describe: "Add new note to list",
  builder: {
    title: {
      type: "string",
      describe: "note title",
      demandOption: true,
    },
  },
  handler({ title }) {
    addNote(title);
  },
});

yargs.command({
  command: "list",
  describe: "Print all notes",
  async handler() {
    printsNotes();
  },
});

yargs.command({
  command: "remove",
  describe: "Remove note by id",
  async handler({ id }) {
    removeNote(id);
  },
});

yargs.parse();
