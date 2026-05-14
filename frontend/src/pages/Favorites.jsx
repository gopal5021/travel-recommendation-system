import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Favorites() {

  const [favorites, setFavorites] = useState([])

  useEffect(() => {

    fetchFavorites()

  }, [])

  const fetchFavorites = async () => {

    try {

      const token = localStorage.getItem('token')

      const response = await axios.post(
        'https://travel-recommendation-system-ybrv.onrender.com/favorites',
        {
          token
        }
      )

      setFavorites(response.data)

    } catch (error) {

      console.log(error)

    }

  }

  return (

    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 p-8">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-bold text-pink-700">
          My Favorite Places ❤️
        </h1>

        <Link
          to="/"
          className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800"
        >
          Back
        </Link>

      </div>

      {
        favorites.length === 0
        ?
        <h2 className="text-3xl text-center text-gray-600 mt-20">
          No Favorites Saved
        </h2>
        :
        <div className="grid md:grid-cols-3 gap-8">

          {
            favorites.map((item, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl shadow-2xl p-6"
              >

                <h2 className="text-3xl font-bold text-pink-700 mb-4">
                  {item.city}
                </h2>

                <p className="text-lg">
                  <strong>State:</strong> {item.state}
                </p>

                <a
                  href={`https://www.google.com/maps/search/${item.city}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-6 bg-green-600 text-white text-center py-3 rounded-xl hover:bg-green-700"
                >
                  View on Google Maps
                </a>

              </div>

            ))
          }

        </div>
      }

    </div>

  )

}

export default Favorites