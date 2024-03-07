import { Header } from '@pages/Home/components/Header'
import { Main } from '@pages/Home/components/Main'
import { Layout } from '@shared/components/Layout'

export const Home = () => {
  return (
    <Layout>
      <>
        <Header />
        <Main />
      </>
    </Layout>
  )
}
