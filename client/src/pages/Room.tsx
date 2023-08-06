import { useEffect } from "react";
import { io } from "socket.io-client";
import { useParams, Link } from "react-router-dom";

const Room = () => {
    const { roomID } = useParams();
    const socket = io("http://localhost:8080");

    useEffect(() => {
        socket.emit("join_room", roomID);
    }, []);

    const leaveRoom = () => {
        socket.emit("leave_room", roomID);
    };

    return (
        <>
            <div className="flex flex-col">
                <Link onClick={leaveRoom} to="/">
                    Back to home
                </Link>
            </div>
            <div className="flex justify-center">
                <h1>Welcome on room {roomID}</h1>
            </div>
        </>
    );
};

export default Room;
