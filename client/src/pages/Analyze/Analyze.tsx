import { useParams } from 'react-router-dom'
import { Header } from '@pages/Analyze/components/Header/Header'
import { Main } from '@pages/Analyze/components/Main/Main'
import { Layout } from '@shared/components/Layout'
import { NotFound } from '@pages/404/NotFound'

export const Analyze = () => {
  const { roomID } = useParams()

  if (roomID) {
    return (
      <Layout>
        <div className="flex h-[100vh] items-center justify-center gap-2">
          <Header roomID={roomID} />
          <Main roomID={roomID} />
        </div>
      </Layout>
    )
  } else return <NotFound />
}
