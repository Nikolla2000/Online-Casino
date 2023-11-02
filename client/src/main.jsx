import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './router/Router.jsx'
import { UserContextProvider } from '../context/userContext.jsx'
import { store } from './redux/store/store.js'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <UserContextProvider>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </UserContextProvider>
    </Provider>
  </React.StrictMode>,
)
