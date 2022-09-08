const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const {v4:uuidv4} = require('uuid');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Gets currentNotes stored in db.json
app.get('/api/notes', (res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  })
});

// Gets the notes.html page
app.get('/notes', (res) => {
  console.log(path.join(__dirname, '/public/notes.html'));
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Creates a new note and writes it to the db.json
app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    let incomingNote = req.body;
    incomingNote.id= uuidv4();
    let currentNotes = JSON.parse(data);
    currentNotes.push(incomingNote);
  
  fs.writeFile('./db/db.json', JSON.stringify(currentNotes), (err) => {
    if (err) throw err;
    res.json(incomingNote);
  })
  })
})

app.listen(PORT, () => {
  console.log(`App at http://localhost:${PORT}`);
});


