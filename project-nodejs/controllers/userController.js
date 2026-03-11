const path = require('path');
const { readJSONFile, writeJSONFile, getRequestBody, sendJSON } = require('../utils/helper');

// Đường dẫn tới file users.json
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

/**
 * GET /api/users
 * Lấy danh sách tất cả users
 */
async function getAllUsers(req, res) {
  try {
    const users = await readJSONFile(usersFilePath);
    sendJSON(res, 200, {
      success: true,
      message: 'Lấy danh sách users thành công',
      count: users.length,
      data: users,
    });
  } catch (err) {
    sendJSON(res, 500, {
      success: false,
      message: 'Lỗi server khi đọc dữ liệu',
      error: err.message,
    });
  }
}

/**
 * GET /api/users/:id
 * Lấy user theo ID
 */
async function getUserById(req, res, id) {
  try {
    const users = await readJSONFile(usersFilePath);
    const user = users.find((u) => u.id === parseInt(id));

    if (!user) {
      sendJSON(res, 404, {
        success: false,
        message: `Không tìm thấy user với id = ${id}`,
      });
      return;
    }

    sendJSON(res, 200, {
      success: true,
      message: 'Lấy user thành công',
      data: user,
    });
  } catch (err) {
    sendJSON(res, 500, {
      success: false,
      message: 'Lỗi server khi đọc dữ liệu',
      error: err.message,
    });
  }
}

/**
 * POST /api/users
 * Thêm user mới
 */
async function createUser(req, res) {
  try {
    const body = await getRequestBody(req);

    // Validate dữ liệu
    if (!body.name || !body.email) {
      sendJSON(res, 400, {
        success: false,
        message: 'Thiếu thông tin bắt buộc: name và email',
      });
      return;
    }

    const users = await readJSONFile(usersFilePath);

    // Tạo ID mới (lấy ID lớn nhất + 1)
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    const newUser = {
      id: newId,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
    };

    users.push(newUser);
    await writeJSONFile(usersFilePath, users);

    sendJSON(res, 201, {
      success: true,
      message: 'Thêm user mới thành công',
      data: newUser,
    });
  } catch (err) {
    sendJSON(res, 500, {
      success: false,
      message: 'Lỗi server khi thêm user',
      error: err.message,
    });
  }
}

/**
 * DELETE /api/users/:id
 * Xoá user theo ID
 */
async function deleteUser(req, res, id) {
  try {
    const users = await readJSONFile(usersFilePath);
    const userIndex = users.findIndex((u) => u.id === parseInt(id));

    if (userIndex === -1) {
      sendJSON(res, 404, {
        success: false,
        message: `Không tìm thấy user với id = ${id}`,
      });
      return;
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    await writeJSONFile(usersFilePath, users);

    sendJSON(res, 200, {
      success: true,
      message: 'Xoá user thành công',
      data: deletedUser,
    });
  } catch (err) {
    sendJSON(res, 500, {
      success: false,
      message: 'Lỗi server khi xoá user',
      error: err.message,
    });
  }
}
/**
 * PUT /api/users/:id
 * Cập nhật thông tin user
 */
async function updateUser(req, res, id) {
  try {
    const body = await getRequestBody(req);
    const users = await readJSONFile(usersFilePath);
    const userIndex = users.findIndex((u) => u.id === parseInt(id));

    if (userIndex === -1) {
      sendJSON(res, 404, {
        success: false,
        message: `Khong tim thay user voi id = ${id}`,
      });
      return;
    }

    // Cap nhat thong tin user
    if (body.name) users[userIndex].name = body.name;
    if (body.email) users[userIndex].email = body.email;
    if (body.phone) users[userIndex].phone = body.phone;

    await writeJSONFile(usersFilePath, users);

    sendJSON(res, 200, {
      success: true,
      message: 'Cap nhat user thanh cong',
      data: users[userIndex],
    });
  } catch (err) {
    sendJSON(res, 500, {
      success: false,
      message: 'Loi server khi cap nhat user',
      error: err.message,
    });
  }
}
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
};

