const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { PythonShell } = require('python-shell');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'workflowCreator.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('create-workflow', (event, query) => {
  console.log('Received create-workflow request with query:', query);
  
  const options = {
    mode: 'text',
    pythonPath: 'python3', // or 'python' depending on your system
    scriptPath: path.join(__dirname, '..', 'python'),
    args: [query]
  };

  console.log('Starting PythonShell with options:', options);
  let pythonProcess = new PythonShell('planning_agent.py', options);
  
  pythonProcess.on('message', (message) => {
    console.log('Received message from Python:', message);
    event.reply('workflow-progress', message);
  });

  pythonProcess.on('error', (err) => {
    console.error('Python script error:', err);
    event.reply('workflow-error', `Python script error: ${err.message}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python script closed with code ${code}`);
    event.reply('workflow-complete');
  });

  // Set a timeout of 60 seconds
  setTimeout(() => {
    console.log('Python script execution timed out');
    pythonProcess.kill();
    event.reply('workflow-error', 'Python script execution timed out');
  }, 60000);
});
