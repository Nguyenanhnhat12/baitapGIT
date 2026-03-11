const fs = require('fs');
const path = require('path');
const { sendJSON, getMimeType } = require('../utils/helper');
const userController = require('../controllers/userController');

/**
 * Serve file tĩnh từ thư mục public
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {string} filePath - Đường dẫn tới file
 */
function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath);
  const mimeType = getMimeType(ext);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 - Không tìm thấy trang</h1>');
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

/**
 * Router chính - xử lý tất cả các request
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function handleRoutes(req, res) {
  const method = req.method;
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // ============ CORS Preflight ============
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // ============ API Routes ============

  // GET /api/users - Lấy danh sách users
  // GET /api/users/search?q=keyword - Tim kiem user
  if (pathname === '/api/users/search' && method === 'GET') {
    const query = parsedUrl.searchParams.get('q') || '';
    userController.searchUsers(req, res, query);
    return;
  }

  if (pathname === '/api/users' && method === 'GET') {
    userController.getAllUsers(req, res);
    return;
  }

  // GET /api/users/:id - Lấy user theo ID
  const getUserMatch = pathname.match(/^\/api\/users\/(\d+)$/);
  if (getUserMatch && method === 'GET') {
    const id = getUserMatch[1];
    userController.getUserById(req, res, id);
    return;
  }

  // POST /api/users - Thêm user mới
  if (pathname === '/api/users' && method === 'POST') {
    userController.createUser(req, res);
    return;
  }

  // DELETE /api/users/:id - Xoá user theo ID
  const deleteUserMatch = pathname.match(/^\/api\/users\/(\d+)$/);
  if (deleteUserMatch && method === 'DELETE') {
    const id = deleteUserMatch[1];
    userController.deleteUser(req, res, id);
    return;
  }

  // ============ Static File Routes ============

  // GET / → trả về trang index.html
  if (pathname === '/' && method === 'GET') {
    const indexPath = path.join(__dirname, '..', 'public', 'index.html');
    serveStaticFile(res, indexPath);
    return;
  }

  // Serve các file tĩnh khác (CSS, images, JS...)
  if (method === 'GET') {
    const staticPath = path.join(__dirname, '..', 'public', pathname);
    // Kiểm tra path traversal
    const publicDir = path.join(__dirname, '..', 'public');
    if (!staticPath.startsWith(publicDir)) {
      sendJSON(res, 403, { success: false, message: 'Forbidden' });
      return;
    }
    serveStaticFile(res, staticPath);
    return;
  }

  // ============ 404 Not Found ============
  sendJSON(res, 404, {
    success: false,
    message: `Route ${method} ${pathname} không tồn tại`,
  });
}

module.exports = { handleRoutes };

