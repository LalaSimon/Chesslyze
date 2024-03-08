import { OpeningFenEvalType } from '@shared/types/OpeningFenEvalType'
import axios from 'axios'

export type LichesDataType = {
  white: number
  black: number
  draws: number
  moves: OpeningFenEvalType[]
  opening: {
    eco: string
    name: string
  }
  topGames: {
    black: {
      name: string
      rating: number
    }
    id: string
    month: string
    uci: string
    white: {
      name: string
      rating: number
    }
    winner: string | undefined
    year: number
  }[]
}

export const lichessApiHandler = {
  getLichessInfo: async (fen: string): Promise<LichesDataType> => {
    const response = await axios.get<LichesDataType>(`https://explorer.lichess.ovh/masters?fen=${fen}`)

    return response.data
  },

  getOpeningName: async (fen: string) => {
    const response = await axios.get<LichesDataType>(`https://explorer.lichess.ovh/masters?fen=${fen}`)

    return response.data.opening.name
  },

  getMoves: async (fen: string) => {
    const response = await axios.get<LichesDataType>(`https://explorer.lichess.ovh/masters?fen=${fen}`)

    return response.data.moves
  },
}
