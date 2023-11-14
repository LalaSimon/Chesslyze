import { Chess } from 'chess.js'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { ChessboardComponent } from './ChessboardWrapper/ChessboardComponent'
import { ChessboardButtons } from './ChessboardWrapper/ChessboardButtons'
import { Dispatch, SetStateAction } from 'react'
import { useEffect } from 'react'
import { useTypedSelector } from '../../../redux/store'
import { useTypedDispatch } from '../../../redux/store'
import { setMovesEval } from '../../../redux/slices/movesEval'
interface ChessboardWrapperProps {
  roomID?: string
  game: Chess
  setGame: Dispatch<SetStateAction<Chess>>
}

export const ChessboardWrapper = ({ roomID, game, setGame }: ChessboardWrapperProps) => {
  const { orientation } = useTypedSelector(state => state.orientation)
  const { opening } = useTypedSelector(state => state.opening)
  const { fen } = useTypedSelector(state => state.fen)
  const { movesEval } = useTypedSelector(state => state.movesEval)
  const dispatch = useTypedDispatch()

  const fetchData = async () => {
    return await fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`)
      .then(res => res.json())
      .then(data => dispatch(setMovesEval(data.moves)))
  }
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <span>Opening: {!opening ? '-' : opening}</span>
      <h1>You are in room nr {roomID}</h1>

      <ChessboardComponent
        setGame={setGame}
        game={game}
        boardOrientation={orientation as BoardOrientation}
        roomID={roomID!}
      />

      <ChessboardButtons setGame={setGame} roomID={roomID} />
      <div>
        Best moves:{' '}
        {!movesEval
          ? null
          : movesEval.map(dataObj => {
              return <p>{dataObj.san}</p>
            })}
      </div>
    </section>
  )
}
