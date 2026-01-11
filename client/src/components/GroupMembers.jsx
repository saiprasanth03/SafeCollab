import { useEffect, useState } from "react";
import toast from "react-hot-toast"; 
import {
  getGroupMembers,
  addGroupMember,
  updateMemberRole,
  removeMember,
} from "../services/api";

function GroupMembers({ role }) {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState("viewer");
  const [loading, setLoading] = useState(false);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await getGroupMembers();
      setMembers(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to load members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      loadMembers();
    }
  }, [role]);

  const addMember = async () => {
    if (!email){
      toast.error("Email is required");
      return;
    }

    try {
      await addGroupMember({ email, role: newRole });
      toast.success("Member added successfully 👤");
      setEmail("");
      setNewRole("viewer");
      loadMembers();
    } catch (err) {
      toast.error(err.message || "Failed to add member");
    }
  };

  if (role !== "admin") return null;

  return (
    <div className="bg-white border rounded-xl p-4 mt-6">
      <h2 className="font-semibold mb-4">Group Members</h2>

      {/* ADD MEMBER */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="email"
          placeholder="user@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />

        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="viewer">Viewer (Read)</option>
          <option value="editor">Editor (Read + Edit)</option>
          <option value="admin">Admin (Full)</option>
        </select>

        <button
          onClick={addMember}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Add
        </button>
      </div>

      {/* MEMBERS LIST */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-gray-500">No members found.</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border rounded p-2"
            >
              <span className="text-sm font-medium">{m.email}</span>

              <div className="flex items-center gap-2">
              <select
                value={m.role}
                onChange={async (e) => {
                  const newRole = e.target.value;

                  // HARD BLOCK self-demotion
                  if (
                    m.email === localStorage.getItem("userEmail") &&
                    newRole !== "admin"
                  ) {
                    toast.error(
                      "❌ You cannot remove your own admin access",
                      { duration: 5000 }
                    );
                    return;
                  }

                  const ok = window.confirm(
                    `Change role of ${m.email} to "${newRole}"?`
                  );
                  if (!ok) return;

                  await updateMemberRole(m.id, newRole);
                  toast.success("Role updated");
                  loadMembers();
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>



                <button
                  onClick={async () => {
                    if (m.email === localStorage.getItem("userEmail")) {
                      toast.error(
                        "❌ You cannot remove yourself from the group",
                        { duration: 4000 }
                      );
                      return;
                    }

                    const ok = window.confirm(
                      `⚠️ Remove ${m.email} from this group?\n\nThis action cannot be undone.`
                    );
                    if (!ok) return;

                    await removeMember(m.id);
                    toast.success("Member removed");
                    loadMembers();
                  }}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupMembers;
