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
server.listen(PORT, HOST, () => {
  console.log('=========================================');
  console.log('   🌸 Flower Shop - Node.js Server 🌸');
  console.log('=========================================');
  console.log(`   Server đang chạy tại:`);
  console.log(`   http://${HOST}:${PORT}`);
  console.log('=========================================');
  console.log('   API Endpoints:');
  console.log(`   GET    /              → Trang chủ`);
  console.log(`   GET    /api/users     → Danh sách users`);
  console.log(`   GET    /api/users/:id → Chi tiết user`);
  console.log(`   POST   /api/users     → Thêm user mới`);
  console.log(`   DELETE /api/users/:id → Xoá user`);
  console.log('=========================================');
});

