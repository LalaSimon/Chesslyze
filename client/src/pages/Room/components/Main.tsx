import { useState } from 'react'
import { Chess } from 'chess.js'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { Orientation } from './Orientation'
import { ChessboardWrapper } from './ChessboardWrapper'
import { type MoveObject } from '../../../shared/types/MoveObject'
import { MoveList } from './MoveList'

interface MainProps {
  roomID: string
}

export const Main = ({ roomID }: MainProps) => {
  const [moveList, setMoveList] = useState<[MoveObject][]>([])
  const [game, setGame] = useState(new Chess())
  const [fen, setFen] = useState<string>('')
  const [orientation, setOrientation] = useState<BoardOrientation>('white')

  return (
    <main className="flex h-full items-center justify-center gap-2">
      <Orientation orientation={orientation} roomID={roomID} setOrientation={setOrientation} />
      <ChessboardWrapper
        roomID={roomID}
        game={game}
        setGame={setGame}
        orientation={orientation}
        setFen={setFen}
        setMoveList={setMoveList}
        moveList={moveList}
      />
      <MoveList
        moveList={moveList}
        setFen={setFen}
        orientation={orientation}
        fen={fen}
        game={game}
        setGame={setGame}
        setMoveList={setMoveList}
        roomID={roomID}
      />
    </main>
  )
}
