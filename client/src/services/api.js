const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "x-group-id": localStorage.getItem("activeGroupId"),
});

export const addMember = async (data) =>
  fetch(`${API_URL}/group/add-member`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(),
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// export const loginUser = async (data) => {
//   const res = await fetch(`${API_URL}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

export const getMyGroups = async () => {
  const res = await fetch(`${API_URL}/group/my-groups`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.json();
};


export const getGroupData = async () =>
  fetch(`${API_URL}/data`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-group-id": localStorage.getItem("activeGroupId"),
    },
  }).then((res) => res.json());

export const createGroupData = async (data) =>
  fetch(`${API_URL}/data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-group-id": localStorage.getItem("activeGroupId"),
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const deleteGroupData = async (id) =>
  fetch(`${API_URL}/data/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-group-id": localStorage.getItem("activeGroupId"),
    },
  }).then((res) => res.json());

export const getMyRole = async () =>
  fetch(`${API_URL}/group/my-role`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-group-id": localStorage.getItem("activeGroupId"),
    },
  }).then((res) => res.json());

export const updateGroupData = async (id, data) =>
fetch(`${API_URL}/data/${id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "x-group-id": localStorage.getItem("activeGroupId"),
  },
  body: JSON.stringify(data),
}).then((res) => res.json());

export const getGroupMembers = async () =>
  fetch(`${API_URL}/group/members`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-group-id": localStorage.getItem("activeGroupId"),
    },
  }).then((res) => res.json());

export const addGroupMember = async (data) =>
  fetch(`${API_URL}/group/add-member`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-group-id": localStorage.getItem("activeGroupId"),
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

  export const updateMemberRole = async (memberId, role) =>
  fetch(`${API_URL}/group/member/${memberId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-group-id": localStorage.getItem("activeGroupId"),
    },
    body: JSON.stringify({ role }),
  }).then((res) => res.json());

export const removeMember = async (memberId) =>
  fetch(`${API_URL}/group/member/${memberId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-group-id": localStorage.getItem("activeGroupId"),
    },
  }).then((res) => res.json());

  export const createGroup = async (data) => {
  const res = await fetch("http://localhost:5000/api/group/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteGroup = async (groupId) => {
  const res = await fetch(`${API_URL}/group/${groupId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Delete failed");
  }

  return data;
};

