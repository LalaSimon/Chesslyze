import { Layout } from '@shared/components/Layout'
import { Chess } from 'chess.js'
import { useState } from 'react'
import { OpeningChessboard } from './Chessboard/Chessboard'
import { OpeningTable } from '@pages/Analyze/components/Main/Aside/OpeningTable/OpeningTable'
import { useTypedSelector } from '@redux/store'

export const OpeningTree = () => {
  const [game, setGame] = useState(new Chess())
  const { openingList, openingName } = useTypedSelector(state => state.openingPage)

  return (
    <Layout>
      <div>
        <OpeningChessboard game={game} setGame={setGame} />
        <OpeningTable openingName={openingName} openingList={openingList} fen={game.fen()} />
      </div>
    </Layout>
  )
}
