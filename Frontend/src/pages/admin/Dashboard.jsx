import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // NEW: filter by role
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      // Stats
      const statsRes = await axios.get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats({
        users: statsRes.data.totalUsers,
        stores: statsRes.data.totalStores,
        ratings: statsRes.data.totalRatings,
      });

      // Users
      const usersRes = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersRes.data.users);

      // Stores
      const storesRes = await axios.get("http://localhost:5000/api/admin/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(storesRes.data.stores);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filters
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.address.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase()) ||
      (s.owner?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.users} color="blue" />
        <StatCard title="Total Stores" value={stats.stores} color="green" />
        <StatCard title="Total Ratings" value={stats.ratings} color="yellow" />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setShowUserModal(true)}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
        >
          ➕ Add User
        </button>
        <button
          onClick={() => setShowStoreModal(true)}
          className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition"
        >
          🏬 Add Store
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <input
          type="text"
          placeholder="🔍 Search users or stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-3 border rounded-lg shadow-sm"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <DataTable
        title="👤 Users"
        headers={["#", "Name", "Email", "Address", "Role", "Avg Rating (if Owner)"]}
        rows={filteredUsers.map((u, i) => [
          i + 1,
          u.name,
          u.email,
          u.address,
          u.role,
          u.avgRating || "-",
        ])}
      />

      {/* Stores Table */}
      <DataTable
        title="🏬 Stores"
        headers={["#", "Name", "Address", "Owner Email", "Avg Rating"]}
        rows={filteredStores.map((s, i) => [
          i + 1,
          s.name,
          s.address,
          s.owner?.email || "-",
          s.avgRating || "-",
        ])}
      />

      {/* Modals */}
      {showUserModal && (
        <AddUserModal
          onClose={() => setShowUserModal(false)}
          onSuccess={(newUser) => setUsers([...users, newUser])}
        />
      )}
      {showStoreModal && (
        <AddStoreModal
          owners={users.filter((u) => u.role === "owner")}
          onClose={() => setShowStoreModal(false)}
          onSuccess={(newStore) => setStores([...stores, newStore])}
        />
      )}
    </div>
  );
};

/* ---------- REUSABLE COMPONENTS ---------- */
const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    yellow: "bg-yellow-500",
  };
  return (
    <div className={`${colors[color]} text-white rounded-xl shadow-lg p-6 text-center`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

const DataTable = ({ title, headers, rows }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 text-left">
          {headers.map((h, i) => (
            <th key={i} className="p-3 border">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {row.map((cell, cidx) => (
                <td key={cidx} className="p-3 border">{cell}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} className="text-center p-3 text-gray-500">
              No records found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

/* ---------- MODALS ---------- */
const AddUserModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", role: "user" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await axios.post("http://localhost:5000/api/admin/add-user", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Add User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Name" required className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" required className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" required className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input type="text" placeholder="Address" className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <select
          className="w-full p-2 border rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save User
        </button>
      </form>
    </ModalWrapper>
  );
};

const AddStoreModal = ({ onClose, onSuccess, owners }) => {
  const [form, setForm] = useState({ name: "", address: "", description: "", ownerId: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await axios.post("http://localhost:5000/api/admin/add-store", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.error("Error adding store:", err);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Add Store</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Store Name" required className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="text" placeholder="Address" required className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <textarea placeholder="Description" className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select
          className="w-full p-2 border rounded"
          value={form.ownerId}
          onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
        >
          <option value="">Select Owner</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
          ))}
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Save Store
        </button>
      </form>
    </ModalWrapper>
  );
};

const ModalWrapper = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={onClose}>
        ✖
      </button>
      {children}
    </div>
  </div>
);

export default AdminDashboard;
