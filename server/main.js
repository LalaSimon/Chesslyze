const Express = require("express");
const app = new Express();
const http = require("http");
const server = http.createServer(app);
const port = 8080;
const cors = require("cors");
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(cors());

app.get("/", (req, res) => {});

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("message", (msg) => {
        console.log("message: " + msg);
        io.emit("message", msg);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
