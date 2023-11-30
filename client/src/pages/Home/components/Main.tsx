import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SocketService from '../../../services/SocketService'
import GameService from '../../../services/GameService'
import { Button } from '../../../shared/components/Button'

export const Main = () => {
  const [roomID, setRoomID] = useState('')
  const navigate = useNavigate()
  const socketURL = 'http://localhost:3000'

  const handleRoomIDChange = (e: FormEvent<HTMLInputElement>): void => {
    e.preventDefault()
    setRoomID(e.currentTarget.value)
  }
  const connectSocket = async () => {
    await SocketService.connect(socketURL).catch((err: string) => {
      console.log('error:', err)
    })
  }
  useEffect(() => {
    connectSocket()
  }, [])

  const joinRoom = async () => {
    const socket = SocketService.socket
    if (!roomID || !socket) return
    GameService.joinRoom(socket, roomID, navigate)
  }
  return (
    <main className="mt-10 flex justify-center gap-5">
      <input
        className="rounded-xl border border-gray-400 p-1 text-center"
        type="password"
        placeholder="Input room ID"
        onChange={handleRoomIDChange}
      />
      <Button btnText="Join room" callback={joinRoom} />
    </main>
  )
}
