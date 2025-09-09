import { useEffect, useState } from "react";
import axios from "axios";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [ratingInputs, setRatingInputs] = useState({}); // storeId -> rating

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // Fetch stores
  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/stores", {
        headers: { Authorization: `Bearer ${token}` },
        params: { name: search, address: search },
      });
      setStores(res.data.stores || []);
    } catch (err) {
      console.error("Failed to fetch stores", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line
  }, []);

  const handleSaveRating = async (store) => {
    const rating = ratingInputs[store.id];
    if (!rating || rating < 1 || rating > 5) {
      alert("Please enter a rating between 1 and 5");
      return;
    }

    try {
      if (store.myRating) {
        // update rating
        await axios.put(
          `http://localhost:5000/api/stores/${store.id}/rating`,
          { rating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // submit new rating
        await axios.post(
          `http://localhost:5000/api/stores/${store.id}/rating`,
          { rating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchStores(); // refresh list
      alert("Rating saved successfully");
    } catch (err) {
      console.error("Failed to save rating", err);
      alert("Error saving rating");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading stores...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Browse Stores</h1>

      {/* Search bar */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />
        <button
          onClick={fetchStores}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Store List */}
      {stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <div className="grid gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white shadow-md rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold">{store.name}</h2>
              <p className="text-gray-600">{store.address}</p>
              <p className="mt-2">
                <strong>Average Rating:</strong> {store.avgRating} ⭐ (
                {store.ratingCount} reviews)
              </p>
              <p>
                <strong>Your Rating:</strong>{" "}
                {store.myRating ? store.myRating : "Not rated yet"}
              </p>

              {/* Rating input */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={ratingInputs[store.id] ?? store.myRating ?? ""}
                  onChange={(e) =>
                    setRatingInputs({
                      ...ratingInputs,
                      [store.id]: e.target.value,
                    })
                  }
                  className="border rounded-lg p-2 w-20"
                />
                <button
                  onClick={() => handleSaveRating(store)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Save Rating
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreList;
