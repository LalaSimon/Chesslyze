import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './components/Buttons'
const App = () => {
  const [roomID, setRoomID] = useState('')
  const navigate = useNavigate()

  const joinRoom = () => {
    navigate(roomID)
  }
  return (
    <main>
      <div className="mt-4 flex justify-center">
        <h1>Welcome on Chesslyze</h1>
      </div>
      <div className="mt-10 flex justify-center gap-5">
        <input
          className="rounded-xl border border-gray-400 p-1 text-center"
          type="password"
          placeholder="Input room ID"
          onChange={e => setRoomID(e.target.value)}
        />
        <Button text="Join room" callback={joinRoom} />
      </div>
    </main>
  )
}

export default App
