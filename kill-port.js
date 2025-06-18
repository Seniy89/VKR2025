const { exec } = require('child_process');

function killPort(port) {
  return new Promise((resolve, reject) => {
    // Находим процесс, использующий порт
    exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`Порт ${port} свободен`);
        resolve();
        return;
      }

      // Получаем PID процесса
      const lines = stdout.split('\n');
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length > 4) {
          const pid = parts[parts.length - 1];
          if (pid) {
            // Завершаем процесс
            exec(`taskkill /PID ${pid} /F`, (error) => {
              if (error) {
                console.error(`Ошибка при завершении процесса ${pid}:`, error);
              } else {
                console.log(`Процесс ${pid} завершен`);
              }
              resolve();
            });
            return;
          }
        }
      }
      resolve();
    });
  });
}

// Запускаем функцию
killPort(3000).then(() => {
  console.log('Готово! Теперь можно запускать приложение.');
}); 