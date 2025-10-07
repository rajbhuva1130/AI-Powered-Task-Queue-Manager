import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Profile() {
  const { user, setUser, logout, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [passwords, setPasswords] = useState({ old: "", new: "" });
  const [message, setMessage] = useState("");

  const handleEditToggle = () => setIsEditing(!isEditing);
  const handlePasswordToggle = () => setIsChangingPassword(!isChangingPassword);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://127.0.0.1:8000/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://127.0.0.1:8000/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });
      if (!res.ok) throw new Error("Failed to change password");
      setMessage("Password changed successfully!");
      setPasswords({ old: "", new: "" });
      setIsChangingPassword(false);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>
          {message && (
            <p className="text-center mb-4 text-green-600 font-medium">{message}</p>
          )}

          {/* Profile Details */}
          {!isEditing ? (
            <div className="space-y-2 text-gray-700">
              <p><strong>First Name:</strong> {user.first_name}</p>
              <p><strong>Last Name:</strong> {user.last_name}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Mobile:</strong> {user.mobile}</p>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleEditToggle}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit Details
                </button>
                <button
                  onClick={handlePasswordToggle}
                  className="bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Change Password
                </button>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={saveProfile} className="space-y-3">
              {["first_name", "last_name", "username", "email", "mobile"].map(
                (field) => (
                  <input
                    key={field}
                    name={field}
                    value={form[field] || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    placeholder={field.replace("_", " ")}
                  />
                )
              )}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleEditToggle}
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Change Password Section */}
          {isChangingPassword && (
            <form onSubmit={changePassword} className="mt-6 space-y-3">
              <input
                type="password"
                placeholder="Old Password"
                value={passwords.old}
                onChange={(e) =>
                  setPasswords({ ...passwords, old: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <div className="flex justify-center gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
