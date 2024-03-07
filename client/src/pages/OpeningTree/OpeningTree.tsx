import { Layout } from '@shared/components/Layout'
import { Chess } from 'chess.js'
import { useState } from 'react'
import { OpeningChessboard } from './Chessboard/Chessboard'

export const OpeningTree = () => {
  const [game, setGame] = useState(new Chess())
  return (
    <Layout>
      <div>
        <OpeningChessboard game={game} setGame={setGame} />
      </div>
    </Layout>
  )
}
