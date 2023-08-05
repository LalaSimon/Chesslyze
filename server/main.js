const Express = require("express");
const app = new Express();
const http = require("http");
const server = http.createServer(app);
const port = 8080;
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
    console.log("got a request");
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
