import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyGroups, createGroup, deleteGroup } from "../services/api";
import toast from "react-hot-toast";

function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  const loadGroups = async () => {
    try {
      const res = await getMyGroups();
      setGroups(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to load groups", err);
      setError("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // OPEN GROUP
  const openGroup = (groupId) => {
    localStorage.setItem("activeGroupId", groupId);
    navigate("/dashboard");
  };

  // CREATE GROUP
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    try {
      setCreating(true);
      await createGroup({ name: groupName });
      toast.success("Group created successfully 🎉");
      setGroupName("");
      setShowCreate(false);
      loadGroups();
    } catch {
      toast.error("Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  // DELETE GROUP (ADMIN ONLY)
  const handleDeleteGroup = async (groupId, groupName) => {
    const confirm1 = window.confirm(
      `⚠️ DELETE GROUP WARNING\n\n` +
        `Group: ${groupName}\n\n` +
        `This will permanently delete:\n` +
        `• All group data\n` +
        `• All members\n\n` +
        `This action CANNOT be undone.\n\nProceed?`
    );
    if (!confirm1) return;

    const confirm2 = window.confirm(
      "❗ LAST WARNING!\n\nThis action CANNOT be undone.\n\nPress OK to delete."
    );
    if (!confirm2) return;

    try {
      await deleteGroup(groupId);

      if (localStorage.getItem("activeGroupId") === groupId) {
        localStorage.removeItem("activeGroupId");
      }

      setGroups((prev) =>
        prev.filter((g) => g.groupId !== groupId)
      );

      toast.success("Group deleted successfully 🗑️");
    } catch (err) {
      toast.error(err.message || "Failed to delete group");
    }
  };

  return (
    <>
     
      <Navbar />

      <div className="min-h-screen bg-slate-100 p-4 flex justify-center">
        <div className="w-full max-w-lg bg-white rounded-xl shadow p-6">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">My Groups</h1>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              + Create Group
            </button>
          </div>

          {loading && (
            <p className="text-center text-gray-500">Loading groups…</p>
          )}

          {error && (
            <p className="text-center text-red-600">{error}</p>
          )}

          {!loading && groups.length === 0 && (
            <p className="text-gray-500 text-sm text-center">
              You are not part of any group yet.
            </p>
          )}

          {groups.map((g) => (
            <div
              key={g.groupId}
              onClick={() => openGroup(g.groupId)}
              className="p-3 mb-2 cursor-pointer rounded-lg border flex justify-between items-center hover:bg-slate-50"
            >
              <div>
                <div className="font-medium">{g.name}</div>
                <div className="text-sm text-gray-500">
                  Role: {g.role}
                </div>
              </div>

              {g.role === "admin" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGroup(g.groupId, g.name);
                  }}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CREATE GROUP MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Create New Group
            </h2>

            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateGroup}
                disabled={creating}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {creating ? "Creating…" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyGroups;
