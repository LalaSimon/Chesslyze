import { useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:8080");

const App = () => {
    const [roomID, setRoomID] = useState("");

    const joinRoom = () => {
        if (roomID !== "") {
            socket.emit("join_room", roomID);
        }
    };
    return (
        <main>
            <div className="flex justify-center mt-4">
                <h1>Welcome on Chesslyze</h1>
            </div>
            <div className="flex justify-center gap-5 mt-10">
                <input
                    className="p-1 border-2 border-black rounded-lg text-center"
                    type="password"
                    placeholder="Input room ID"
                    onChange={(e) => setRoomID(e.target.value)}
                />
                <button
                    onClick={joinRoom}
                    className="border-2 border-black rounded-lg px-4"
                >
                    Confirm
                </button>
            </div>
        </main>
    );
};

export default App;
