import { useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:8080");

const App = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState<string>("");

    socket.on("message", (message: string) => {
        setMessages([...messages, message]);
    });

    const sendMessage = () => {
        socket.emit("message", message);
    };
    return (
        <main>
            <div className="flex justify-center mt-4">
                <h1>Welcome on Chesslyze</h1>
            </div>
            <div className="flex justify-center gap-5 mt-10">
                <input
                    className="p-1 border-2 border-black rounded-lg text-center"
                    type="text"
                    placeholder="type your message here"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    onClick={sendMessage}
                    className="border-2 border-black rounded-lg px-4"
                >
                    Confirm
                </button>
            </div>
            <div className="flex gap-4 justify-center">
                <ul className="flex flex-col gap-4 mt-10">
                    {messages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
            </div>
        </main>
    );
};

export default App;
