import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginUser = async () => {

    try {

      const response = await axios.post(
        'https://travel-recommendation-system-ybrv.onrender.com/login',
        {
          email,
          password
        }
      )

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', response.data.username)

      alert('Login Successful')

      navigate('/')

    } catch (error) {

      alert('Invalid Credentials')

    }

  }

  return (

    <div className="min-h-screen flex justify-center items-center bg-blue-100">

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">

        <h1 className="text-5xl font-bold text-center text-blue-700 mb-8">
          Login
        </h1>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border-2 p-4 rounded-xl"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full border-2 p-4 rounded-xl"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={loginUser}
            className="w-full bg-blue-700 text-white py-4 rounded-xl hover:bg-blue-800"
          >
            Login
          </button>

          <p className="text-center text-gray-600 mt-4">

            New User?

            <Link
              to="/signup"
              className="text-purple-700 font-bold ml-2"
            >
              Signup Here
            </Link>

          </p>

        </div>

      </div>

    </div>

  )

}

export default Login