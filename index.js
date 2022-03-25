const app = require('./app');
const http = require('http');
let port = process.env.PORT || 3000;
app.set("port", port);

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`pdf-merge-node.js app is listening on port http://localhost:${port}`);
});