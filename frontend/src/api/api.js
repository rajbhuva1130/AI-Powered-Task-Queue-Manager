const API_BASE_URL = "http://127.0.0.1:8000"; // FastAPI backend URL

export async function registerUser(data) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, password }), // ✅ JSON body
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Login failed (${res.status}): ${errorText}`);
  }
  return res.json();
}


export async function getJobs(token) {
  const res = await fetch(`${API_BASE_URL}/jobs/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}


export async function createJob(title, description, token) {
  const res = await fetch("http://127.0.0.1:8000/jobs/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }), // ✅ using parameters
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create job (${res.status}): ${errorText}`);
  }

  return res.json();
}

export async function updateJob(id, title, description, token) {
  const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });
    if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update job (${res.status}): ${errorText}`);
  }
    return res.json();
}

export async function deleteJob(id, token) {
  const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete job (${res.status}): ${errorText}`);
  }
  return res.json();
}

export async function updateJobStatus(jobId, status, token) {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function editJob(jobId, updates, token) {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to edit job");
  return res.json();
}
