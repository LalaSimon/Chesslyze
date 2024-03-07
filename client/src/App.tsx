import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '@redux/store'

import { Home } from '@pages/Home/Home.tsx'
import { Analyze } from '@pages/Analyze/Analyze.tsx'
import { OpeningTree } from '@pages/OpeningTree/OpeningTree.tsx'
import { NotFound } from '@pages/404/NotFound'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route errorElement={<NotFound />} path="/" element={<Home />} />
      <Route path="/analyze/room/:roomID" element={<Analyze />} />
      <Route path="/openings" element={<OpeningTree />} />
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
