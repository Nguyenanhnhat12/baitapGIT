const http = require('http');
const { handleRoutes } = require('./routes/routes');

const PORT = 3000;
const HOST = 'localhost';

// Tạo HTTP server
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  handleRoutes(req, res);
});

// Khoi chay server
server.listen(PORT, HOST, () => {
  console.log('=========================================');
  console.log('   🌸 Flower Shop - Node.js Server 🌸');
  console.log('   Version: 2.0.0 - Feature A');
  console.log('   Author: Team A Developer');
  console.log('   Build: Production Ready');
  console.log('=========================================');
  console.log(`   Server dang chay tai:`);
  console.log(`   http://${HOST}:${PORT}`);
  console.log(`   Started at: ${new Date().toLocaleString()}`);
  console.log('=========================================');
  console.log('   API Endpoints:');
  console.log(`   GET    /              → Trang chu`);
  console.log(`   GET    /api/users     → Danh sach users`);
  console.log(`   GET    /api/users/:id → Chi tiet user`);
  console.log(`   POST   /api/users     → Them user moi`);
  console.log(`   PUT    /api/users/:id → Cap nhat user`);
  console.log(`   DELETE /api/users/:id → Xoa user`);
  console.log('=========================================');
});

