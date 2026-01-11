import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getGroupMembers,
  addGroupMember,
  updateMemberRole,
  removeMember,
  getMyRole,
} from "../services/api";
import { useNavigate } from "react-router-dom";

function GroupMembersPage() {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState("viewer");
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const loadMembers = async () => {
    const res = await getGroupMembers();
    setMembers(Array.isArray(res) ? res : []);
  };

  useEffect(() => {
    getMyRole().then((res) => {
      if (res.role !== "admin") {
        navigate("/dashboard"); // 🚫 no access
      } else {
        setRole(res.role);
        loadMembers();
      }
    });
  }, []);

  const addMember = async () => {
    if (!email) return;
    await addGroupMember({ email, role: newRole });
    setEmail("");
    setNewRole("viewer");
    loadMembers();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-100 p-4 flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
          <h1 className="text-xl font-bold mb-4">Group Members</h1>

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
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

          {/* MEMBERS LIST */}
          <div className="space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border rounded p-2"
              >
                <span className="text-sm">{m.email}</span>

                <div className="flex items-center gap-2">
                  <select
                    value={m.role}
                    onChange={async (e) => {
                      const newRole = e.target.value;

                      const confirmChange = window.confirm(
                        `Change role of ${m.email} to "${newRole}"?`
                      );
                      if (!confirmChange) return;

                      await updateMemberRole(m.id, newRole);
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
                      if (
                        window.confirm(
                          `Remove ${m.email} from this group?`
                        )
                      ) {
                        await removeMember(m.id);
                        loadMembers();
                      }
                    }}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupMembersPage;
