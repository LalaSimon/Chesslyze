import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams, Link } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";

interface Move {
    from: string;
    to: string;
    promotion?: string;
}
const Room = () => {
    const [game, setGame] = useState(new Chess());
    const [arrows, setArrows] = useState<Square[][]>([]);
    const { roomID } = useParams();
    const socket = io("http://localhost:8080");

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

    useEffect(() => {
        socket.emit("join_room", roomID);
    });

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

    const arrowDrow = (arrowsData: Square[][]) => {
        if (arrowsData.length === 0 && arrowsData !== arrows) {
            setArrows([]);
            socket.emit("draw_arrows", {
                arrowsData,
                roomID,
            });
        } else {
            if (arrowsData.flat().join() === arrows.flat().join()) return;
            setArrows(arrowsData);
            socket.emit("draw_arrows", {
                arrowsData,
                roomID,
            });
        }
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
                        customArrows={arrows}
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
