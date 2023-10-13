import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../shared/components/Buttons'

export const Main = () => {
  const [roomID, setRoomID] = useState('')
  const navigate = useNavigate()

  const joinRoom = () => {
    navigate(roomID)
  }

  return (
    <main className="mt-10 flex justify-center gap-5">
      <input
        className="rounded-xl border border-gray-400 p-1 text-center"
        type="password"
        placeholder="Input room ID"
        onChange={e => setRoomID(e.target.value)}
      />
      <Button text="Join room" callback={joinRoom} />
    </main>
  )
}
