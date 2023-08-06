const Express = require("express");
const app = new Express();
const http = require("http");
const server = http.createServer(app);
const port = 8080;
const cors = require("cors");
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.use(cors());

app.get("/", (req, res) => {});

io.on("connection", (socket) => {
    socket.on("join_room", (room) => {
        socket.join(room);
        socket.on("leave_room", (room) => {
            socket.leave(room);
        });
    });
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
