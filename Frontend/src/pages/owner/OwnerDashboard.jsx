import { useEffect, useState } from "react";
import axios from "axios";

const OwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/owner/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStore(res.data.store);
      } catch (err) {
        console.error("Failed to fetch owner dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;

  if (!store) {
    return <p className="text-center mt-10">No store found for this owner.</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>

      {/* Store Info */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">{store.name}</h2>
        <p className="text-gray-600">{store.address}</p>
        <p className="mt-2">
          <span className="font-bold">Average Rating:</span>{" "}
          {store.avgRating ? store.avgRating : "No ratings yet"}
        </p>
      </div>

      {/* Ratings Table */}
      <h3 className="text-lg font-semibold mb-4">Users who rated your store</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Rating</th>
            </tr>
          </thead>
          <tbody>
            {store.ratings.map((r) => (
              <tr key={r.userId} className="hover:bg-gray-50">
                <td className="border p-2">{r.name}</td>
                <td className="border p-2">{r.email}</td>
                <td className="border p-2">{r.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {store.ratings.length === 0 && (
          <p className="text-center mt-4">No ratings yet.</p>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
