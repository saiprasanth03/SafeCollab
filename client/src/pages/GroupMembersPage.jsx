import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getGroupMembers,
  addGroupMember as addGroupMemberAPI,
  updateMemberRole,
  removeMember,
  getMyRole,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function GroupMembersPage() {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState("viewer");
  const navigate = useNavigate();

  /* 🔹 LOAD MEMBERS */
  const loadMembers = async () => {
    try {
      const res = await getGroupMembers();
      setMembers(Array.isArray(res) ? res : []);
    } catch (err) {
      toast.error("Failed to load members");
    }
  };

  /* 🔹 CHECK ADMIN ROLE */
  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await getMyRole();
        if (res.role !== "admin") {
          toast.error("Admin access required");
          navigate("/groups");
        } else {
          loadMembers();
        }
      } catch {
        navigate("/login");
      }
    };

    checkRole();
  }, []);

  /* 🔹 ADD MEMBER */
  const handleAddMember = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      await addGroupMemberAPI({
        email,
        role: newRole,
      });

      toast.success("Member added successfully 🎉");
      setEmail("");
      setNewRole("viewer");
      loadMembers();
    } catch (err) {
      toast.error("User not registered");
    }
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
              onClick={handleAddMember}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
                      const role = e.target.value;

                      if (
                        !window.confirm(
                          `Change role of ${m.email} to "${role}"?`
                        )
                      )
                        return;

                      try {
                        await updateMemberRole(m.id, role);
                        toast.success("Role updated");
                        loadMembers();
                      } catch (err) {
                        toast.error(err.message || "Update failed");
                      }
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
                        !window.confirm(
                          `Remove ${m.email} from this group?`
                        )
                      )
                        return;

                      try {
                        await removeMember(m.id);
                        toast.success("Member removed");
                        loadMembers();
                      } catch (err) {
                        toast.error(err.message || "Remove failed");
                      }
                    }}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {members.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                No members found
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupMembersPage;
