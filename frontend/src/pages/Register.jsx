import { useState } from "react";
import { registerUser } from "../api/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(form);
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded w-96 space-y-3"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            type={key === "password" ? "password" : "text"}
            placeholder={key.replace("_", " ")}
            value={form[key]}
            onChange={handleChange}
            className="border p-2 w-full rounded capitalize"
          />
        ))}
        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          Register
        </button>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
