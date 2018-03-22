var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];
var topic = ''

var do_command = function (command, data) {
  var cstr = data.replace(command, '').trim()
  var message = null;
  if (command == '/topic') {
    topic = cstr
    message = "*** Topic has changed to '" + topic + "'";
  } else {
    message = data;
    messages.push(message);
  }

  // Send message if needed.
  if (message != null) {
    ws.clients.forEach(function (clientSocket) {
      clientSocket.send(message)
    });
  }
};

console.log('websockets server started');

ws.on('connection', function (socket) {
  console.log('client connection established');
  socket.send("*** Topic is '" + topic + "'");

  messages.forEach(function (msg) {
    socket.send(msg);
  });

  socket.on('message', function (data) {
    console.log('message received: ' + data);
    if (data.startsWith('/')) {
      command = data.split(/\s+/)[0];
      do_command(command, data);
    } else {
      messages.push(data);
      ws.clients.forEach(function (clientSocket) {
        clientSocket.send(data)
      });
    }

  });
});
