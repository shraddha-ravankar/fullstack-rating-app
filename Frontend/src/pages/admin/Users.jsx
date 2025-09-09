import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/admin/add-user", newUser, {
  headers: { Authorization: `Bearer ${token}` },
});
      console.log("Users API response:", res.data);
      setUsers(res.data.users || res.data); 
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle new user form change
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Submit new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      setNewUser({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "user",
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to add user", err);
    }
  };

  // Filtered + searched users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.address.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole ? u.role === filterRole : true;
    return matchSearch && matchRole;
  });

  if (loading) {
    return <p className="text-center mt-10">Loading users...</p>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {/* Add User Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newUser.address}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <select
              name="role"
              value={newUser.role}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save User
          </button>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Address</th>
              <th className="border p-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="border p-2">{u.name}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.address}</td>
                <td className="border p-2 capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <p className="text-center mt-4">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
