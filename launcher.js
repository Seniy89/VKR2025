const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;
let mongod;
let backend;
let frontend;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        resizable: false,
        frame: false,
        transparent: true
    });

    mainWindow.loadFile('launcher.html');
    mainWindow.setAlwaysOnTop(true);
}

function startApplication() {
    // Создаем директорию для MongoDB если её нет
    const dbPath = 'C:\\data\\db';
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
    }

    // Запускаем MongoDB
    mongod = spawn('mongod', [], {
        stdio: 'ignore',
        shell: true
    });

    // Запускаем backend
    backend = spawn('node', [path.join(__dirname, 'backend', 'server.js')], {
        stdio: 'ignore',
        shell: true
    });

    // Запускаем frontend
    frontend = spawn('npm', ['start'], {
        stdio: 'ignore',
        shell: true,
        cwd: path.join(__dirname, 'frontend')
    });

    // Открываем приложение в браузере
    setTimeout(() => {
        require('open')('http://localhost:3000');
        mainWindow.close();
    }, 5000);
}

app.whenReady().then(() => {
    createWindow();
    startApplication();
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

app.on('before-quit', () => {
    if (mongod) mongod.kill();
    if (backend) backend.kill();
    if (frontend) frontend.kill();
}); 