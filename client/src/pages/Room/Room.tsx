import { useParams } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { Main } from './components/Main/Main'

const Room = () => {
  const { roomID } = useParams()

  return (
    <div className="flex h-[100vh] items-center justify-center gap-2">
      <Header roomID={roomID!} />
      <Main roomID={roomID!} />
    </div>
  )
}

export default Room
