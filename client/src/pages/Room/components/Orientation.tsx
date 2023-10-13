import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { Button } from '../../../shared/components/Button'
import { useEffect, Dispatch, SetStateAction, useState } from 'react'
import { io } from 'socket.io-client'
interface OrientationProps {
  orientation: string
  setOrientation: Dispatch<SetStateAction<BoardOrientation>>
  roomID: string | undefined
}

export const Orientation = ({ orientation, setOrientation, roomID }: OrientationProps) => {
  const [otherPlayerOrientation, setOtherPlayerOrientation] = useState<BoardOrientation>('white')
  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  })
  useEffect(() => {
    socket.emit('join_room', roomID)
    return () => {
      socket.disconnect()
    }
  }, [roomID, socket])

  const handleOrietnation = () => {
    if (orientation === 'white') {
      setOrientation('black')
      socket.emit('other_player_orientation', {
        roomID,
        orientation: 'black',
      })
    } else {
      setOrientation('white')
      socket.emit('other_player_orientation', {
        roomID,
        orientation: 'white',
      })
    }
  }

  const changeOtherPlayerOrientation = () => {
    socket.emit('change_orientation', {
      roomID,
    })
    setOtherPlayerOrientation(otherPlayerOrientation === 'white' ? 'black' : 'white')
  }

  socket.on('get_other_player_orientation', orientation => setOtherPlayerOrientation(orientation))

  socket.on('orientation_changed', () => handleOrietnation())

  return (
    <section className="mr-2 flex flex-col gap-3">
      <Button
        callback={handleOrietnation}
        btnText={orientation === 'white' ? 'white' : 'black'}
        description={'your orientation'}
      />

      <Button
        callback={changeOtherPlayerOrientation}
        btnText={otherPlayerOrientation === 'white' ? 'white' : 'black'}
        description={'user orientation'}
      />
    </section>
  )
}
