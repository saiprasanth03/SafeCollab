import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyGroups, getMyRole } from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [role, setRole] = useState(null);
  const [activeGroupId, setActiveGroupId] = useState(
    localStorage.getItem("activeGroupId") || ""
  );

  // Load groups
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const res = await getMyGroups();
        setGroups(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to load groups", err);
      }
    };

    loadGroups();
  }, []);

  // Load role (depends on active group)
  useEffect(() => {
    if (!activeGroupId) return;

    const loadRole = async () => {
      try {
        const res = await getMyRole();
        setRole(res.role);
      } catch (err) {
        console.error("Failed to load role", err);
      }
    };

    loadRole();
  }, [activeGroupId]);

  const switchGroup = (groupId) => {
    if (!groupId) return;
    localStorage.setItem("activeGroupId", groupId);
    navigate("/dashboard"); // SPA navigation (no reload)
  };


  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeGroupId");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 w-full h-14 bg-white border-b flex items-center justify-between px-4 sm:px-6">
      {/* App name */}
      <h1
        className="font-bold text-lg text-blue-600 cursor-pointer"
        onClick={() => navigate("/groups")}
      >
        SafeCollab
      </h1>

      <div className="flex items-center gap-3">
        {/* Group Switcher */}
        {groups.length > 0 && (
          <select
            value={activeGroupId}
            onChange={(e) => switchGroup(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="" disabled>
              Select group
            </option>
            {groups.map((g) => (
              <option key={g.groupId} value={g.groupId}>
                {g.name}
              </option>
            ))}
          </select>
        )}

        {/* Members button (ADMIN ONLY) */}
        {role === "admin" && activeGroupId && (
          <button
            onClick={() => navigate("/members")}
            className="text-sm text-blue-600 hover:underline"
          >
            Members
          </button>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
