import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'

type HeaderProps = {
  roomID: string
}

export const Header = ({ roomID }: HeaderProps) => {
  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  })

  const leaveRoom = () => {
    socket.emit('leave_room', roomID)
  }

  return (
    <header>
      <Link className="absolute left-0 top-0 ml-2" onClick={leaveRoom} to="/">
        Back to home
      </Link>
    </header>
  )
}
