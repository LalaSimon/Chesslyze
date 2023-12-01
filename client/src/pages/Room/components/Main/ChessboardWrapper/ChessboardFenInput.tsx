import { setFen } from '../../../../../redux/slices/fen'
import { fetchMovesEval } from '../../../../../shared/utils/LichesAPI'
import { fetchOpening } from '../../../../../shared/utils/LichesAPI'
import { useTypedDispatch, useTypedSelector } from '../../../../../redux/store'
import { useState, FormEvent, Dispatch, SetStateAction } from 'react'
import { Chess } from 'chess.js'

type ChessboardFenInputProps = {
  setGame: Dispatch<SetStateAction<Chess>>
}

export const ChessboardFenInput = ({ setGame }: ChessboardFenInputProps) => {
  const [inputValue, setInputValue] = useState<string>('')
  const { fen } = useTypedSelector(state => state.fen)
  const dispatch = useTypedDispatch()
  const onSubmit = async (event: FormEvent) => {
    setInputValue('')
    event.preventDefault()
    if (!inputValue) {
      return false
    } else {
      dispatch(setFen(inputValue))
      setGame(new Chess(inputValue))
      await fetchMovesEval(inputValue, dispatch)
      await fetchOpening(inputValue, dispatch)
    }
  }

  const copyFen = async () => {
    try {
      await navigator.clipboard.writeText(fen)
      alert('skopiowano FEN')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form className="flex flex-col items-center justify-center gap-2" onSubmit={onSubmit}>
      <div className="flex gap-2">
        <input
          onChange={e => setInputValue(e.target.value)}
          value={!inputValue ? fen : inputValue}
          type="text"
          placeholder="Paste fen"
          className="w-[580px] rounded-xl text-center"
        />
        <button
          className={`${
            inputValue ? 'blob' : null
          } max-w-[150px] rounded-xl border border-gray-400 p-2 text-center transition duration-150 ease-in-out hover:scale-110 hover:cursor-pointer hover:bg-gray-100 active:shadow-inner active:shadow-gray-500`}
          type="submit">
          Load Fen
        </button>
      </div>
      <button
        onClick={copyFen}
        className="max-w-[150px] rounded-xl border border-gray-400 p-2 text-center transition duration-150 ease-in-out hover:scale-110 hover:cursor-pointer hover:bg-gray-100 active:shadow-inner active:shadow-gray-500"
        type="button">
        Copy fen
      </button>
    </form>
  )
}
