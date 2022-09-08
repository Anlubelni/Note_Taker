let noteTitleInput;
let noteTextArea;
let saveButton;
let newNoteButton;
let noteList;

if (window.location.pathname === "/notes") {
  noteTitleInput = document.querySelector(".note-title");
  noteTextArea = document.querySelector(".note-textarea");
  saveButton = document.querySelector(".save-note");
  newNoteButton = document.querySelector(".new-note");
  noteList = document.querySelectorAll(".list-container .list-group");
}

// Object representing note currently being displayed
let currentNote = {};

const renderCurrentNote = () => {
  hideElement(saveButton);

  if (currentNote.id) {
    noteTitleInput.setAttribute("readonly", true);
    noteTextArea.setAttribute("readonly", true);
    noteTitleInput.value = currentNote.title;
    noteTextArea.value = currentNote.text;
  } else {
    noteTitleInput.removeAttribute("readonly");
    noteTextArea.removeAttribute("readonly");
    noteTitleInput.value = "";
    noteTextArea.value = "";
  }
};

// Obtain saved notes and render them in a list
const renderNoteList = async () => {
  let savedNotes = await getSavedNotes().json();
  if (window.location.pathname === "/notes") {
    noteList.forEach((el) => (el.innerHTML = ""));
  }

  let noteListItems = [];
  if (savedNotes.length === 0) {
    noteListItems.push(createListItem("No saved Notes", false));
  }

  savedNotes.forEach((note) => {
    const listItem = createListItem(note.title);
    listItem.dataset.note = JSON.stringify(note);

    noteListItems.push(listItem);
  });

  if (window.location.pathname === "/notes") {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Creates a list item based on text
const createListItem = (text) => {
  const listItem = document.createElement("li");
  listItem.classList.add("list-group-item");

  const span = document.createElement("span");
  span.classList.add("list-item-title");
  span.innerText = text;
  span.addEventListener("click", displaySelectedNote);

  listItem.append(span);

  return listItem;
};

// Gets saved notes from API
const getSavedNotes = () =>
  fetch("/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

// Saves a note through the API
const saveNote = (note) =>
  fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

// Handler for when the save note button is clicked
const saveNoteClick = () => {
  const newNote = {
    title: noteTitleInput.value,
    text: noteTextArea.value,
  };
  saveNote(newNote).then(() => {
    renderNoteList();
    renderCurrentNote();
  });
};

// Sets the currentNote and displays it
const displaySelectedNote = (e) => {
  e.preventDefault();
  currentNote = JSON.parse(e.target.parentElement.getAttribute("data-note"));
  renderCurrentNote();
};

// Resets the current note to render a "new" one
const newNoteClick = (e) => {
  currentNote = {};
  renderCurrentNote();
};

// Displays the save button based on whether or not there is content available
const displaySaveButton = () => {
  if (!noteTitleInput.value.trim() || !noteTextArea.value.trim()) {
    hideElement(saveButton);
  } else {
    showElement(saveButton);
  }
};

// Show element passed in
const showElement = (elem) => {
  elem.style.display = "inline";
};

// Hide element passed in
const hideElement = (elem) => {
  elem.style.display = "none";
};

// Adds event listeners when on the notes page.
if (window.location.pathname === "/notes") {
  saveButton.addEventListener("click", saveNoteClick);
  newNoteButton.addEventListener("click", newNoteClick);
  noteTitleInput.addEventListener("keyup", displaySaveButton);
  noteTextArea.addEventListener("keyup", displaySaveButton);
}

renderNoteList();
