const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Test Nyala');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}/`);
});
