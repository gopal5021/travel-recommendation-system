import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Signup() {

  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signupUser = async () => {

    try {

      await axios.post(
        'https://travel-recommendation-system-ybrv.onrender.com/signup',
        {
          username,
          email,
          password
        }
      )

      alert('Signup Successful')

      navigate('/login')

    } catch (error) {

      alert('Something went wrong')

    }

  }

  return (

    <div className="min-h-screen flex justify-center items-center bg-purple-100">

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">

        <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">
          Signup
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Enter Username"
            className="w-full border-2 p-4 rounded-xl"
            onChange={(e) => setUsername(e.target.value)}
          />

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
            onClick={signupUser}
            className="w-full bg-purple-700 text-white py-4 rounded-xl hover:bg-purple-800"
          >
            Signup
          </button>

        </div>

      </div>

    </div>

  )

}

export default Signup