import { useTypedDispatch, useTypedSelector } from '../../../../../redux/store'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { Button } from '../../../../../shared/components/Button'
import { setFen } from '../../../../../redux/slices/fen'
import SocketService from '../../../../../services/SocketService'
import GameService from '../../../../../services/GameService'

type ChessboardFenInputProps = {
  setGame: Dispatch<SetStateAction<Chess>>
  roomID: string
}

export const ChessboardFenInput = ({ setGame, roomID }: ChessboardFenInputProps) => {
  const [inputValue, setInputValue] = useState('')
  const { fen } = useTypedSelector(state => state.fen)
  const dispatch = useTypedDispatch()

  const handleFenChange = () => {
    if (SocketService.socket) {
      GameService.fenChange(SocketService.socket, inputValue, roomID)
      setGame(new Chess(inputValue))
      dispatch(setFen(inputValue))
      setInputValue('')
    }
  }

  useEffect(() => {
    const fenChangeHandler = (fen: string) => {
      setGame(new Chess(fen))
      dispatch(setFen(fen))
      setInputValue('')
    }

    if (SocketService.socket) GameService.onFenChangeUpdate(SocketService.socket)
    SocketService.socket?.on('onFenChangeUpdate', fenChangeHandler)

    return () => {
      if (SocketService.socket) {
        SocketService.socket.off('onFenChangeUpdate', fenChangeHandler)
      }
    }
  }, [fen])

  return (
    <div className="flex w-full flex-col gap-1 text-center">
      <label>Paste fen to change position. ctrl + a {'->'} ctrl + v</label>
      <input
        onChange={e => setInputValue(e.target.value)}
        className="rounded-lg p-2 text-center text-sm"
        value={inputValue || fen}
      />
      <Button disabled={!inputValue} callback={handleFenChange} btnText="change fen" />
    </div>
  )
}
