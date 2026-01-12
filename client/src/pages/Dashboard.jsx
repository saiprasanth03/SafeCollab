import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/PageWrapper";
import {
  getGroupData,
  createGroupData,
  deleteGroupData,
  updateGroupData,
  getMyRole,
} from "../services/api";

function Dashboard() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [role, setRole] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load group data
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getGroupData();
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const groupId = localStorage.getItem("activeGroupId");

    // 🚫 Block dashboard access without group
    if (!groupId) {
      navigate("/groups", { replace: true });
      return;
    }

    loadData();
    getMyRole().then((res) => setRole(res.role));
  }, [navigate]);

  // Add / Update
  const submit = async () => {
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      await updateGroupData(editingId, { title, content });
      setEditingId(null);
    } else {
      await createGroupData({ title, content });
    }

    setTitle("");
    setContent("");
    loadData();
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setContent(item.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  return (
    <PageWrapper>
      <Navbar />

      <div className="min-h-screen bg-slate-100 p-4 flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
          <h1 className="text-xl font-bold mb-4">Group Data</h1>

          {/* ADMIN INPUT */}
          {role === "admin" && (
            <div className="space-y-2 mb-6">
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="w-full border rounded-lg px-3 py-2 min-h-[120px] selectable"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="flex gap-2">
                <button
                  onClick={submit}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                >
                  {editingId ? "Update" : "Add"}
                </button>

                {editingId && (
                  <button
                    onClick={cancelEdit}
                    className="flex-1 border py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ⏳ LOADING STATE */}
          {loading && (
            <div className="text-center py-10 text-gray-500 animate-pulse">
              <div className="text-3xl mb-2">⏳</div>
              <p className="font-medium">Please wait a second…</p>
            </div>
          )}

          {/* 📭 EMPTY STATE (ONLY AFTER LOADING) */}
          {!loading && data.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <div className="text-4xl mb-2">📭</div>
              <p className="font-medium">No data yet</p>
              {role === "admin" && (
                <p className="text-sm mt-1">
                  Add your first item to get started
                </p>
              )}
            </div>
          )}

          {/* 📄 DATA LIST */}
          {!loading &&
            data.map((item) => (
              <div
                key={item._id}
                className="bg-white border rounded-xl p-4 mb-3 shadow-sm hover:shadow transition"
              >
                <div className="flex items-start gap-3">
                  {/* TEXT */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-800 break-words selectable">
                      {item.title}
                    </h2>

                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-words selectable">
                      {item.content}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  {role === "admin" && (
                    <div className="flex shrink-0 gap-2 text-sm">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={async () => {
                          await deleteGroupData(item._id);
                          loadData();
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
