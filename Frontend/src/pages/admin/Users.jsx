import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
          params: filters,
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, [filters, token]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Filter by email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Filter by address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Avg Rating (if Owner)</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.address}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">
                  {user.role === "owner" ? user.avgRating : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
