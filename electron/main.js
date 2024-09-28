const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { PythonShell } = require('python-shell');

let mainWindow;
let pythonShell;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'guiExample.html'));
}

function startPythonBackend() {
  const options = {
    mode: 'json',
    pythonPath: 'python3', // or 'python' depending on your system
    scriptPath: path.join(__dirname, '..', 'python'),
  };

  pythonShell = new PythonShell('note_backend.py', options);

  pythonShell.on('message', (message) => {
    if (message.action === 'note_saved') {
      mainWindow.webContents.send('note-saved', message.note);
    } else if (message.action === 'note_list') {
      mainWindow.webContents.send('note-list', message.notes);
    } else if (message.action === 'note_loaded') {
      mainWindow.webContents.send('note-loaded', message.note);
    }
  });

  pythonShell.on('error', (error) => {
    console.error(`Python Error: ${error}`);
  });

  pythonShell.on('close', () => {
    console.log('Python process closed');
  });
}

app.whenReady().then(() => {
  createWindow();
  startPythonBackend();

  ipcMain.on('create-note', (event, note) => {
    pythonShell.send({ action: 'create_note', title: note.title, content: note.content });
  });

  ipcMain.on('update-note', (event, note) => {
    pythonShell.send({ action: 'update_note', id: note.id, title: note.title, content: note.content });
  });

  ipcMain.on('get-note', (event, id) => {
    pythonShell.send({ action: 'get_note', id: id });
  });

  ipcMain.on('get-notes', (event) => {
    pythonShell.send({ action: 'get_all_notes' });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('quit', () => {
  if (pythonShell) {
    pythonShell.end((err) => {
      if (err) console.error('Error closing Python process:', err);
    });
  }
});
