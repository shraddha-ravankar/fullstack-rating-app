import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChevronDown, User } from "lucide-react"; // ✅ icons

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* Left Logo */}
      <div className="font-bold text-xl tracking-wide">Store Rating System</div>

      {user && (
        <div className="flex items-center space-x-6">
          {/* Links depending on role */}
          {user.role === "user" && (
            <Link to="/user/stores" className="hover:underline">
              Stores
            </Link>
          )}
          {user.role === "owner" && (
            <Link to="/owner/stores" className="hover:underline">
              My Stores
            </Link>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-800 transition"
            >
              <User size={18} />
              <span className="font-medium">{user.name}</span>
              <ChevronDown size={16} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden">
                <Link
                  to="/update-password"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Update Password
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
