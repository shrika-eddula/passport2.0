const { ipcRenderer } = require('electron');

let currentNoteId = null;

document.addEventListener('DOMContentLoaded', () => {
    const newNoteButton = document.getElementById('new-note');
    const saveNoteButton = document.getElementById('save-note');
    const noteList = document.getElementById('note-list');
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');

    newNoteButton.addEventListener('click', () => {
        currentNoteId = null;
        noteTitle.value = '';
        noteContent.value = '';
    });

    saveNoteButton.addEventListener('click', () => {
        const title = noteTitle.value;
        const content = noteContent.value;
        
        if (currentNoteId) {
            ipcRenderer.send('update-note', { id: currentNoteId, title, content });
        } else {
            ipcRenderer.send('create-note', { title, content });
        }
    });

    ipcRenderer.on('note-saved', (event, note) => {
        currentNoteId = note.id;
        updateNoteList();
    });

    ipcRenderer.on('note-list', (event, notes) => {
        noteList.innerHTML = '';
        notes.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note.title;
            li.addEventListener('click', () => loadNote(note.id));
            noteList.appendChild(li);
        });
    });

    function loadNote(id) {
        ipcRenderer.send('get-note', id);
    }

    ipcRenderer.on('note-loaded', (event, note) => {
        currentNoteId = note.id;
        noteTitle.value = note.title;
        noteContent.value = note.content;
    });

    updateNoteList();
});

function updateNoteList() {
    ipcRenderer.send('get-notes');
}
