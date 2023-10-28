import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './router/Router.jsx'
import { UserContextProvider } from '../context/userContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </RouterProvider>
  </React.StrictMode>,
)
