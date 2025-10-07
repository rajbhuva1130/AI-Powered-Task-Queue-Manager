import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/dashboard" className="text-xl font-bold">
        AI Task Queue Manager
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/profile">
          <FaUserCircle className="text-3xl hover:text-blue-400 transition" />
        </Link>
      </div>
    </nav>
  );
}
