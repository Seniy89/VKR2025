const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const open = require('open');

// Получаем путь к директории приложения
const appPath = process.pkg ? path.dirname(process.execPath) : __dirname;

// Функция для запуска процесса
function startProcess(command, args, options) {
    const process = spawn(command, args, options);
    
    process.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`${data}`);
    });

    process.on('close', (code) => {
        console.log(`Process exited with code ${code}`);
    });

    return process;
}

// Создаем директорию для MongoDB если её нет
const dbPath = 'C:\\data\\db';
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
}

// Запускаем MongoDB
console.log('Starting MongoDB...');
const mongod = startProcess('mongod', [], {
    stdio: 'inherit',
    shell: true
});

// Запускаем backend
console.log('Starting backend...');
const backend = startProcess('node', [path.join(appPath, 'backend', 'server.js')], {
    stdio: 'inherit',
    shell: true
});

// Запускаем frontend
console.log('Starting frontend...');
const frontend = startProcess('npm', ['start'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.join(appPath, 'frontend')
});

// Открываем приложение в браузере
setTimeout(() => {
    open('http://localhost:3000');
}, 5000);

// Обработка закрытия приложения
process.on('SIGINT', () => {
    console.log('Shutting down...');
    mongod.kill();
    backend.kill();
    frontend.kill();
    process.exit();
});

// Обработка ошибок
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    mongod.kill();
    backend.kill();
    frontend.kill();
    process.exit(1);
}); 