import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import App from './App'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Favorites from './pages/Favorites'

function ProtectedRoute({ children }) {

  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" />
  }

  return children

}

ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>

    <Routes>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

    </Routes>

  </BrowserRouter>

)