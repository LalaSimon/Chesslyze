import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { Button } from '../../../../shared/components/Button'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useTypedDispatch, useTypedSelector } from '../../../../redux/store'
import { setOrientation } from '../../../../redux/slices/orientation'

type OrientationProps = {
  roomID: string | undefined
}

export const Orientation = ({ roomID }: OrientationProps) => {
  const [otherPlayerOrientation, setOtherPlayerOrientation] = useState<BoardOrientation>('white')
  const { orientation } = useTypedSelector(state => state.orientation)
  const dispatch = useTypedDispatch()

  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  })

  useEffect(() => {
    socket.emit('join_room', roomID)
    return () => {}
  }, [roomID, socket])

  const handleOrietnation = () => {
    if (orientation === 'white') {
      dispatch(setOrientation('black'))
      socket.emit('other_player_orientation', {
        roomID,
        orientation: 'black',
      })
    } else {
      dispatch(setOrientation('white'))
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
