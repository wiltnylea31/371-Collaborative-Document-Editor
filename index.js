const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

// 存储文档数据
let documentData = '';

// 处理根路径的请求，返回文档编辑页面
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 处理socket连接
io.on('connection', (socket) => {
  console.log('User connected');

  // 发送当前文档内容给新连接的用户
  socket.emit('document', documentData);

  // 处理文档更新事件
  socket.on('updateDocument', (data) => {
    // 更新文档内容
    documentData = data;

    // 广播文档更新给所有连接的用户
    io.emit('document', documentData);
  });

  // 处理断开连接事件
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// 启动Express应用程序
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
