import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // 🔹 Fetch all stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/stores", {
          headers: { Authorization: `Bearer ${token}` },
          params: { name: searchName, address: searchAddress },
        });
        setStores(res.data.stores);
      } catch (err) {
        console.error("Failed to fetch stores", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [searchName, searchAddress, refresh, token]);

  // 🔹 Submit new rating
  const handleSubmitRating = async (storeId, rating) => {
    try {
      await axios.post(
        `http://localhost:5000/api/users/stores/${storeId}/rating`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error submitting rating", err);
    }
  };

  // 🔹 Update rating
  const handleUpdateRating = async (storeId, rating) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/stores/${storeId}/rating`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error updating rating", err);
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return <p className="text-center mt-10">Loading stores...</p>;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Search Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Search by address"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
      </div>

      {/* Store Listings */}
      <div className="space-y-4">
        {stores.length > 0 ? (
          stores.map((store) => (
            <div
              key={store.id}
              className="bg-white shadow-md rounded-lg p-6 border"
            >
              <h2 className="text-xl font-semibold">{store.name}</h2>
              <p className="text-gray-600">{store.address}</p>
              <p className="mt-2">
                <strong>Average Rating:</strong> {store.avgRating} (
                {store.ratingCount} ratings)
              </p>
              <p>
                <strong>Your Rating:</strong>{" "}
                {store.myRating ? store.myRating : "Not rated yet"}
              </p>

              {/* Rating buttons */}
              <div className="flex gap-2 mt-3">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() =>
                      store.myRating
                        ? handleUpdateRating(store.id, val)
                        : handleSubmitRating(store.id, val)
                    }
                    className={`px-3 py-1 rounded ${
                      store.myRating === val
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No stores found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
