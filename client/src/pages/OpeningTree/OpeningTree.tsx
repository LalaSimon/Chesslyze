import { Layout } from '@shared/components/Layout'
import { Chess } from 'chess.js'
import { useState } from 'react'
import { OpeningChessboard } from './Chessboard/Chessboard'
import { OpeningTable } from '@pages/Analyze/components/Main/Aside/OpeningTable/OpeningTable'
import { OpeningFenEvalType } from '@shared/types/OpeningFenEvalType'

export const OpeningTree = () => {
  const [game, setGame] = useState(new Chess())
  const [movesList, setMovesList] = useState<OpeningFenEvalType[]>([])

  return (
    <Layout>
      <div>
        <OpeningChessboard game={game} setGame={setGame} setMovesList={setMovesList} />
        <OpeningTable openingList={movesList} fen={game.fen()} />
      </div>
    </Layout>
  )
}
