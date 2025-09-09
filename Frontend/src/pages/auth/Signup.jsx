import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../../api/authApi";
import { FiUser, FiMail, FiLock, FiHome, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const { confirmPassword, ...signupData } = formData;
      await signupUser(signupData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-surface shadow-2xl rounded-2xl p-8 space-y-5"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-primary">Create Account</h2>
            <p className="text-text-secondary mt-1">Join our community today!</p>
          </div>

          {error && (
            <p className="bg-red-50 border border-feedback-error text-red-700 text-sm rounded-lg p-3 text-center">
              {error}
            </p>
          )}

          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" name="name" placeholder="Full Name"
              value={formData.name} onChange={handleChange}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required disabled={isLoading}
            />
          </div>
          
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email" name="email" placeholder="Email Address"
              value={formData.email} onChange={handleChange}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required disabled={isLoading}
            />
          </div>

          <div className="relative">
            <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" name="address" placeholder="Address"
              value={formData.address} onChange={handleChange}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required disabled={isLoading}
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"} name="password" placeholder="Password"
              value={formData.password} onChange={handleChange}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required disabled={isLoading}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password"
              value={formData.confirmPassword} onChange={handleChange}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required disabled={isLoading}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full flex justify-center items-center bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? <FiLoader className="animate-spin mr-2" /> : null}
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-sm text-text-secondary text-center pt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;