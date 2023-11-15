import { useParams } from 'react-router-dom'
import { Header } from './components/Header'
import { Main } from './components/Main'

const Room = () => {
  const { roomID } = useParams()

  return (
    <div className="mt-10 flex h-[100vh] items-center justify-center gap-2">
      <Header roomID={roomID!} />
      <Main roomID={roomID!} />
    </div>
  )
}

export default Room
