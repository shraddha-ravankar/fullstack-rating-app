import { useState } from "react";
import axios from "axios";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/auth/update-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Failed to update password", err);
      alert(err.response?.data?.error || "Error updating password");
    }
  };

  return (
    <div className="flex justify-center mt-12">
      <form
        onSubmit={handleUpdate}
        className="bg-white shadow-md rounded-lg p-8 w-96"
      >
        <h1 className="text-xl font-bold mb-6">Update Password</h1>

        <label className="block mb-2">Current Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="border rounded-lg p-2 w-full mb-4"
        />

        <label className="block mb-2">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border rounded-lg p-2 w-full mb-6"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
