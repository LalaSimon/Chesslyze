import { Button } from '../../../../shared/components/Button'
import { useEffect } from 'react'
import { useTypedDispatch, useTypedSelector } from '../../../../redux/store'
import { setMyOrientation } from '../../../../redux/slices/orientation'
import { setOpponentOrientation } from '../../../../redux/slices/orientation'
import SocketService from '../../../../services/SocketService'
import GameService from '../../../../services/GameService'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'

type OrientationProps = {
  roomID: string
}

export const Orientation = ({ roomID }: OrientationProps) => {
  const myOrientation = useTypedSelector(state => state.orientation.myOrientation)
  const opponentOrientation = useTypedSelector(state => state.orientation.opponentOrientation)
  const dispatch = useTypedDispatch()

  const handleOrietnation = () => {
    dispatch(setMyOrientation(myOrientation === 'white' ? 'black' : 'white'))
    if (SocketService.socket) GameService.changeOrientation(SocketService.socket, myOrientation, roomID)
  }

  const changeOtherPlayerOrientation = () => {
    dispatch(setOpponentOrientation(opponentOrientation === 'white' ? 'black' : 'white'))
    if (SocketService.socket)
      GameService.otherPlayerChangeOrientation(SocketService.socket, opponentOrientation, roomID)
  }

  useEffect(() => {
    const handleOrientationChange = (orientation: BoardOrientation) => {
      dispatch(setOpponentOrientation(orientation === 'black' ? 'white' : 'black'))
    }

    const getOtherPlayerOrientation = (orientation: BoardOrientation) => {
      dispatch(setMyOrientation(orientation === 'black' ? 'white' : 'black'))
    }

    if (SocketService.socket) {
      GameService.onChangeOrientationUpdate(SocketService.socket)
      SocketService.socket?.on('onChangeOrientationUpdate', handleOrientationChange)

      GameService.onOtherPlayerChangeOrientationUpdate(SocketService.socket)
      SocketService.socket?.on('onOtherPlayerChangeOrientationUpdate', getOtherPlayerOrientation)
    }

    return () => {
      if (SocketService.socket) {
        SocketService.socket.off('onChangeOrientationUpdate', handleOrientationChange)
        SocketService.socket.off('onOtherPlayerChangeOrientationUpdate', getOtherPlayerOrientation)
      }
    }
  }, [dispatch, roomID, myOrientation])

  return (
    <section className="mr-2 flex flex-col gap-3">
      <Button callback={handleOrietnation} btnText={myOrientation} description={'your orientation'} />

      <Button
        callback={changeOtherPlayerOrientation}
        btnText={opponentOrientation}
        description={'user orientation'}
      />
    </section>
  )
}
