const API_URL = import.meta.env.VITE_API_URL;

/* -------------------- HELPERS -------------------- */

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const groupHeaders = () => ({
  ...authHeaders(),
  "x-group-id": localStorage.getItem("activeGroupId"),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

/* -------------------- AUTH -------------------- */

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

/* -------------------- GROUPS -------------------- */

export const getMyGroups = async () => {
  const res = await fetch(`${API_URL}/group/my-groups`, {
    headers: authHeaders(),
  });

  return handleResponse(res);
};

export const createGroup = async (data) => {
  const res = await fetch(`${API_URL}/group/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

export const deleteGroup = async (groupId) => {
  const res = await fetch(`${API_URL}/group/${groupId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return handleResponse(res);
};

export const getMyRole = async () => {
  const res = await fetch(`${API_URL}/group/my-role`, {
    headers: groupHeaders(),
  });

  return handleResponse(res);
};

/* -------------------- GROUP MEMBERS -------------------- */

export const getGroupMembers = async () => {
  const res = await fetch(`${API_URL}/group/members`, {
    headers: groupHeaders(),
  });

  return handleResponse(res);
};

export const addGroupMember = async (data) => {
  const res = await fetch(`${API_URL}/group/add-member`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-group-id": localStorage.getItem("activeGroupId"),
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to add member");
  }

  return json;
};


export const updateMemberRole = async (memberId, role) => {
  const res = await fetch(`${API_URL}/group/member/${memberId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...groupHeaders(),
    },
    body: JSON.stringify({ role }),
  });

  return handleResponse(res);
};

export const removeMember = async (memberId) => {
  const res = await fetch(`${API_URL}/group/member/${memberId}`, {
    method: "DELETE",
    headers: groupHeaders(),
  });

  return handleResponse(res);
};

/* -------------------- GROUP DATA -------------------- */

export const getGroupData = async () => {
  const res = await fetch(`${API_URL}/data`, {
    headers: groupHeaders(),
  });

  return handleResponse(res);
};

export const createGroupData = async (data) => {
  const res = await fetch(`${API_URL}/data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...groupHeaders(),
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

export const updateGroupData = async (id, data) => {
  const res = await fetch(`${API_URL}/data/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...groupHeaders(),
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

export const deleteGroupData = async (id) => {
  const res = await fetch(`${API_URL}/data/${id}`, {
    method: "DELETE",
    headers: groupHeaders(),
  });

  return handleResponse(res);
};
