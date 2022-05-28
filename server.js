const fs = require('fs');
const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3001;

const { notes } = require("./db/db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Unique ID
const uniqueId = require('generate-unique-id');

//New Note
function newNote(body, noteArr) {
  const note = body;
  noteArr.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: noteArr }, null, 2)
  );
  return note;
};  

//Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  req.body.id = uniqueId();
  const note = newNote(req.body, notes);
  res.json(note);
});
    
//Bonus
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;

  const deleteNote = notes.findIndex(note => note.id === id);

  notes.splice(deleteNote, 1);
  return res.send();
});

//New listener
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});




