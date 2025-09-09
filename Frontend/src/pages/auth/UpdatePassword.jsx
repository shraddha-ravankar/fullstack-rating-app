import { useState, useContext } from "react";
import { updatePassword } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";

const UpdatePassword = () => {
  const { user } = useContext(AuthContext); 
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(formData.oldPassword, formData.newPassword);
      setMessage(" Password updated successfully.");
      setError("");
      setFormData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setError("Password update failed. Check your old password.");
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <h2 className="text-3xl font-bold mb-2 text-center text-indigo-700">
          Update Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {user?.role
            ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Panel`
            : "User Panel"}
        </p>

        {/* Success/Error */}
        {message && (
          <p className="text-green-600 text-sm mb-3 text-center">{message}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Old Password */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Old Password
        </label>
        <input
          type="password"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />

        {/* New Password */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 mb-6 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
