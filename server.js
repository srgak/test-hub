const WebSocket = require('ws');
const wsServer = new WebSocket.Server({
  port: 9000 //ws://localhost:9000
});
const clientList = new Set();
const onSuccess = res => {
  const resObj = JSON.parse(res);
  const {data} = resObj;

  clientList.forEach(client => client.send(JSON.stringify(data)));
};
const onClose = () => {
  console.log('разрыв соединения');
};
const onConnect = (wsClient) => {
  clientList.add(wsClient);
  wsClient.on('message', onSuccess);
  wsClient.on('close', onClose);
};

wsServer.on('connection', onConnect);