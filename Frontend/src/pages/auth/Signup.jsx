import { useState } from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../../api/authApi";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Client-side validation
  const validateForm = () => {
    const { name, email, address, password } = formData;

    if (name.length < 20 || name.length > 60) {
      return "Name must be between 20 and 60 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address.";
    }

    if (!address || address.length < 10) {
      return "Address must be at least 10 characters.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return null; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    try {
      await signupUser(
        formData.name,
        formData.email,
        formData.address,
        formData.password
      );
      setMessage("Signup successful. You can login now.");
      setError("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Signup failed. Try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-100 to-indigo-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 w-96 border border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Signup</h2>
        {message && <p className="text-green-600 text-sm mb-3 text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <p className="text-xs text-gray-500">Must be 20–60 characters.</p>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-600">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="2"
            required
          />
          <p className="text-xs text-gray-500">At least 10 characters.</p>
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <p className="text-xs text-gray-500">At least 6 characters.</p>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Signup
        </button>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
