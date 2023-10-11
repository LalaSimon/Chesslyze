import { Main } from './components/Main'
import { Header } from './components/Header'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

const Room = () => {
  const { roomID } = useParams()
  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  })
  return (
    <body className="bg-cyan-50">
      <Header roomID={roomID} socket={socket} />
      <Main roomID={roomID} socket={socket} />
    </body>
  )
}

export default Room
