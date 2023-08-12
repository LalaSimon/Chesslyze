import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams, Link } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

interface Move {
    from: string;
    to: string;
    promotion?: string;
}

const Room = () => {
    const [game, setGame] = useState(new Chess());
    const { roomID } = useParams();
    const socket = io("http://localhost:8080");

    useEffect(() => {
        socket.emit("join_room", roomID);
    }, []);

    const leaveRoom = () => {
        socket.emit("leave_room", roomID);
    };

    function makeAMove(move: Move) {
        const gameCopy = new Chess(game.fen());
        const result = gameCopy.move(move);
        setGame(gameCopy);
        return result;
    }

    function onDrop(sourceSquare: string, targetSquare: string) {
        const move = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
        });

        return true;
    }

    return (
        <>
            <div className="flex flex-col">
                <Link onClick={leaveRoom} to="/">
                    Back to home
                </Link>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
                <h1>Welcome on room {roomID}</h1>
                <div>
                    <Chessboard
                        onPieceDrop={onDrop}
                        position={game.fen()}
                        boardWidth={650}
                    />
                </div>
            </div>
        </>
    );
};

export default Room;
