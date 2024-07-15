const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const MAX_FILE_SIZE = 10 * 1024; // 10KB in bytes
const LOG_DIR = 'C:\\MonitoringSW\\Logs';
// CORS 
app.use(cors());
// 요청 본문을 JSON으로 파싱하기 위한 미들웨어
app.use(express.json());

app.get('/zzzz',(req, res) => {
  res.json({ss:'ss'})
})

app.post('/log', (req, res) => {
  const { message, stack } = req.body;
  const logMessage = `${new Date().toLocaleString('ko-KR')}\nError \n${message}\nStack Trace:\n${stack}\n\n`;

  // Ensure the log directory exists
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

  // Function to get the next log file path
  const getLogFilePath = () => {
    let index = 0;
    let logFilePath;
    do {
      logFilePath = path.join(LOG_DIR, `${new Date().getFullYear()}${(new Date().getMonth()+1)}${new Date().getDate()}(${index}).txt`);
      index++;
    } while (fs.existsSync(logFilePath) && fs.statSync(logFilePath).size >= MAX_FILE_SIZE);
    return logFilePath;
  };

  const logFilePath = getLogFilePath();

  // Append the log message to the appropriate file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file', err);
      return res.status(500).send('Failed to write to log file');
    }
    res.status(200).send('Logged');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
