import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const data = await loginUser(formData.email, formData.password);
      login({
        token: data.token,
        role: data.user.role,
        name: data.user.name,
      });
      const role = data.user.role.toLowerCase();
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "user") navigate("/user/dashboard");
      else if (role === "owner") navigate("/owner/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-surface shadow-2xl rounded-2xl p-8 space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-primary">Welcome Back!</h2>
            <p className="text-text-secondary mt-1">Sign in to continue</p>
          </div>

          {error && (
            <p className="bg-red-50 border border-feedback-error text-red-700 text-sm rounded-lg p-3 text-center">
              {error}
            </p>
          )}

          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email" name="email" placeholder="Email address"
              value={formData.email} onChange={handleChange}
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
            <button
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full flex justify-center items-center bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? <FiLoader className="animate-spin mr-2" /> : null}
            {isLoading ? "Signing In..." : "Login"}
          </button>

          <p className="text-sm text-text-secondary text-center pt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;