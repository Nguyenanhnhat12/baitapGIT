const fs = require('fs');
const path = require('path');

/**
 * Đọc dữ liệu từ file JSON
 * @param {string} filePath - Đường dẫn tới file JSON
 * @returns {Promise<Array>} - Dữ liệu đọc được
 */
function readJSONFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
}

/**
 * Ghi dữ liệu vào file JSON
 * @param {string} filePath - Đường dẫn tới file JSON
 * @param {Array|Object} data - Dữ liệu cần ghi
 * @returns {Promise<void>}
 */
function writeJSONFile(filePath, data) {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, jsonString, 'utf-8', (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

/**
 * Đọc body từ request (POST, PUT, PATCH)
 * @param {http.IncomingMessage} req - Request object
 * @returns {Promise<Object>} - Parsed body
 */
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Gửi JSON response
 * @param {http.ServerResponse} res - Response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Dữ liệu trả về
 */
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * Lấy MIME type dựa trên extension
 * @param {string} ext - File extension (vd: .html, .css, .jpg)
 * @returns {string} - MIME type
 */
function getMimeType(ext) {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}
/**
 * Format ngày tháng theo định dạng dd/mm/yyyy HH:MM:SS
 * @param {Date} date - Đối tượng Date
 * @returns {string} - Chuỗi ngày đã format
 */
function formatDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
module.exports = {
  readJSONFile,
  writeJSONFile,
  getRequestBody,
  sendJSON,
  getMimeType,
  formatDate,
};

