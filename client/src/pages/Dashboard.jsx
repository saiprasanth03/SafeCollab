import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import GroupMembers from "../components/GroupMembers";
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
  const navigate = useNavigate();

  const loadData = async () => {
    const res = await getGroupData();
    setData(Array.isArray(res) ? res : []); // ✅ SAFETY FIX
  };

  useEffect(() => {
    const groupId = localStorage.getItem("activeGroupId");

    // ✅ BLOCK ACCESS WITHOUT GROUP
    if (!groupId) {
      navigate("/groups");
      return;
    }

    loadData();
    getMyRole().then((res) => setRole(res.role));
  }, [navigate]);

  const submit = async () => {
    if (!title || !content) return;

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
  <>
   <PageWrapper>  
    <Navbar />
    <div className="min-h-screen bg-slate-100 p-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-bold mb-4">Group Data</h1>

        {/* ADMIN ONLY */}
        {role === "admin" && (
          <div className="space-y-2 mb-6">
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full border rounded-lg px-3 py-2"
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

        {/* DATA LIST */}
        {data.length === 0 && (
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


        {data.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-xl p-4 mb-3 shadow-sm hover:shadow transition"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <h2 className="font-semibold text-gray-800">{item.title}</h2>
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{item.content}</p>
              </div>

              {role === "admin" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteGroupData(item._id).then(loadData)}
                    className="text-red-500 text-sm hover:underline"
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
  </>  
  );
}

export default Dashboard;
