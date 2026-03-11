const http = require('http');
const { handleRoutes } = require('./routes/routes');

const PORT = 3000;
const HOST = 'localhost';

// Tạo HTTP server
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  handleRoutes(req, res);
});

// Khởi chạy server
// Khoi chay server
server.listen(PORT, HOST, () => {
  console.log('=========================================');
  console.log('   🌸 Flower Shop - Node.js Server 🌸');
  console.log('   Environment: Development');
  console.log('   Node Version: ' + process.version);
  console.log('   Platform: ' + process.platform);
  console.log('=========================================');
  console.log(`   Server dang chay tai:`);
  console.log(`   http://${HOST}:${PORT}`);
  console.log(`   PID: ${process.pid}`);
  console.log('=========================================');
  console.log('   API Endpoints:');
  console.log(`   GET    /                    → Trang chu`);
  console.log(`   GET    /api/users           → Danh sach users`);
  console.log(`   GET    /api/users/search?q= → Tim kiem user`);
  console.log(`   GET    /api/users/:id       → Chi tiet user`);
  console.log(`   POST   /api/users           → Them user moi`);
  console.log(`   DELETE /api/users/:id       → Xoa user`);
  console.log('=========================================');
});

