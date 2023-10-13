import { Chessboard } from 'react-chessboard'
import { type MoveObject } from '../../../shared/types/MoveObject'
import { Dispatch, SetStateAction } from 'react'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { Chess } from 'chess.js'

interface MoveListProps {
  moveList: [MoveObject][]
  setFen: Dispatch<SetStateAction<string>>
  setRenderSmallBoard: Dispatch<SetStateAction<boolean>>
  handleSetGame: (fen: string) => void
  renderSmallBoard: boolean
  orientation: BoardOrientation
  fen: string
  game: Chess
}

export const MoveList = ({
  moveList,
  setFen,
  setRenderSmallBoard,
  handleSetGame,
  renderSmallBoard,
  orientation,
  fen,
  game,
}: MoveListProps) => {
  return (
    <section className="relative ml-10 flex min-w-[285px] flex-col gap-2 border">
      <h2 className="text-center">Move list</h2>
      <div className="flex h-[600px] w-full flex-col justify-start gap-6 overflow-scroll pl-10">
        {moveList.map((move, index) => (
          <div className="flex w-full items-center gap-6" key={index}>
            <span>{index + 1}.</span>
            <div className="flex w-full gap-6">
              {move.map((moveObject, index) => (
                <div
                  onMouseEnter={() => {
                    setFen(moveObject.fen)
                    setRenderSmallBoard(true)
                  }}
                  onMouseLeave={() => {
                    setFen(game.fen())
                    setRenderSmallBoard(false)
                  }}
                  onClick={() => handleSetGame(moveObject.fen)}
                  className="flex w-14 cursor-pointer justify-center rounded-xl border py-1 hover:bg-gray-200 active:bg-gray-400"
                  key={index}>
                  <span>{moveObject.move}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {renderSmallBoard && (
          <div className="pointer-events-none absolute left-[15px] top-[-300px]">
            <Chessboard boardOrientation={orientation} boardWidth={250} position={fen} />
          </div>
        )}
      </div>
    </section>
  )
}
