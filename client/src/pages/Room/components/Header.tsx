import { Link } from 'react-router-dom'
import { Socket } from 'socket.io-client'

interface HeaderProps {
  roomID?: string
  socket: Socket
}

export const Header = ({ roomID, socket }: HeaderProps) => {
  const leaveRoom = () => {
    socket.emit('leave_room', roomID)
  }

  return (
    <Link className="absolute left-0 top-0 ml-2" onClick={leaveRoom} to="/">
      Back to home
    </Link>
  )
}
