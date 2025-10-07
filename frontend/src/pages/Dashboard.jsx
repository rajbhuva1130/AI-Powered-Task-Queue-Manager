import { useEffect, useState } from "react";
import { createJob, updateJobStatus, editJob, deleteJob } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = "http://127.0.0.1:8000";
const COLORS = ["#60a5fa", "#f97316", "#22c55e"]; // blue, orange, green

export default function Dashboard() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch jobs
  useEffect(() => {
    if (!token) return;
    const fetchJobs = async () => {
      const res = await fetch(`${API_BASE_URL}/jobs/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setJobs(await res.json());
    };
    fetchJobs();
  }, [token]);

  // Add job
  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const data = await createJob(title, description, token);
      setJobs((prev) => [data.job, ...prev]);
      setTitle("");
      setDescription("");
      setMessage("Task added!");
    } catch {
      setMessage("Error adding job");
    }
  };

  // Update status
  const handleStatusChange = async (jobId, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setJobs((prev) =>
          prev.map((j) =>
            j.id === jobId ? { ...j, status: data.job.status } : j
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Begin editing
  const startEdit = (job) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditDescription(job.description || "");
  };

  // Save edit
  const handleEditSave = async () => {
    try {
      const res = await editJob(
        editingJob.id,
        { title: editTitle, description: editDescription },
        token
      );
      setJobs((prev) =>
        prev.map((j) =>
          j.id === editingJob.id ? { ...j, ...res.job } : j
        )
      );
      setEditingJob(null);
      setMessage("Task updated!");
    } catch {
      setMessage("Error updating task");
    }
  };

  // Delete task
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteJob(jobId, token);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      setMessage("Task deleted");
    } catch {
      setMessage("Error deleting task");
    }
  };

  // Chart data
  const chartData = ["TODO", "IN PROGRESS", "DONE"].map((s) => ({
    name: s,
    value: jobs.filter((j) => j.status === s).length,
  }));

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100 min-h-screen">
        {/* Left: tasks list */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Tasks</h2>

          {/* Add Task */}
          <form onSubmit={handleAddJob} className="mb-4 space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              className="border rounded p-2 w-full"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="border rounded p-2 w-full"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Task
            </button>
            {message && <p className="text-green-600 text-sm">{message}</p>}
          </form>

          {/* Jobs Table */}
          <table className="w-full text-left border-t">
            <thead>
              <tr className="border-b">
                <th className="p-2">Title</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b text-sm">
                  <td className="p-2 font-medium">
                    {editingJob?.id === job.id ? (
                      <div className="space-y-2">
                        <input
                          className="border p-1 w-full"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <textarea
                          className="border p-1 w-full"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                      </div>
                    ) : (
                      <>
                        <p>{job.title}</p>
                        <p className="text-gray-500 text-xs">
                          {job.description}
                        </p>
                      </>
                    )}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        job.status === "DONE"
                          ? "bg-green-500"
                          : job.status === "IN PROGRESS"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="p-2 space-x-1">
                    {editingJob?.id === job.id ? (
                      <>
                        <button
                          onClick={handleEditSave}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingJob(null)}
                          className="bg-gray-400 text-white px-2 py-1 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <select
                          value={job.status}
                          onChange={(e) =>
                            handleStatusChange(job.id, e.target.value)
                          }
                          className="border rounded p-1 text-xs"
                        >
                          <option value="TODO">TODO</option>
                          <option value="IN PROGRESS">IN PROGRESS</option>
                          <option value="DONE">DONE</option>
                        </select>
                        <button
                          onClick={() => startEdit(job)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Pie chart */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Task Status Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
