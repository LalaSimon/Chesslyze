import { Dispatch, SetStateAction } from 'react'
import { Socket } from 'socket.io-client'
import { Button } from '../../../shared/components/Button'
interface OrientationProps {
  socket: Socket
  roomID: string | undefined
  setOtherPlayerOrientation: Dispatch<SetStateAction<'white' | 'black'>>
  otherPlayerOrientation: 'white' | 'black'
  orientation: 'white' | 'black'
  setOrientation: Dispatch<SetStateAction<'white' | 'black'>>
}

export const Orientation = ({
  socket,
  roomID,
  setOtherPlayerOrientation,
  otherPlayerOrientation,
  orientation,
  setOrientation,
}: OrientationProps) => {
  const changeOtherPlayerOrientation = () => {
    socket.emit('change_orientation', {
      roomID,
    })
    setOtherPlayerOrientation(otherPlayerOrientation === 'white' ? 'black' : 'white')
  }

  socket.on('orientation_changed', () => {
    handleOrietnation()
  })

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

  return (
    <div className="mr-5 flex min-w-fit flex-col gap-5 text-center">
      <div>
        <span>your orientation</span>
        <Button callback={handleOrietnation} text={orientation === 'white' ? 'white' : 'black'} />
      </div>
      <div>
        <span>user orientation</span>
        <Button
          callback={changeOtherPlayerOrientation}
          text={otherPlayerOrientation === 'white' ? 'white' : 'black'}
        />
      </div>
    </div>
  )
}
