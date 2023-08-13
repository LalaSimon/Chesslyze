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
    const [arrows, setArrows] = useState();
    const { roomID } = useParams();
    const socket = io("http://localhost:8080");

    useEffect(() => {
        socket.emit("join_room", roomID);
    }, []);

    const leaveRoom = () => {
        socket.emit("leave_room", roomID);
    };

    const makeAMove = (move: Move) => {
        game.move(move);
        setGame(new Chess(game.fen()));
    };
    const onDrop = (sourceSquare: string, targetSquare: string) => {
        const move = {
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
        };
        makeAMove(move);

        socket.emit("make_a_move", {
            moveData: {
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            },
            roomID,
        });
        return true;
    };
    socket.on("move_made", (move) => {
        makeAMove({
            from: move.from,
            to: move.to,
            promotion: "q",
        });
    });
    socket.on("arrows_drawn", (arrowsData) => {
        setArrows(arrowsData);
    });

    const arrowDrow = (arrowsData: any) => {
        setArrows(arrowsData);
        socket.emit("draw_arrows", {
            arrowsData,
            roomID,
        });
    };
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
                        customArrows={arrows} // TO WYWOŁUJE PĘTLE - CHECK IT
                        onArrowsChange={arrowDrow}
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
