import { useState } from "react";
import axios from "axios";

function App() {
  const [state, setState] = useState("");
  const [rating, setRating] = useState("");
  const [budget, setBudget] = useState("");
  const [limit, setLimit] = useState("");

  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const username = localStorage.getItem("username");

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
  ];

  const searchCities = async () => {
    if (!state || !rating || !budget || !limit) {
      setError("Please fill all fields");
      return;
    }

    setError("");

    try {
      setLoading(true);

      const response = await axios.post("https://travel-recommendation-system-ybrv.onrender.com/recommend", {
        state,
        rating,
        maxBudget: budget,
        limit,
      });

      setResults(response.data);
      setSearched(true);
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetFields = () => {
    setState("");
    setRating("");
    setBudget("");
    setLimit("");

    setResults([]);
    setSearched(false);
    setError("");
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    alert("Logged Out");

    window.location.href = "/login";
  };

  const saveFavorite = async (cityName, stateName) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please Login First");
      return;
    }

    try {
      const response = await axios.post("https://travel-recommendation-system-ybrv.onrender.com/save-favorite", {
        token,
        city: cityName,
        state: stateName,
      });

      alert(response.data.message);
    } catch (error) {
      alert("Error Saving Favorite");
    }
  };

  const getRatingColor = (ratingValue) => {
    if (ratingValue >= 8) {
      return "text-green-600";
    }

    if (ratingValue >= 6) {
      return "text-yellow-500";
    }

    return "text-red-500";
  };

  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-gray-900 text-white p-8 duration-300"
          : "min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8 duration-300"
      }
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <h1
          className={
            darkMode
              ? "text-5xl font-bold text-center text-white"
              : "text-5xl font-bold text-center text-blue-800"
          }
        >
          Travel Recommendation System
        </h1>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={
              darkMode
                ? "bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold hover:bg-yellow-300"
                : "bg-gray-800 text-white px-5 py-3 rounded-xl font-bold hover:bg-gray-900"
            }
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {username ? (
            <>
              <div className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold">
                Welcome, {username}
              </div>

              <a
                href="/favorites"
                className="bg-pink-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-pink-700"
              >
                Favorites ❤️
              </a>

              <button
                onClick={logoutUser}
                className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700"
              >
                Login
              </a>

              <a
                href="/signup"
                className="bg-purple-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-purple-700"
              >
                Signup
              </a>
            </>
          )}
        </div>
      </div>

      <div
        className={
          darkMode
            ? "bg-gray-800 shadow-2xl rounded-3xl p-8 max-w-4xl mx-auto"
            : "bg-white shadow-2xl rounded-3xl p-8 max-w-4xl mx-auto"
        }
      >
        <div className="grid md:grid-cols-2 gap-6">
          <select
            value={state}
            className={
              darkMode
                ? "bg-gray-700 text-white border-2 border-gray-500 p-4 rounded-xl outline-none"
                : "border-2 border-blue-300 p-4 rounded-xl outline-none focus:border-blue-600"
            }
            onChange={(e) => setState(e.target.value)}
          >
            <option value="">Select State</option>

            {states.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={rating}
            placeholder="Minimum Rating (out of 10)"
            className={
              darkMode
                ? "bg-gray-700 text-white border-2 border-gray-500 p-4 rounded-xl outline-none placeholder:text-gray-400"
                : "border-2 border-blue-300 p-4 rounded-xl outline-none focus:border-blue-600 placeholder:text-gray-500"
            }
            onChange={(e) => setRating(e.target.value)}
          />

          <input
            type="number"
            value={budget}
            placeholder="Maximum Budget"
            className={
              darkMode
                ? "bg-gray-700 text-white border-2 border-gray-500 p-4 rounded-xl outline-none placeholder:text-gray-400"
                : "border-2 border-blue-300 p-4 rounded-xl outline-none focus:border-blue-600 placeholder:text-gray-500"
            }
            onChange={(e) => setBudget(e.target.value)}
          />

          <input
            type="number"
            value={limit}
            placeholder="Number of Cities"
            className={
              darkMode
                ? "bg-gray-700 text-white border-2 border-gray-500 p-4 rounded-xl outline-none placeholder:text-gray-400"
                : "border-2 border-blue-300 p-4 rounded-xl outline-none focus:border-blue-600 placeholder:text-gray-500"
            }
            onChange={(e) => setLimit(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-lg mt-4 text-center">{error}</p>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button
            onClick={searchCities}
            className="bg-blue-700 text-white px-6 py-4 rounded-xl w-full text-lg font-semibold hover:bg-blue-800 duration-300"
          >
            {loading ? "Searching..." : "Search Destinations"}
          </button>

          <button
            onClick={resetFields}
            className="bg-red-500 text-white px-6 py-4 rounded-xl w-full text-lg font-semibold hover:bg-red-600 duration-300"
          >
            Reset
          </button>
        </div>
      </div>

      {searched && results.length > 0 && (
        <h2
          className={
            darkMode
              ? "text-3xl font-bold text-center text-white mt-12"
              : "text-3xl font-bold text-center text-blue-800 mt-12"
          }
        >
          Showing {results.length} Cities
        </h2>
      )}

      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {searched && results.length === 0 ? (
          <h2 className="text-3xl font-bold text-center col-span-3 text-red-500">
            No Cities Found
          </h2>
        ) : (
          results.map((city, index) => (
            <div
              key={index}
              className={
                darkMode
                  ? "bg-gray-800 text-white rounded-3xl shadow-2xl p-6 hover:scale-105 duration-300"
                  : "bg-white rounded-3xl shadow-2xl p-6 hover:scale-105 duration-300"
              }
            >
              <h2 className="text-3xl font-bold text-blue-700 mb-4">
                {city.City}
              </h2>

              <div className="space-y-3 text-lg">
                <p>
                  <strong>State:</strong> {city["State/UT"]}
                </p>

                <p>
                  <strong>Budget:</strong> ₹{city["Average_Budget_Per_Day_INR"]}
                </p>

                <p className={getRatingColor(city["Rating_Out_of_10"])}>
                  <strong>Rating:</strong> {city["Rating_Out_of_10"]}/10
                </p>

                <p className="text-sm leading-7">
                  <strong>Description:</strong>
                  <br />
                  {city["Description"]}
                </p>

                <a
                  href={`https://www.google.com/maps/search/${city.City}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-4 bg-green-600 text-white text-center py-3 rounded-xl hover:bg-green-700 duration-300"
                >
                  View on Google Maps
                </a>

                <button
                  onClick={() => saveFavorite(city.City, city["State/UT"])}
                  className="w-full bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 duration-300"
                >
                  ❤️ Save Favorite
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
