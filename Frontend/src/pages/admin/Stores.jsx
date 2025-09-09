import { useEffect, useState } from "react";
import axios from "axios";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]); // for assigning owners
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    address: "",
    ownerId: "",
  });

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // Fetch stores
  const fetchStores = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/admin/add-store", newStore, {
  headers: { Authorization: `Bearer ${token}` },
});

      setStores(res.data);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch owners (for dropdown when adding store)
  const fetchOwners = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ownerList = res.data.filter((u) => u.role === "owner");
      setOwners(ownerList);
    } catch (err) {
      console.error("Failed to fetch owners:", err);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchOwners();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
  };

  // Submit new store
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/stores", newStore, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      setNewStore({ name: "", address: "", ownerId: "" });
      fetchStores();
    } catch (err) {
      console.error("Failed to add store:", err);
    }
  };

  // Filtered stores
  const filteredStores = stores.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return <p className="text-center mt-10">Loading stores...</p>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Stores</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Store"}
        </button>
      </div>

      {/* Add Store Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Store Name"
              value={newStore.name}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newStore.address}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <select
              name="ownerId"
              value={newStore.ownerId}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Owner</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Store
          </button>
        </form>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by store name or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
      </div>

      {/* Stores Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Address</th>
              <th className="border p-2 text-left">Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.email || "N/A"}</td>
                <td className="border p-2">{s.address}</td>
                <td className="border p-2">{s.rating || "0"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStores.length === 0 && (
          <p className="text-center mt-4">No stores found.</p>
        )}
      </div>
    </div>
  );
};

export default Stores;
