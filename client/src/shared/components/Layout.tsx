import { Link } from 'react-router-dom'

type LayoutProps = {
  children: JSX.Element
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <nav className="flex h-[6svh] items-center justify-center bg-white">
        <ul className="flex w-full justify-evenly">
          <Link to="/">Home</Link>
          <Link to="/openings">Openings</Link>
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  )
}
